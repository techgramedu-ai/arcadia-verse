import { supabase } from '@/lib/supabase'
import type { Post, PostWithUser, PostVisibility } from '@/types/database.types'

export interface CreatePostData {
    caption?: string
    content?: any
    visibility?: PostVisibility
    language?: string
    mediaIds?: string[]
}

export interface UpdatePostData {
    caption?: string
    content?: any
    visibility?: PostVisibility
    is_pinned?: boolean
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
                caption: data.caption,
                content: data.content || {},
                visibility: data.visibility || 'public',
                language: data.language,
            })
            .select()
            .single()

        if (error) throw error

        // Link media to post if provided
        if (data.mediaIds && data.mediaIds.length > 0) {
            const { error: mediaError } = await supabase
                .from('media')
                .update({ post_id: post.id })
                .in('id', data.mediaIds)

            if (mediaError) console.error('Failed to link media:', mediaError)
        }

        return post
    },

    /**
     * Get post by ID with user and media
     */
    async getPostById(postId: string, currentUserId?: string): Promise<PostWithUser | null> {
        const { data: post, error } = await supabase
            .from('posts')
            .select(`
        *,
        user:users!posts_user_id_fkey(*)
      `)
            .eq('id', postId)
            .single()

        if (error) {
            if (error.code === 'PGRST116') return null
            throw error
        }

        // Get media
        const { data: media } = await supabase
            .from('media')
            .select('*')
            .eq('post_id', postId)

        // Get counts
        const [likesCount, commentsCount, isLiked] = await Promise.all([
            supabase
                .from('likes')
                .select('id', { count: 'exact', head: true })
                .eq('target_type', 'post')
                .eq('target_id', postId),
            supabase
                .from('comments')
                .select('id', { count: 'exact', head: true })
                .eq('post_id', postId),
            currentUserId
                ? supabase
                    .from('likes')
                    .select('id')
                    .eq('user_id', currentUserId)
                    .eq('target_type', 'post')
                    .eq('target_id', postId)
                    .single()
                : Promise.resolve({ data: null }),
        ])

        return {
            ...post,
            media: media || [],
            likes_count: likesCount.count || 0,
            comments_count: commentsCount.count || 0,
            is_liked: !!isLiked.data,
        } as PostWithUser
    },

    /**
     * Get feed (paginated)
     */
    async getFeed(page = 0, limit = 20, currentUserId?: string) {
        const from = page * limit
        const to = from + limit - 1

        const { data: posts, error, count } = await supabase
            .from('posts')
            .select(`
        *,
        user:users!posts_user_id_fkey(id, handle, display_name, avatar_url, is_verified)
      `, { count: 'exact' })
            .eq('visibility', 'public')
            .order('created_at', { ascending: false })
            .range(from, to)

        if (error) throw error

        // Enrich posts with media and counts
        const enrichedPosts = await Promise.all(
            (posts || []).map(async (post) => {
                const [media, likesCount, commentsCount, isLiked] = await Promise.all([
                    supabase
                        .from('media')
                        .select('*')
                        .eq('post_id', post.id),
                    supabase
                        .from('likes')
                        .select('id', { count: 'exact', head: true })
                        .eq('target_type', 'post')
                        .eq('target_id', post.id),
                    supabase
                        .from('comments')
                        .select('id', { count: 'exact', head: true })
                        .eq('post_id', post.id),
                    currentUserId
                        ? supabase
                            .from('likes')
                            .select('id')
                            .eq('user_id', currentUserId)
                            .eq('target_type', 'post')
                            .eq('target_id', post.id)
                            .single()
                        : Promise.resolve({ data: null }),
                ])

                return {
                    ...post,
                    media: media.data || [],
                    likes_count: likesCount.count || 0,
                    comments_count: commentsCount.count || 0,
                    is_liked: !!isLiked.data,
                }
            })
        )

        return {
            posts: enrichedPosts as PostWithUser[],
            total: count || 0,
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
            .select(`
        *,
        user:users!posts_user_id_fkey(id, handle, display_name, avatar_url, is_verified)
      `, { count: 'exact' })
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .range(from, to)

        if (error) throw error

        return {
            posts: posts || [],
            total: count || 0,
            hasMore: (count || 0) > to + 1,
        }
    },

    /**
     * Update post
     */
    async updatePost(postId: string, userId: string, data: UpdatePostData) {
        const updates: Partial<Post> = {
            ...data,
            updated_at: new Date().toISOString(),
        }

        const { data: post, error } = await supabase
            .from('posts')
            .update(updates)
            .eq('id', postId)
            .eq('user_id', userId) // Ensure user owns the post
            .select()
            .single()

        if (error) throw error
        return post
    },

    /**
     * Delete post
     */
    async deletePost(postId: string, userId: string) {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)
            .eq('user_id', userId) // Ensure user owns the post

        if (error) throw error
    },

    /**
     * Pin/unpin post
     */
    async togglePinPost(postId: string, userId: string) {
        // Get current pin status
        const { data: post } = await supabase
            .from('posts')
            .select('is_pinned')
            .eq('id', postId)
            .eq('user_id', userId)
            .single()

        if (!post) throw new Error('Post not found or unauthorized')

        return this.updatePost(postId, userId, { is_pinned: !post.is_pinned })
    },
}
