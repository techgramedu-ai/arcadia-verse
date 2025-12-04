import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { storiesService, CreateStoryData } from '@/services/stories.service'
import { useAuth } from './useAuth'

export const useStories = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    // Get active stories
    const { data: stories, isLoading } = useQuery({
        queryKey: ['stories', 'active'],
        queryFn: () => storiesService.getActiveStories(),
        refetchInterval: 60000, // Refetch every minute to check for expired stories
    })

    // Get user's own stories
    const { data: userStories } = useQuery({
        queryKey: ['stories', 'user', user?.id],
        queryFn: () => storiesService.getActiveStories(user!.id),
        enabled: !!user,
    })

    // Create story mutation
    const createStoryMutation = useMutation({
        mutationFn: (data: CreateStoryData) => storiesService.createStory(user!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stories'] })
        },
    })

    // Delete story mutation
    const deleteStoryMutation = useMutation({
        mutationFn: (storyId: string) => storiesService.deleteStory(storyId, user!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['stories'] })
        },
    })

    // View story mutation
    const viewStoryMutation = useMutation({
        mutationFn: (storyId: string) => storiesService.viewStory(storyId),
    })

    return {
        stories: stories || [],
        userStories: userStories || [],
        isLoading,
        createStory: createStoryMutation.mutateAsync,
        deleteStory: deleteStoryMutation.mutateAsync,
        viewStory: viewStoryMutation.mutateAsync,
        isCreating: createStoryMutation.isPending,
    }
}

export const useUserStories = (userId: string) => {
    const { data: stories, isLoading } = useQuery({
        queryKey: ['stories', 'user', userId],
        queryFn: () => storiesService.getActiveStories(userId),
        enabled: !!userId,
    })

    return {
        stories: stories || [],
        isLoading,
    }
}
