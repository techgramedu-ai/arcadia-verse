import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { AuthForm } from '@/components/auth/AuthForm'
import { VerseCreationForm } from '@/components/verses/VerseCreationForm'
import { VerseFeed } from '@/components/verses/VerseFeed'
import { Separator } from '@/components/ui/separator'
import { LogOut, BookOpen } from 'lucide-react'

const Verses = () => {
    const { user, isLoading, signOut } = useAuth()

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {/* Header */}
            <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-6 w-6 text-primary" />
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                                Arcadia Verse
                            </h1>
                        </div>
                        {user && (
                            <div className="flex items-center gap-4">
                                <p className="text-sm text-muted-foreground">
                                    Welcome, <span className="font-medium text-foreground">{user.email}</span>
                                </p>
                                <Button onClick={() => signOut()} variant="outline" size="sm">
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    {!user ? (
                        <>
                            {/* Auth Section */}
                            <div className="space-y-4">
                                <div className="text-center space-y-2">
                                    <h2 className="text-3xl font-bold">Share Your Stories</h2>
                                    <p className="text-muted-foreground">
                                        Create and explore imaginative verses from the community
                                    </p>
                                </div>
                                <AuthForm />
                            </div>

                            <Separator />

                            {/* Public Feed */}
                            <VerseFeed />
                        </>
                    ) : (
                        <>
                            {/* Verse Creation */}
                            <VerseCreationForm userId={user.id} />

                            <Separator />

                            {/* Feed */}
                            <VerseFeed userId={user.id} />
                        </>
                    )}
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t mt-16 py-8">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>Arcadia Verse - A place for creative storytelling</p>
                </div>
            </footer>
        </div>
    )
}

export default Verses
