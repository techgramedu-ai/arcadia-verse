import { supabase } from '@/integrations/supabase/client'

export interface SignUpData {
    email: string
    password: string
    username: string
    displayName?: string
}

export interface SignInData {
    email: string
    password: string
}

export const authService = {
    /**
     * Sign up a new user with email and password
     */
    async signUp({ email, password, username, displayName }: SignUpData) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    display_name: displayName || username,
                }
            }
        })

        if (authError) throw authError
        if (!authData.user) throw new Error('User creation failed')

        return { user: authData.user }
    },

    /**
     * Sign in with email and password
     */
    async signIn({ email, password }: SignInData) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error
        return data
    },

    /**
     * Sign out the current user
     */
    async signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    },

    /**
     * Get the current authenticated user
     */
    async getCurrentUser() {
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error) throw error
        return user
    },

    /**
     * Get the current session
     */
    async getSession() {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        return session
    },

    /**
     * Send password reset email
     */
    async resetPassword(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
    },

    /**
     * Update password
     */
    async updatePassword(newPassword: string) {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        })
        if (error) throw error
    },

    /**
     * Listen to auth state changes
     */
    onAuthStateChange(callback: (user: any | null) => void) {
        return supabase.auth.onAuthStateChange((_event, session) => {
            callback(session?.user || null)
        })
    },
}
