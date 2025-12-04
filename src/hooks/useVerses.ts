import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { versesService, CreateVerseData, UpdateVerseData } from '@/services/verses.service'
import { useEffect } from 'react'

export const useVerses = (userId?: string) => {
    const queryClient = useQueryClient()

    // Fetch verses
    const { data: verses, isLoading, error } = useQuery({
        queryKey: ['verses', userId],
        queryFn: () => versesService.getVerses(userId),
    })

    // Create verse mutation
    const createVerseMutation = useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: CreateVerseData }) =>
            versesService.createVerse(userId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['verses'] })
        },
    })

    // Update verse mutation
    const updateVerseMutation = useMutation({
        mutationFn: ({
            verseId,
            userId,
            data,
        }: {
            verseId: string
            userId: string
            data: UpdateVerseData
        }) => versesService.updateVerse(verseId, userId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['verses'] })
        },
    })

    // Delete verse mutation
    const deleteVerseMutation = useMutation({
        mutationFn: ({ verseId, userId }: { verseId: string; userId: string }) =>
            versesService.deleteVerse(verseId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['verses'] })
        },
    })

    // Real-time subscription
    useEffect(() => {
        const unsubscribe = versesService.subscribeToVerses((newVerse) => {
            // Invalidate queries to refetch with new data
            queryClient.invalidateQueries({ queryKey: ['verses'] })
        })

        return () => {
            unsubscribe()
        }
    }, [queryClient])

    return {
        verses: verses || [],
        isLoading,
        error,
        createVerse: createVerseMutation.mutateAsync,
        updateVerse: updateVerseMutation.mutateAsync,
        deleteVerse: deleteVerseMutation.mutateAsync,
        isCreating: createVerseMutation.isPending,
        isUpdating: updateVerseMutation.isPending,
        isDeleting: deleteVerseMutation.isPending,
    }
}

export const useUserVerses = (userId: string, currentUserId?: string) => {
    const { data: verses, isLoading, error } = useQuery({
        queryKey: ['verses', 'user', userId],
        queryFn: () => versesService.getUserVerses(userId, currentUserId),
        enabled: !!userId,
    })

    return {
        verses: verses || [],
        isLoading,
        error,
    }
}
