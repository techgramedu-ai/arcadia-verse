import { supabase } from '@/lib/supabase'
import type { User, Profile, UserWithProfile } from '@/types/database.types'

export interface UpdateProfileData {
    display_name?: string
    avatar_url?: string
    profile_type?: 'personal' | 'professional' | 'company'
    headline?: string
    bio?: string
    location?: string
    website?: string
    skills?: string[]
    education?: any[]
    experience?: any[]
    portfolio_links?: string[]
}

export const usersService = {
    /**
     * Get user by ID with profile
     */
    async getUserById(userId: string): Promise<UserWithProfile | null> {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single()

        if (userError) throw userError
        if (!user) return null

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single()

        return { ...user, profile: profile || undefined }
    },

    /**
     * Get user by handle
     */
    async getUserByHandle(handle: string): Promise<UserWithProfile | null> {
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .ilike('handle', handle)
            .single()

        if (userError) {
            if (userError.code === 'PGRST116') return null
            throw userError
        }
        if (!user) return null

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', user.id)
            .single()

        return { ...user, profile: profile || undefined }
    },

    /**
     * Update user profile
     */
    async updateProfile(userId: string, data: UpdateProfileData) {
        const userUpdates: Partial<User> = {}
        const profileUpdates: Partial<Profile> = {}

        // Separate user table updates from profile table updates
        if (data.display_name !== undefined) userUpdates.display_name = data.display_name
        if (data.avatar_url !== undefined) userUpdates.avatar_url = data.avatar_url
        if (data.profile_type !== undefined) userUpdates.profile_type = data.profile_type

        if (data.headline !== undefined) profileUpdates.headline = data.headline
        if (data.bio !== undefined) profileUpdates.bio = data.bio
        if (data.location !== undefined) profileUpdates.location = data.location
        if (data.website !== undefined) profileUpdates.website = data.website
        if (data.skills !== undefined) profileUpdates.skills = data.skills as any
        if (data.education !== undefined) profileUpdates.education = data.education as any
        if (data.experience !== undefined) profileUpdates.experience = data.experience as any
        if (data.portfolio_links !== undefined) profileUpdates.portfolio_links = data.portfolio_links as any

        // Update user table if there are changes
        if (Object.keys(userUpdates).length > 0) {
            const { error: userError } = await supabase
                .from('users')
                .update(userUpdates)
                .eq('id', userId)

            if (userError) throw userError
        }

        // Update profile table if there are changes
        if (Object.keys(profileUpdates).length > 0) {
            profileUpdates.updated_at = new Date().toISOString()

            const { error: profileError } = await supabase
                .from('profiles')
                .update(profileUpdates)
                .eq('user_id', userId)

            if (profileError) throw profileError
        }

        return this.getUserById(userId)
    },

    /**
     * Search users by handle or display name
     */
    async searchUsers(query: string, limit = 20) {
        const { data, error } = await supabase
            .from('users')
            .select('id, handle, display_name, avatar_url, is_verified')
            .or(`handle.ilike.%${query}%,display_name.ilike.%${query}%`)
            .limit(limit)

        if (error) throw error
        return data
    },

    /**
     * Update last seen timestamp
     */
    async updateLastSeen(userId: string) {
        const { error } = await supabase
            .from('users')
            .update({ last_seen_at: new Date().toISOString() })
            .eq('id', userId)

        if (error) console.error('Failed to update last seen:', error)
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
                .eq('followee_id', userId),
            supabase
                .from('follows')
                .select('followee_id', { count: 'exact', head: true })
                .eq('follower_id', userId),
        ])

        return {
            posts: postsCount.count || 0,
            followers: followersCount.count || 0,
            following: followingCount.count || 0,
        }
    },
}
