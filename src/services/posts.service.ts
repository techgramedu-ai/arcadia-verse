import { supabase } from '@/integrations/supabase/client'

export interface CreatePostData {
    content: string
    media_url?: string
    media_type?: string
    exam_category?: string
    tags?: string[]
}

export interface UpdatePostData {
    content?: string
    media_url?: string
    media_type?: string
    exam_category?: string
    tags?: string[]
}

export const postsService = {
    /**
     * Create a new post
     */
    async createPost(userId: string, data: CreatePostData) {
        const { data: post, error } = await supabase
            .from('posts')
            .insert({
                user_id: userId,
                content: data.content,
                media_url: data.media_url || null,
                media_type: data.media_type || null,
                exam_category: data.exam_category || null,
                tags: data.tags || null,
            })
            .select()
            .single()

        if (error) throw error
        return post
    },

    /**
     * Get post by ID
     */
    async getPostById(postId: string, currentUserId?: string) {
        const { data: post, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single()

        if (error) throw error

        // Get profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('username, display_name, avatar_url, verified, badge')
            .eq('user_id', post.user_id)
            .single()

        // Check if current user has liked
        let userHasLiked = false
        if (currentUserId) {
            const { data: like } = await supabase
                .from('post_likes')
                .select('id')
                .eq('post_id', postId)
                .eq('user_id', currentUserId)
                .single()
            userHasLiked = !!like
        }

        return { ...post, profiles: profile, user_has_liked: userHasLiked }
    },

    /**
     * Get feed posts
     */
    async getFeed(page = 0, limit = 20, currentUserId?: string) {
        const from = page * limit
        const to = from + limit - 1

        const { data: posts, error, count } = await supabase
            .from('posts')
            .select('*', { count: 'exact' })
            .order('created_at', { ascending: false })
            .range(from, to)

        if (error) throw error

        // Get profiles for all posts
        const userIds = [...new Set((posts || []).map(p => p.user_id))]
        const { data: profiles } = await supabase
            .from('profiles')
            .select('user_id, username, display_name, avatar_url, verified, badge')
            .in('user_id', userIds)

        const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || [])

        // Get likes for current user if logged in
        let userLikes = new Set<string>()
        if (currentUserId && posts && posts.length > 0) {
            const postIds = posts.map(p => p.id)
            const { data: likes } = await supabase
                .from('post_likes')
                .select('post_id')
                .eq('user_id', currentUserId)
                .in('post_id', postIds)
            
            userLikes = new Set(likes?.map(l => l.post_id) || [])
        }

        const postsWithProfiles = (posts || []).map(post => ({
            ...post,
            profiles: profileMap.get(post.user_id) || null,
            user_has_liked: userLikes.has(post.id),
        }))

        return {
            posts: postsWithProfiles,
            hasMore: (count || 0) > to + 1,
        }
    },

    /**
     * Get user posts
     */
    async getUserPosts(userId: string, page = 0, limit = 20) {
        const from = page * limit
        const to = from + limit - 1

        const { data: posts, error, count } = await supabase
            .from('posts')
            .select('*', { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(from, to)

        if (error) throw error

        return {
            posts: posts || [],
            hasMore: (count || 0) > to + 1,
        }
    },

    /**
     * Update post
     */
    async updatePost(postId: string, userId: string, data: UpdatePostData) {
        const { data: post, error } = await supabase
            .from('posts')
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq('id', postId)
            .eq('user_id', userId)
            .select()
            .single()

        if (error) throw error
        return post
    },

    /**
     * Delete post
     */
    async deletePost(postId: string, userId: string) {
        await supabase.from('post_likes').delete().eq('post_id', postId)
        await supabase.from('comments').delete().eq('post_id', postId)

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)
            .eq('user_id', userId)

        if (error) throw error
    },

    /**
     * Toggle pin post - placeholder
     */
    async togglePinPost(_postId: string, _userId: string) {
        // Not implemented - would require adding is_pinned column
    },
}
