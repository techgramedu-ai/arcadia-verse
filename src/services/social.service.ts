import { supabase } from '@/integrations/supabase/client'

export const socialService = {
    /**
     * Follow a user
     */
    async followUser(followerId: string, followeeId: string) {
        if (followerId === followeeId) {
            throw new Error('Cannot follow yourself')
        }

        const { error } = await supabase
            .from('follows')
            .insert({
                follower_id: followerId,
                following_id: followeeId,
            })

        if (error) throw error
    },

    /**
     * Unfollow a user
     */
    async unfollowUser(followerId: string, followeeId: string) {
        const { error } = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', followerId)
            .eq('following_id', followeeId)

        if (error) throw error
    },

    /**
     * Check if following
     */
    async isFollowing(followerId: string, followeeId: string): Promise<boolean> {
        const { data } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', followerId)
            .eq('following_id', followeeId)
            .single()

        return !!data
    },

    /**
     * Get followers
     */
    async getFollowers(userId: string) {
        const { data, error } = await supabase
            .from('follows')
            .select('follower_id')
            .eq('following_id', userId)

        if (error) throw error
        return data?.map(f => f.follower_id) || []
    },

    /**
     * Get following
     */
    async getFollowing(userId: string) {
        const { data, error } = await supabase
            .from('follows')
            .select('following_id')
            .eq('follower_id', userId)

        if (error) throw error
        return data?.map(f => f.following_id) || []
    },

    /**
     * Like a post
     */
    async like(userId: string, targetType: string, targetId: string) {
        if (targetType === 'post') {
            const { error } = await supabase
                .from('post_likes')
                .insert({
                    user_id: userId,
                    post_id: targetId,
                })

            if (error && error.code !== '23505') throw error // Ignore duplicate

            // Update likes count
            const { data: post } = await supabase
                .from('posts')
                .select('likes_count')
                .eq('id', targetId)
                .single()

            await supabase
                .from('posts')
                .update({ likes_count: (post?.likes_count || 0) + 1 })
                .eq('id', targetId)
        }
    },

    /**
     * Unlike a post
     */
    async unlike(userId: string, targetType: string, targetId: string) {
        if (targetType === 'post') {
            const { error } = await supabase
                .from('post_likes')
                .delete()
                .eq('user_id', userId)
                .eq('post_id', targetId)

            if (error) throw error

            const { data: post } = await supabase
                .from('posts')
                .select('likes_count')
                .eq('id', targetId)
                .single()

            await supabase
                .from('posts')
                .update({ likes_count: Math.max(0, (post?.likes_count || 1) - 1) })
                .eq('id', targetId)
        }
    },

    /**
     * Get likes for a target
     */
    async getLikes(targetType: string, targetId: string) {
        if (targetType === 'post') {
            const { data, error } = await supabase
                .from('post_likes')
                .select('user_id')
                .eq('post_id', targetId)

            if (error) throw error
            return data?.map(l => l.user_id) || []
        }
        return []
    },

    /**
     * Add comment
     */
    async addComment(userId: string, postId: string, content: string, _parentId?: string) {
        const { data, error } = await supabase
            .from('comments')
            .insert({
                user_id: userId,
                post_id: postId,
                content,
            })
            .select()
            .single()

        if (error) throw error

        const { data: post } = await supabase
            .from('posts')
            .select('comments_count')
            .eq('id', postId)
            .single()

        await supabase
            .from('posts')
            .update({ comments_count: (post?.comments_count || 0) + 1 })
            .eq('id', postId)

        return data
    },

    /**
     * Delete comment
     */
    async deleteComment(commentId: string, userId: string) {
        const { data: comment } = await supabase
            .from('comments')
            .select('post_id')
            .eq('id', commentId)
            .eq('user_id', userId)
            .single()

        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId)
            .eq('user_id', userId)

        if (error) throw error

        if (comment) {
            const { data: post } = await supabase
                .from('posts')
                .select('comments_count')
                .eq('id', comment.post_id)
                .single()

            await supabase
                .from('posts')
                .update({ comments_count: Math.max(0, (post?.comments_count || 1) - 1) })
                .eq('id', comment.post_id)
        }
    },

    /**
     * Get comments for a post
     */
    async getComments(postId: string) {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: true })

        if (error) throw error
        return data || []
    },
}
