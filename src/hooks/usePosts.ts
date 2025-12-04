import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query'
import { postsService, CreatePostData, UpdatePostData } from '@/services/posts.service'
import { useAuth } from './useAuth'

export const usePosts = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    // Infinite scroll feed
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['posts', 'feed'],
        queryFn: ({ pageParam = 0 }) => postsService.getFeed(pageParam, 20, user?.id),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.hasMore ? pages.length : undefined
        },
        initialPageParam: 0,
    })

    const posts = data?.pages.flatMap((page) => page.posts) || []

    // Create post mutation
    const createPostMutation = useMutation({
        mutationFn: (data: CreatePostData) => postsService.createPost(user!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    // Update post mutation
    const updatePostMutation = useMutation({
        mutationFn: ({ postId, data }: { postId: string; data: UpdatePostData }) =>
            postsService.updatePost(postId, user!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    // Delete post mutation
    const deletePostMutation = useMutation({
        mutationFn: (postId: string) => postsService.deletePost(postId, user!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    // Toggle pin mutation
    const togglePinMutation = useMutation({
        mutationFn: (postId: string) => postsService.togglePinPost(postId, user!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    return {
        posts,
        isLoading,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        createPost: createPostMutation.mutateAsync,
        updatePost: updatePostMutation.mutateAsync,
        deletePost: deletePostMutation.mutateAsync,
        togglePin: togglePinMutation.mutateAsync,
        isCreating: createPostMutation.isPending,
    }
}

export const usePost = (postId: string) => {
    const { user } = useAuth()

    const { data: post, isLoading } = useQuery({
        queryKey: ['posts', postId],
        queryFn: () => postsService.getPostById(postId, user?.id),
        enabled: !!postId,
    })

    return {
        post,
        isLoading,
    }
}

export const useUserPosts = (userId: string) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
    } = useInfiniteQuery({
        queryKey: ['posts', 'user', userId],
        queryFn: ({ pageParam = 0 }) => postsService.getUserPosts(userId, pageParam, 20),
        getNextPageParam: (lastPage, pages) => {
            return lastPage.hasMore ? pages.length : undefined
        },
        initialPageParam: 0,
        enabled: !!userId,
    })

    const posts = data?.pages.flatMap((page) => page.posts) || []

    return {
        posts,
        isLoading,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    }
}
