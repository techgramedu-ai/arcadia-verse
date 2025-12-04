import { supabase } from '@/lib/supabase'
import type { Thread, Message, ThreadMember } from '@/types/database.types'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface CreateThreadData {
    isGroup?: boolean
    name?: string
    memberIds: string[]
}

export interface SendMessageData {
    text?: string
    attachments?: any[]
    metadata?: any
}

export const messagesService = {
    /**
     * Create a new thread
     */
    async createThread(userId: string, data: CreateThreadData) {
        const { data: thread, error: threadError } = await supabase
            .from('threads')
            .insert({
                is_group: data.isGroup || false,
                name: data.name,
            })
            .select()
            .single()

        if (threadError) throw threadError

        // Add members to thread (including creator)
        const allMemberIds = [...new Set([userId, ...data.memberIds])]
        const members = allMemberIds.map((memberId) => ({
            thread_id: thread.id,
            user_id: memberId,
        }))

        const { error: membersError } = await supabase
            .from('thread_members')
            .insert(members)

        if (membersError) throw membersError

        return thread
    },

    /**
     * Get user's threads
     */
    async getUserThreads(userId: string) {
        const { data: threadMembers, error } = await supabase
            .from('thread_members')
            .select(`
        thread_id,
        last_read_at,
        thread:threads!thread_members_thread_id_fkey(*)
      `)
            .eq('user_id', userId)
            .order('joined_at', { ascending: false })

        if (error) throw error

        // Get last message for each thread
        const threadsWithLastMessage = await Promise.all(
            (threadMembers || []).map(async (tm: any) => {
                const { data: lastMessage } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('thread_id', tm.thread_id)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single()

                // Get other members
                const { data: members } = await supabase
                    .from('thread_members')
                    .select(`
            user:users!thread_members_user_id_fkey(id, handle, display_name, avatar_url)
          `)
                    .eq('thread_id', tm.thread_id)
                    .neq('user_id', userId)

                return {
                    ...tm.thread,
                    last_message: lastMessage,
                    members: members?.map((m: any) => m.user) || [],
                    last_read_at: tm.last_read_at,
                }
            })
        )

        return threadsWithLastMessage
    },

    /**
     * Send a message in a thread
     */
    async sendMessage(userId: string, threadId: string, data: SendMessageData) {
        const content = {
            text: data.text,
            attachments: data.attachments || [],
            ...data.metadata,
        }

        const { data: message, error } = await supabase
            .from('messages')
            .insert({
                thread_id: threadId,
                sender_id: userId,
                content,
            })
            .select()
            .single()

        if (error) throw error
        return message
    },

    /**
     * Get messages in a thread
     */
    async getMessages(threadId: string, limit = 50, before?: string) {
        let query = supabase
            .from('messages')
            .select(`
        *,
        sender:users!messages_sender_id_fkey(id, handle, display_name, avatar_url)
      `)
            .eq('thread_id', threadId)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (before) {
            query = query.lt('created_at', before)
        }

        const { data, error } = await query

        if (error) throw error
        return data?.reverse() || []
    },

    /**
     * Mark thread as read
     */
    async markThreadAsRead(userId: string, threadId: string) {
        const { error } = await supabase
            .from('thread_members')
            .update({ last_read_at: new Date().toISOString() })
            .eq('thread_id', threadId)
            .eq('user_id', userId)

        if (error) throw error
    },

    /**
     * Subscribe to new messages in a thread (real-time)
     */
    subscribeToThread(
        threadId: string,
        onMessage: (message: Message) => void
    ): RealtimeChannel {
        const channel = supabase
            .channel(`thread:${threadId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `thread_id=eq.${threadId}`,
                },
                async (payload) => {
                    // Fetch sender info
                    const { data: sender } = await supabase
                        .from('users')
                        .select('id, handle, display_name, avatar_url')
                        .eq('id', payload.new.sender_id)
                        .single()

                    onMessage({
                        ...payload.new,
                        sender,
                    } as any)
                }
            )
            .subscribe()

        return channel
    },

    /**
     * Unsubscribe from thread
     */
    unsubscribeFromThread(channel: RealtimeChannel) {
        supabase.removeChannel(channel)
    },

    /**
     * Delete a message
     */
    async deleteMessage(messageId: string, userId: string) {
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId)
            .eq('sender_id', userId)

        if (error) throw error
    },

    /**
     * Edit a message
     */
    async editMessage(messageId: string, userId: string, newText: string) {
        const { data: message } = await supabase
            .from('messages')
            .select('content')
            .eq('id', messageId)
            .single()

        if (!message) throw new Error('Message not found')

        const updatedContent = {
            ...message.content,
            text: newText,
        }

        const { data, error } = await supabase
            .from('messages')
            .update({
                content: updatedContent,
                edited_at: new Date().toISOString(),
            })
            .eq('id', messageId)
            .eq('sender_id', userId)
            .select()
            .single()

        if (error) throw error
        return data
    },
}
