import { supabase } from '@/lib/supabase'
import type { Follow, Like, Comment, CommentWithUser } from '@/types/database.types'

export const socialService = {
    /**
     * Follow a user
     */
    async followUser(followerId: string, followeeId: string) {
        if (followerId === followeeId) {
            throw new Error('Cannot follow yourself')
        }

        const { data, error } = await supabase
            .from('follows')
            .insert({
                follower_id: followerId,
                followee_id: followeeId,
            })
            .select()
            .single()

        if (error) throw error
        return data
    },

    /**
     * Unfollow a user
     */
    async unfollowUser(followerId: string, followeeId: string) {
        const { error } = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', followerId)
            .eq('followee_id', followeeId)

        if (error) throw error
    },

    /**
     * Check if user is following another user
     */
    async isFollowing(followerId: string, followeeId: string): Promise<boolean> {
        const { data } = await supabase
            .from('follows')
            .select('follower_id')
            .eq('follower_id', followerId)
            .eq('followee_id', followeeId)
            .single()

        return !!data
    },

    /**
     * Get followers list
     */
    async getFollowers(userId: string, limit = 50) {
        const { data, error } = await supabase
            .from('follows')
            .select(`
        follower_id,
        created_at,
        follower:users!follows_follower_id_fkey(id, handle, display_name, avatar_url, is_verified)
      `)
            .eq('followee_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) throw error
        return data
    },

    /**
     * Get following list
     */
    async getFollowing(userId: string, limit = 50) {
        const { data, error } = await supabase
            .from('follows')
            .select(`
        followee_id,
        created_at,
        followee:users!follows_followee_id_fkey(id, handle, display_name, avatar_url, is_verified)
      `)
            .eq('follower_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) throw error
        return data
    },

    /**
     * Like a target (post, comment, etc.)
     */
    async like(userId: string, targetType: string, targetId: string) {
        const { data, error } = await supabase
            .from('likes')
            .insert({
                user_id: userId,
                target_type: targetType,
                target_id: targetId,
            })
            .select()
            .single()

        if (error) {
            // Ignore duplicate likes
            if (error.code === '23505') return null
            throw error
        }
        return data
    },

    /**
     * Unlike a target
     */
    async unlike(userId: string, targetType: string, targetId: string) {
        const { error } = await supabase
            .from('likes')
            .delete()
            .eq('user_id', userId)
            .eq('target_type', targetType)
            .eq('target_id', targetId)

        if (error) throw error
    },

    /**
     * Get likes for a target
     */
    async getLikes(targetType: string, targetId: string, limit = 50) {
        const { data, error } = await supabase
            .from('likes')
            .select(`
        id,
        created_at,
        user:users!likes_user_id_fkey(id, handle, display_name, avatar_url, is_verified)
      `)
            .eq('target_type', targetType)
            .eq('target_id', targetId)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) throw error
        return data
    },

    /**
     * Add a comment
     */
    async addComment(userId: string, postId: string, content: string, parentId?: string) {
        const { data, error } = await supabase
            .from('comments')
            .insert({
                user_id: userId,
                post_id: postId,
                content,
                parent_id: parentId,
            })
            .select()
            .single()

        if (error) throw error
        return data
    },

    /**
     * Update comment
     */
    async updateComment(commentId: string, userId: string, content: string) {
        const { data, error } = await supabase
            .from('comments')
            .update({
                content,
                updated_at: new Date().toISOString(),
            })
            .eq('id', commentId)
            .eq('user_id', userId)
            .select()
            .single()

        if (error) throw error
        return data
    },

    /**
     * Delete comment
     */
    async deleteComment(commentId: string, userId: string) {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId)
            .eq('user_id', userId)

        if (error) throw error
    },

    /**
     * Get comments for a post (with nested replies)
     */
    async getComments(postId: string): Promise<CommentWithUser[]> {
        const { data: comments, error } = await supabase
            .from('comments')
            .select(`
        *,
        user:users!comments_user_id_fkey(id, handle, display_name, avatar_url, is_verified)
      `)
            .eq('post_id', postId)
            .order('created_at', { ascending: true })

        if (error) throw error

        // Build nested structure
        const commentMap = new Map<string, CommentWithUser>()
        const rootComments: CommentWithUser[] = []

        comments?.forEach((comment) => {
            const commentWithReplies = { ...comment, replies: [] } as CommentWithUser
            commentMap.set(comment.id, commentWithReplies)
        })

        comments?.forEach((comment) => {
            const commentWithReplies = commentMap.get(comment.id)!
            if (comment.parent_id) {
                const parent = commentMap.get(comment.parent_id)
                if (parent) {
                    parent.replies = parent.replies || []
                    parent.replies.push(commentWithReplies)
                }
            } else {
                rootComments.push(commentWithReplies)
            }
        })

        return rootComments
    },
}
