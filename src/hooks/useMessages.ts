import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { messagesService, CreateThreadData, SendMessageData } from '@/services/messages.service'
import { useAuth } from './useAuth'
import type { Message } from '@/types/database.types'
import { RealtimeChannel } from '@supabase/supabase-js'

export const useThreads = () => {
    const { user } = useAuth()

    const { data: threads, isLoading } = useQuery({
        queryKey: ['threads', user?.id],
        queryFn: () => messagesService.getUserThreads(user!.id),
        enabled: !!user?.id,
    })

    return {
        threads: threads || [],
        isLoading,
    }
}

export const useCreateThread = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (data: CreateThreadData) => messagesService.createThread(user!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['threads'] })
        },
    })

    return {
        createThread: mutation.mutateAsync,
        isCreating: mutation.isPending,
    }
}

export const useMessages = (threadId: string) => {
    const { data: messages, isLoading } = useQuery({
        queryKey: ['messages', threadId],
        queryFn: () => messagesService.getMessages(threadId),
        enabled: !!threadId,
    })

    return {
        messages: messages || [],
        isLoading,
    }
}

export const useSendMessage = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: ({ threadId, data }: { threadId: string; data: SendMessageData }) =>
            messagesService.sendMessage(user!.id, threadId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['messages', variables.threadId] })
            queryClient.invalidateQueries({ queryKey: ['threads'] })
        },
    })

    return {
        sendMessage: mutation.mutateAsync,
        isSending: mutation.isPending,
    }
}

export const useRealtimeMessages = (threadId: string) => {
    const queryClient = useQueryClient()
    const [channel, setChannel] = useState<RealtimeChannel | null>(null)

    useEffect(() => {
        if (!threadId) return

        const subscription = messagesService.subscribeToThread(threadId, (newMessage: Message) => {
            // Add new message to cache
            queryClient.setQueryData(['messages', threadId], (old: Message[] = []) => {
                // Avoid duplicates
                if (old.some((msg) => msg.id === newMessage.id)) return old
                return [...old, newMessage]
            })

            // Update thread list
            queryClient.invalidateQueries({ queryKey: ['threads'] })
        })

        setChannel(subscription)

        return () => {
            if (subscription) {
                messagesService.unsubscribeFromThread(subscription)
            }
        }
    }, [threadId, queryClient])

    return channel
}

export const useMarkThreadAsRead = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: (threadId: string) => messagesService.markThreadAsRead(user!.id, threadId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['threads'] })
        },
    })

    return {
        markAsRead: mutation.mutateAsync,
    }
}
