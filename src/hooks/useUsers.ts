import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { usersService, UpdateProfileData } from '@/services/users.service'

export const useUser = (userId: string) => {
    const { data: user, isLoading } = useQuery({
        queryKey: ['users', userId],
        queryFn: () => usersService.getUserById(userId),
        enabled: !!userId,
    })

    const { data: stats } = useQuery({
        queryKey: ['users', userId, 'stats'],
        queryFn: () => usersService.getUserStats(userId),
        enabled: !!userId,
    })

    return {
        user,
        stats,
        isLoading,
    }
}

export const useUserByHandle = (handle: string) => {
    const { data: user, isLoading } = useQuery({
        queryKey: ['users', 'handle', handle],
        queryFn: () => usersService.getUserByHandle(handle),
        enabled: !!handle,
    })

    return {
        user,
        isLoading,
    }
}

export const useUpdateProfile = () => {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: UpdateProfileData }) =>
            usersService.updateProfile(userId, data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['users', data?.id] })
            queryClient.invalidateQueries({ queryKey: ['auth'] })
        },
    })

    return {
        updateProfile: mutation.mutateAsync,
        isUpdating: mutation.isPending,
    }
}

export const useSearchUsers = (query: string) => {
    const { data: users, isLoading } = useQuery({
        queryKey: ['users', 'search', query],
        queryFn: () => usersService.searchUsers(query),
        enabled: query.length > 0,
    })

    return {
        users: users || [],
        isLoading,
    }
}
