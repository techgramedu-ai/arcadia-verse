import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authService } from '@/services/auth.service'

interface AuthContextType {
    user: any | null
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
    const [user, setUser] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const initAuth = async () => {
            try {
                const currentUser = await authService.getCurrentUser()
                setUser(currentUser)
            } catch (error) {
                console.error('Auth initialization error:', error)
                setUser(null)
            } finally {
                setIsLoading(false)
            }
        }

        initAuth()

        const { data: { subscription } } = authService.onAuthStateChange((authUser) => {
            setUser(authUser)
        })

        return () => {
            subscription?.unsubscribe()
        }
    }, [])

    const value = {
        user,
        isLoading,
        isAuthenticated: !!user,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
