import { supabase } from '@/lib/supabase'
import type { User } from '@/types/database.types'

export interface SignUpData {
    email: string
    password: string
    handle: string
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
    async signUp({ email, password, handle, displayName }: SignUpData) {
        // First, create the auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        })

        if (authError) throw authError
        if (!authData.user) throw new Error('User creation failed')

        // Then create the user record in our users table
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert({
                id: authData.user.id,
                email,
                handle,
                display_name: displayName || handle,
            })
            .select()
            .single()

        if (userError) {
            // Rollback: delete the auth user if user record creation fails
            await supabase.auth.admin.deleteUser(authData.user.id)
            throw userError
        }

        // Create an empty profile for the user (old schema)
        const { error: profileError } = await supabase
            .from('profiles')
            .insert({
                user_id: authData.user.id,
            })

        if (profileError) {
            console.error('Profile creation failed:', profileError)
            // Don't throw here, profile can be created later
        }

        // ALSO create profile in the simplified profiles table for verses feature
        const { error: versesProfileError } = await supabase
            .from('profiles')
            .insert({
                id: authData.user.id,
                username: handle,
            })

        if (versesProfileError) {
            console.error('Verses profile creation failed:', versesProfileError)
            // Don't throw here, profile can be created later
        }

        return { user: authData.user, userData }
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
    onAuthStateChange(callback: (user: User | null) => void) {
        return supabase.auth.onAuthStateChange((_event, session) => {
            callback(session?.user as User | null)
        })
    },
}
