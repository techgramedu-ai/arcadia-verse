import { supabase } from '@/integrations/supabase/client'

export interface CreateStoryData {
    media_url: string
    media_type?: string
}

export const storiesService = {
    /**
     * Create a new story
     */
    async createStory(userId: string, data: CreateStoryData) {
        const { data: story, error } = await supabase
            .from('stories')
            .insert({
                user_id: userId,
                media_url: data.media_url,
                media_type: data.media_type || 'image',
            })
            .select()
            .single()

        if (error) throw error
        return story
    },

    /**
     * Get stories from followed users
     */
    async getFollowingStories(userId: string) {
        const { data: following } = await supabase
            .from('follows')
            .select('following_id')
            .eq('follower_id', userId)

        const followingIds = following?.map(f => f.following_id) || []
        followingIds.push(userId)

        const { data: stories, error } = await supabase
            .from('stories')
            .select('*')
            .in('user_id', followingIds)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })

        if (error) throw error

        // Get profiles
        const userIds = [...new Set((stories || []).map(s => s.user_id))]
        const { data: profiles } = await supabase
            .from('profiles')
            .select('user_id, username, display_name, avatar_url')
            .in('user_id', userIds)

        const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || [])

        return (stories || []).map(story => ({
            ...story,
            profiles: profileMap.get(story.user_id) || null,
        }))
    },

    /**
     * Get user stories
     */
    async getUserStories(userId: string) {
        const { data, error } = await supabase
            .from('stories')
            .select('*')
            .eq('user_id', userId)
            .gt('expires_at', new Date().toISOString())
            .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
    },

    /**
     * Delete story
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
     * Increment view count
     */
    async viewStory(storyId: string) {
        const { data: story } = await supabase
            .from('stories')
            .select('views_count')
            .eq('id', storyId)
            .single()

        await supabase
            .from('stories')
            .update({ views_count: (story?.views_count || 0) + 1 })
            .eq('id', storyId)
    },
}
