import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useVerses } from '@/hooks/useVerses'
import { Loader2, RefreshCw, Lock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface VerseFeedProps {
    userId?: string
}

export const VerseFeed = ({ userId }: VerseFeedProps) => {
    const { verses, isLoading } = useVerses(userId)

    const handleRefresh = () => {
        window.location.reload()
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Verse Feed</h2>
                <Button onClick={handleRefresh} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {verses.length === 0 ? (
                <Card>
                    <CardContent className="py-12">
                        <p className="text-center text-muted-foreground">
                            No verses yet. Create one to get started!
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {verses.map((verse) => (
                        <Card key={verse.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1 flex-1">
                                        <CardTitle className="flex items-center gap-2">
                                            {verse.title}
                                            {!verse.is_public && (
                                                <Badge variant="secondary" className="ml-2">
                                                    <Lock className="h-3 w-3 mr-1" />
                                                    Private
                                                </Badge>
                                            )}
                                        </CardTitle>
                                        <CardDescription>
                                            By {verse.user_id.substring(0, 8)}... •{' '}
                                            {formatDistanceToNow(new Date(verse.created_at), {
                                                addSuffix: true,
                                            })}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground line-clamp-3">
                                    {verse.content}
                                </p>
                                {verse.content.length > 150 && (
                                    <Button variant="link" className="px-0 mt-2">
                                        Read more
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
