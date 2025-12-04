import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { CosmicBackground } from "@/components/shared/CosmicBackground";
import { Sparkles, GraduationCap } from "lucide-react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [displayName, setDisplayName] = useState("");
    const { signIn, signUp, isSigningIn, isSigningUp } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password) {
            toast({
                title: "Validation Error",
                description: "Please enter email and password",
                variant: "destructive",
            });
            return;
        }

        try {
            await signIn({ email, password });
            toast({
                title: "Welcome back!",
                description: "You have successfully signed in",
            });
            navigate("/");
        } catch (error) {
            toast({
                title: "Login Failed",
                description: error instanceof Error ? error.message : "Invalid credentials",
                variant: "destructive",
            });
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !username) {
            toast({
                title: "Validation Error",
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: "Validation Error",
                description: "Password must be at least 6 characters",
                variant: "destructive",
            });
            return;
        }

        try {
            await signUp({ email, password, handle: username, displayName: displayName || username });
            toast({
                title: "Account Created!",
                description: "Welcome to Arcadia Verse",
            });
            navigate("/");
        } catch (error) {
            toast({
                title: "Signup Failed",
                description: error instanceof Error ? error.message : "Could not create account",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-background relative flex items-center justify-center p-4">
            <CosmicBackground />

            <div className="relative z-10 w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-cosmic-cyan to-cosmic-magenta mb-4 glow-cyan">
                        <GraduationCap size={32} className="text-primary-foreground" />
                    </div>
                    <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                        Arcadia Verse
                    </h1>
                    <p className="text-muted-foreground">
                        Your learning universe awaits
                    </p>
                </div>

                <Card className="glass border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Sparkles size={20} className="text-primary" />
                            Get Started
                        </CardTitle>
                        <CardDescription>
                            Sign in or create an account to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 glass p-1">
                                <TabsTrigger value="login">Login</TabsTrigger>
                                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="login-email">Email</Label>
                                        <Input
                                            id="login-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isSigningIn}
                                            className="glass"
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
                                            className="glass"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        variant="cosmic"
                                        disabled={isSigningIn}
                                    >
                                        {isSigningIn ? "Signing in..." : "Sign In"}
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="signup">
                                <form onSubmit={handleSignup} className="space-y-4 mt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="signup-username">
                                            Username <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="signup-username"
                                            type="text"
                                            placeholder="johndoe"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            disabled={isSigningUp}
                                            className="glass"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signup-displayname">Display Name</Label>
                                        <Input
                                            id="signup-displayname"
                                            type="text"
                                            placeholder="John Doe"
                                            value={displayName}
                                            onChange={(e) => setDisplayName(e.target.value)}
                                            disabled={isSigningUp}
                                            className="glass"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signup-email">
                                            Email <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="signup-email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            disabled={isSigningUp}
                                            className="glass"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="signup-password">
                                            Password <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="signup-password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            disabled={isSigningUp}
                                            className="glass"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Must be at least 6 characters
                                        </p>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        variant="cosmic"
                                        disabled={isSigningUp}
                                    >
                                        {isSigningUp ? "Creating account..." : "Create Account"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                <p className="text-center text-sm text-muted-foreground mt-4">
                    By continuing, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
};

export default Login;
