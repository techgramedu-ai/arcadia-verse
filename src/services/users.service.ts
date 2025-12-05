import { supabase } from '@/integrations/supabase/client'

export interface UpdateProfileData {
    display_name?: string
    username?: string
    avatar_url?: string
    bio?: string
    location?: string
    website?: string
}

export const usersService = {
    /**
     * Get user profile by user ID
     */
    async getUserById(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single()

        if (error && error.code !== 'PGRST116') throw error
        return data
    },

    /**
     * Get user by handle/username
     */
    async getUserByHandle(handle: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .ilike('username', handle)
            .single()

        if (error && error.code !== 'PGRST116') throw error
        return data
    },

    /**
     * Update user profile
     */
    async updateProfile(userId: string, data: UpdateProfileData) {
        const { data: profile, error } = await supabase
            .from('profiles')
            .update({
                ...data,
                updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)
            .select()
            .single()

        if (error) throw error
        return profile
    },

    /**
     * Search users by username or display name
     */
    async searchUsers(query: string, limit = 20) {
        const { data, error } = await supabase
            .from('profiles')
            .select('id, user_id, username, display_name, avatar_url, verified')
            .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
            .limit(limit)

        if (error) throw error
        return data || []
    },

    /**
     * Get user stats (posts, followers, following)
     */
    async getUserStats(userId: string) {
        const [postsCount, followersCount, followingCount] = await Promise.all([
            supabase
                .from('posts')
                .select('id', { count: 'exact', head: true })
                .eq('user_id', userId),
            supabase
                .from('follows')
                .select('follower_id', { count: 'exact', head: true })
                .eq('following_id', userId),
            supabase
                .from('follows')
                .select('following_id', { count: 'exact', head: true })
                .eq('follower_id', userId),
        ])

        return {
            posts: postsCount.count || 0,
            followers: followersCount.count || 0,
            following: followingCount.count || 0,
        }
    },
}
