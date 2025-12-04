import { supabase } from '@/lib/supabase'
import type { Story } from '@/types/database.types'

export interface CreateStoryData {
    mediaId: string
    privacy?: any
}

export const storiesService = {
    /**
     * Create a new story (expires in 24 hours)
     */
    async createStory(userId: string, data: CreateStoryData) {
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 24)

        const { data: story, error } = await supabase
            .from('stories')
            .insert({
                user_id: userId,
                media_id: data.mediaId,
                expires_at: expiresAt.toISOString(),
                privacy: data.privacy || {},
            })
            .select()
            .single()

        if (error) throw error
        return story
    },

    /**
     * Get active stories (not expired)
     */
    async getActiveStories(userId?: string) {
        let query = supabase
            .from('stories')
            .select(`
        *,
        user:users!stories_user_id_fkey(id, handle, display_name, avatar_url, is_verified),
        media:media!stories_media_id_fkey(*)
      `)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })

        if (userId) {
            query = query.eq('user_id', userId)
        }

        const { data, error } = await query

        if (error) throw error
        return data
    },

    /**
     * Get stories from followed users
     */
    async getFollowingStories(userId: string) {
        // Get list of users the current user follows
        const { data: following } = await supabase
            .from('follows')
            .select('followee_id')
            .eq('follower_id', userId)

        if (!following || following.length === 0) return []

        const followeeIds = following.map((f) => f.followee_id)

        const { data: stories, error } = await supabase
            .from('stories')
            .select(`
        *,
        user:users!stories_user_id_fkey(id, handle, display_name, avatar_url, is_verified),
        media:media!stories_media_id_fkey(*)
      `)
            .in('user_id', followeeIds)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })

        if (error) throw error
        return stories
    },

    /**
     * View a story (increment view count)
     */
    async viewStory(storyId: string) {
        const { error } = await supabase.rpc('increment_story_views', {
            story_id: storyId,
        })

        // If RPC doesn't exist, fallback to manual increment
        if (error) {
            const { data: story } = await supabase
                .from('stories')
                .select('viewers_count')
                .eq('id', storyId)
                .single()

            if (story) {
                await supabase
                    .from('stories')
                    .update({ viewers_count: (story.viewers_count || 0) + 1 })
                    .eq('id', storyId)
            }
        }
    },

    /**
     * Delete a story
     */
    async deleteStory(storyId: string, userId: string) {
        const { error } = await supabase
            .from('stories')
            .delete()
            .eq('id', storyId)
            .eq('user_id', userId)

        if (error) throw error
    },

    /**
     * Delete expired stories (cleanup function)
     */
    async deleteExpiredStories() {
        const { error } = await supabase
            .from('stories')
            .delete()
            .lt('expires_at', new Date().toISOString())

        if (error) throw error
    },
}
