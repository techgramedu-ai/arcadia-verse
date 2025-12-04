import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authService, SignUpData, SignInData } from '@/services/auth.service'
import { usersService } from '@/services/users.service'
import type { User } from '@/types/database.types'

export const useAuth = () => {
    const queryClient = useQueryClient()

    // Get current user
    const { data: user, isLoading } = useQuery({
        queryKey: ['auth', 'user'],
        queryFn: authService.getCurrentUser,
        retry: false,
    })

    // Get current session
    const { data: session } = useQuery({
        queryKey: ['auth', 'session'],
        queryFn: authService.getSession,
        retry: false,
    })

    // Sign up mutation
    const signUpMutation = useMutation({
        mutationFn: (data: SignUpData) => authService.signUp(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth'] })
        },
    })

    // Sign in mutation
    const signInMutation = useMutation({
        mutationFn: (data: SignInData) => authService.signIn(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['auth'] })
        },
    })

    // Sign out mutation
    const signOutMutation = useMutation({
        mutationFn: authService.signOut,
        onSuccess: () => {
            queryClient.clear()
        },
    })

    // Reset password mutation
    const resetPasswordMutation = useMutation({
        mutationFn: (email: string) => authService.resetPassword(email),
    })

    // Update password mutation
    const updatePasswordMutation = useMutation({
        mutationFn: (newPassword: string) => authService.updatePassword(newPassword),
    })

    return {
        user,
        session,
        isLoading,
        isAuthenticated: !!user,
        signUp: signUpMutation.mutateAsync,
        signIn: signInMutation.mutateAsync,
        signOut: signOutMutation.mutateAsync,
        resetPassword: resetPasswordMutation.mutateAsync,
        updatePassword: updatePasswordMutation.mutateAsync,
        isSigningUp: signUpMutation.isPending,
        isSigningIn: signInMutation.isPending,
        isSigningOut: signOutMutation.isPending,
    }
}

export const useCurrentUser = () => {
    const { user } = useAuth()

    const { data: userWithProfile, isLoading } = useQuery({
        queryKey: ['users', user?.id],
        queryFn: () => usersService.getUserById(user!.id),
        enabled: !!user?.id,
    })

    return {
        user: userWithProfile,
        isLoading,
    }
}
