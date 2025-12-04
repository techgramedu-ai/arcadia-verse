import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { socialService } from '@/services/social.service'
import { useAuth } from './useAuth'

export const useSocial = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    // Follow mutation
    const followMutation = useMutation({
        mutationFn: (followeeId: string) => socialService.followUser(user!.id, followeeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['follows'] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    // Unfollow mutation
    const unfollowMutation = useMutation({
        mutationFn: (followeeId: string) => socialService.unfollowUser(user!.id, followeeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['follows'] })
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
    })

    // Like mutation
    const likeMutation = useMutation({
        mutationFn: ({ targetType, targetId }: { targetType: string; targetId: string }) =>
            socialService.like(user!.id, targetType, targetId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
            queryClient.invalidateQueries({ queryKey: ['likes'] })
        },
    })

    // Unlike mutation
    const unlikeMutation = useMutation({
        mutationFn: ({ targetType, targetId }: { targetType: string; targetId: string }) =>
            socialService.unlike(user!.id, targetType, targetId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] })
            queryClient.invalidateQueries({ queryKey: ['likes'] })
        },
    })

    // Add comment mutation
    const addCommentMutation = useMutation({
        mutationFn: ({ postId, content, parentId }: { postId: string; content: string; parentId?: string }) =>
            socialService.addComment(user!.id, postId, content, parentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] })
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    // Delete comment mutation
    const deleteCommentMutation = useMutation({
        mutationFn: (commentId: string) => socialService.deleteComment(commentId, user!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments'] })
            queryClient.invalidateQueries({ queryKey: ['posts'] })
        },
    })

    return {
        follow: followMutation.mutateAsync,
        unfollow: unfollowMutation.mutateAsync,
        like: likeMutation.mutateAsync,
        unlike: unlikeMutation.mutateAsync,
        addComment: addCommentMutation.mutateAsync,
        deleteComment: deleteCommentMutation.mutateAsync,
        isFollowing: followMutation.isPending,
        isUnfollowing: unfollowMutation.isPending,
    }
}

export const useIsFollowing = (userId: string, followeeId: string) => {
    const { data: isFollowing } = useQuery({
        queryKey: ['follows', 'check', userId, followeeId],
        queryFn: () => socialService.isFollowing(userId, followeeId),
        enabled: !!userId && !!followeeId,
    })

    return isFollowing || false
}

export const useFollowers = (userId: string) => {
    const { data: followers, isLoading } = useQuery({
        queryKey: ['follows', 'followers', userId],
        queryFn: () => socialService.getFollowers(userId),
        enabled: !!userId,
    })

    return {
        followers: followers || [],
        isLoading,
    }
}

export const useFollowing = (userId: string) => {
    const { data: following, isLoading } = useQuery({
        queryKey: ['follows', 'following', userId],
        queryFn: () => socialService.getFollowing(userId),
        enabled: !!userId,
    })

    return {
        following: following || [],
        isLoading,
    }
}

export const useComments = (postId: string) => {
    const { data: comments, isLoading } = useQuery({
        queryKey: ['comments', 'post', postId],
        queryFn: () => socialService.getComments(postId),
        enabled: !!postId,
    })

    return {
        comments: comments || [],
        isLoading,
    }
}

export const useLikes = (targetType: string, targetId: string) => {
    const { data: likes, isLoading } = useQuery({
        queryKey: ['likes', targetType, targetId],
        queryFn: () => socialService.getLikes(targetType, targetId),
        enabled: !!targetType && !!targetId,
    })

    return {
        likes: likes || [],
        isLoading,
    }
}
