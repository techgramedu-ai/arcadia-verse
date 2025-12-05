import { supabase } from '@/integrations/supabase/client'

export const messagesService = {
    /**
     * Send a message
     */
    async sendMessage(senderId: string, receiverId: string, content: string) {
        const { data, error } = await supabase
            .from('messages')
            .insert({
                sender_id: senderId,
                receiver_id: receiverId,
                content,
                read: false,
            })
            .select()
            .single()

        if (error) throw error
        return data
    },

    /**
     * Get messages between two users
     */
    async getMessages(userId1: string, userId2: string, limit = 50) {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
            .order('created_at', { ascending: true })
            .limit(limit)

        if (error) throw error
        return data || []
    },

    /**
     * Get conversations (unique users messaged)
     */
    async getConversations(userId: string) {
        const { data, error } = await supabase
            .from('messages')
            .select('sender_id, receiver_id, content, created_at, read')
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .order('created_at', { ascending: false })

        if (error) throw error

        const conversations = new Map<string, any>()
        for (const msg of data || []) {
            const partnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id
            if (!conversations.has(partnerId)) {
                conversations.set(partnerId, {
                    partnerId,
                    lastMessage: msg.content,
                    lastMessageAt: msg.created_at,
                    unread: msg.receiver_id === userId && !msg.read,
                })
            }
        }

        return Array.from(conversations.values())
    },

    /**
     * Mark messages as read
     */
    async markAsRead(senderId: string, receiverId: string) {
        const { error } = await supabase
            .from('messages')
            .update({ read: true })
            .eq('sender_id', senderId)
            .eq('receiver_id', receiverId)
            .eq('read', false)

        if (error) throw error
    },

    /**
     * Get unread count
     */
    async getUnreadCount(userId: string) {
        const { count, error } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', userId)
            .eq('read', false)

        if (error) throw error
        return count || 0
    },
}
