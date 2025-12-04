import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/types/database.types'
import { authService } from '@/services/auth.service'
import { usersService } from '@/services/users.service'

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
})

export const useAuthContext = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuthContext must be used within AuthProvider')
    }
    return context
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check for existing session
        const initAuth = async () => {
            try {
                const currentUser = await authService.getCurrentUser()
                setUser(currentUser as any as User)

                // Update last seen
                if (currentUser) {
                    usersService.updateLastSeen(currentUser.id)
                }
            } catch (error) {
                console.error('Auth initialization error:', error)
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }

        initAuth()

        // Listen for auth state changes
        const { data: { subscription } } = authService.onAuthStateChange((authUser) => {
            setUser(authUser as any as User)

            // Update last seen when user signs in
            if (authUser) {
                usersService.updateLastSeen(authUser.id)
            }
        })

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    // Update last seen periodically
    useEffect(() => {
        if (!user) return

        const interval = setInterval(() => {
            usersService.updateLastSeen(user.id)
        }, 5 * 60 * 1000) // Every 5 minutes

        return () => clearInterval(interval)
    }, [user])

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
