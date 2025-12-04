import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'

export const AuthForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const { signIn, signUp, isSigningIn, isSigningUp } = useAuth()
    const { toast } = useToast()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password) {
            toast({
                title: 'Validation Error',
                description: 'Please enter email and password',
                variant: 'destructive',
            })
            return
        }

        try {
            await signIn({ email, password })
            toast({
                title: 'Welcome back!',
                description: 'You have successfully signed in',
            })
        } catch (error) {
            toast({
                title: 'Login Failed',
                description: error instanceof Error ? error.message : 'Invalid credentials',
                variant: 'destructive',
            })
        }
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!email || !password || !username) {
            toast({
                title: 'Validation Error',
                description: 'Please fill in all fields',
                variant: 'destructive',
            })
            return
        }

        if (password.length < 6) {
            toast({
                title: 'Validation Error',
                description: 'Password must be at least 6 characters',
                variant: 'destructive',
            })
            return
        }

        try {
            await signUp({ email, password, handle: username })
            toast({
                title: 'Account Created!',
                description: 'Welcome to Arcadia Verse',
            })
            // Reset form
            setEmail('')
            setPassword('')
            setUsername('')
        } catch (error) {
            toast({
                title: 'Signup Failed',
                description: error instanceof Error ? error.message : 'Could not create account',
                variant: 'destructive',
            })
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Welcome to Arcadia Verse</CardTitle>
                <CardDescription>Sign in or create an account to get started</CardDescription>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Sign Up</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-email">Email</Label>
                                <Input
                                    id="login-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isSigningIn}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="login-password">Password</Label>
                                <Input
                                    id="login-password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isSigningIn}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isSigningIn}>
                                {isSigningIn ? 'Signing in...' : 'Sign In'}
                            </Button>
                        </form>
                    </TabsContent>

                    <TabsContent value="signup">
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-username">Username</Label>
                                <Input
                                    id="signup-username"
                                    type="text"
                                    placeholder="johndoe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    disabled={isSigningUp}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-email">Email</Label>
                                <Input
                                    id="signup-email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isSigningUp}
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
                                    disabled={isSigningUp}
                                />
                                <p className="text-xs text-muted-foreground">
                                    Must be at least 6 characters
                                </p>
                            </div>

                            <Button type="submit" className="w-full" disabled={isSigningUp}>
                                {isSigningUp ? 'Creating account...' : 'Create Account'}
                            </Button>
                        </form>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}
