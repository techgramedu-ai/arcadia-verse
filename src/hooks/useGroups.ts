import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { groupsService } from '@/services/groups.service'
import { useAuth } from './useAuth'

export const useGroups = () => {
    const { user } = useAuth()
    const queryClient = useQueryClient()

    // Get user's groups
    const { data: myGroups, isLoading: isLoadingMyGroups } = useQuery({
        queryKey: ['groups', 'my', user?.id],
        queryFn: () => groupsService.getUserGroups(user!.id),
        enabled: !!user,
    })

    // Get suggested groups
    const { data: suggestedGroups, isLoading: isLoadingSuggested } = useQuery({
        queryKey: ['groups', 'suggested'],
        queryFn: () => groupsService.searchGroups("", 10),
    })

    // Join group mutation
    const joinGroupMutation = useMutation({
        mutationFn: (groupId: string) => groupsService.joinGroup(groupId, user!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] })
        },
    })

    // Leave group mutation
    const leaveGroupMutation = useMutation({
        mutationFn: (groupId: string) => groupsService.leaveGroup(groupId, user!.id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groups'] })
        },
    })

    return {
        myGroups: myGroups || [],
        suggestedGroups: suggestedGroups || [],
        isLoading: isLoadingMyGroups || isLoadingSuggested,
        joinGroup: joinGroupMutation.mutateAsync,
        leaveGroup: leaveGroupMutation.mutateAsync,
        isJoining: joinGroupMutation.isPending,
        isLeaving: leaveGroupMutation.isPending,
    }
}
