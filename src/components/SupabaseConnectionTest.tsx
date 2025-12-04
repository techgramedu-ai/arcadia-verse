import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

export function SupabaseConnectionTest() {
    const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
    const [error, setError] = useState<string | null>(null)
    const { user, signUp, signIn, signOut, isAuthenticated } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [handle, setHandle] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const checkConnection = async () => {
            try {
                const { data, error } = await supabase.from('users').select('count').limit(1)
                if (error) throw error
                setConnectionStatus('connected')
            } catch (err: any) {
                setConnectionStatus('error')
                setError(err.message)
            }
        }
        checkConnection()
    }, [])

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await signUp({ email, password, handle })
            alert('Sign up successful! Check your email for verification.')
        } catch (err: any) {
            alert('Sign up failed: ' + err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await signIn({ email, password })
            alert('Sign in successful!')
        } catch (err: any) {
            alert('Sign in failed: ' + err.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleSignOut = async () => {
        try {
            await signOut()
            alert('Signed out successfully!')
        } catch (err: any) {
            alert('Sign out failed: ' + err.message)
        }
    }

    return (
        <div className="container mx-auto p-8 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Supabase Connection Status</CardTitle>
                    <CardDescription>Testing backend connectivity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-2">
                        {connectionStatus === 'checking' && (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                <span>Checking connection...</span>
                            </>
                        )}
                        {connectionStatus === 'connected' && (
                            <>
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                                <span className="font-semibold text-green-600">Connected to Supabase!</span>
                                <Badge variant="outline" className="ml-2">Database Ready</Badge>
                            </>
                        )}
                        {connectionStatus === 'error' && (
                            <>
                                <XCircle className="h-5 w-5 text-red-500" />
                                <span className="font-semibold text-red-600">Connection Failed</span>
                                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {connectionStatus === 'connected' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Authentication Test</CardTitle>
                        <CardDescription>
                            {isAuthenticated ? `Signed in as: ${user?.email}` : 'Test sign up and sign in'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!isAuthenticated ? (
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Sign Up Form */}
                                <form onSubmit={handleSignUp} className="space-y-4">
                                    <h3 className="font-semibold text-lg">Sign Up</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email">Email</Label>
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-handle">Handle</Label>
                                        <Input
                                            id="signup-handle"
                                            type="text"
                                            placeholder="username"
                                            value={handle}
                                            onChange={(e) => setHandle(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">Password</Label>
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" disabled={isLoading} className="w-full">
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign Up'}
                                    </Button>
                                </form>

                                {/* Sign In Form */}
                                <form onSubmit={handleSignIn} className="space-y-4">
                                    <h3 className="font-semibold text-lg">Sign In</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-email">Email</Label>
                                        <Input
                                            id="signin-email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="signin-password">Password</Label>
                                        <Input
                                            id="signin-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <Button type="submit" disabled={isLoading} className="w-full">
                                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
                                    </Button>
                                </form>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-green-800 font-semibold">✅ Authentication Working!</p>
                                    <p className="text-sm text-green-600 mt-1">User ID: {user?.id}</p>
                                    <p className="text-sm text-green-600">Email: {user?.email}</p>
                                </div>
                                <Button onClick={handleSignOut} variant="outline" className="w-full">
                                    Sign Out
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
