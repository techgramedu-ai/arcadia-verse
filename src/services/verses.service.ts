import { supabase } from '@/lib/supabase'

export interface Verse {
    id: string
    user_id: string
    title: string
    content: string
    is_public: boolean
    created_at: string
    updated_at: string
}

export interface CreateVerseData {
    title: string
    content: string
    isPublic?: boolean
}

export interface UpdateVerseData {
    title?: string
    content?: string
    isPublic?: boolean
}

export const versesService = {
    /**
     * Create a new verse
     */
    async createVerse(userId: string, data: CreateVerseData) {
        const { data: verse, error } = await supabase
            .from('verses')
            .insert({
                user_id: userId,
                title: data.title,
                content: data.content,
                is_public: data.isPublic ?? true,
            })
            .select()
            .single()

        if (error) throw error
        return verse as Verse
    },

    /**
     * Get all public verses (and user's private verses if userId provided)
     */
    async getVerses(userId?: string) {
        let query = supabase
            .from('verses')
            .select('*')
            .order('created_at', { ascending: false })

        // If user is logged in, show public verses + their private verses
        if (userId) {
            query = query.or(`is_public.eq.true,user_id.eq.${userId}`)
        } else {
            // If not logged in, only show public verses
            query = query.eq('is_public', true)
        }

        const { data, error } = await query

        if (error) throw error
        return data as Verse[]
    },

    /**
     * Get verses by a specific user
     */
    async getUserVerses(userId: string, currentUserId?: string) {
        let query = supabase
            .from('verses')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })

        // If viewing another user's verses, only show public ones
        if (currentUserId !== userId) {
            query = query.eq('is_public', true)
        }

        const { data, error } = await query

        if (error) throw error
        return data as Verse[]
    },

    /**
     * Get a single verse by ID
     */
    async getVerseById(verseId: string, userId?: string) {
        const { data, error } = await supabase
            .from('verses')
            .select('*')
            .eq('id', verseId)
            .single()

        if (error) throw error

        const verse = data as Verse

        // Check if user has access to this verse
        if (!verse.is_public && verse.user_id !== userId) {
            throw new Error('You do not have access to this verse')
        }

        return verse
    },

    /**
     * Update a verse
     */
    async updateVerse(verseId: string, userId: string, data: UpdateVerseData) {
        const updateData: any = {}

        if (data.title !== undefined) updateData.title = data.title
        if (data.content !== undefined) updateData.content = data.content
        if (data.isPublic !== undefined) updateData.is_public = data.isPublic

        const { data: verse, error } = await supabase
            .from('verses')
            .update(updateData)
            .eq('id', verseId)
            .eq('user_id', userId) // Ensure user owns the verse
            .select()
            .single()

        if (error) throw error
        return verse as Verse
    },

    /**
     * Delete a verse
     */
    async deleteVerse(verseId: string, userId: string) {
        const { error } = await supabase
            .from('verses')
            .delete()
            .eq('id', verseId)
            .eq('user_id', userId) // Ensure user owns the verse

        if (error) throw error
    },

    /**
     * Subscribe to real-time verse changes
     */
    subscribeToVerses(callback: (verse: Verse) => void) {
        const channel = supabase
            .channel('verses')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'verses',
                },
                (payload) => {
                    if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                        callback(payload.new as Verse)
                    }
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    },
}
