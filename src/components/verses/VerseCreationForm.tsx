import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useVerses } from '@/hooks/useVerses'

interface VerseCreationFormProps {
    userId: string
}

export const VerseCreationForm = ({ userId }: VerseCreationFormProps) => {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isPublic, setIsPublic] = useState(true)
    const { createVerse, isCreating } = useVerses(userId)
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!title.trim() || !content.trim()) {
            toast({
                title: 'Validation Error',
                description: 'Please fill in both title and content',
                variant: 'destructive',
            })
            return
        }

        try {
            await createVerse({
                userId,
                data: {
                    title: title.trim(),
                    content: content.trim(),
                    isPublic,
                },
            })

            toast({
                title: 'Success!',
                description: 'Your verse has been created',
            })

            // Reset form
            setTitle('')
            setContent('')
            setIsPublic(true)
        } catch (error) {
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to create verse',
                variant: 'destructive',
            })
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Create a Verse</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="Enter verse title..."
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isCreating}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea
                            id="content"
                            placeholder="Write your story or world..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isCreating}
                            rows={6}
                            className="resize-none"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="public"
                            checked={isPublic}
                            onCheckedChange={setIsPublic}
                            disabled={isCreating}
                        />
                        <Label htmlFor="public">Make this verse public</Label>
                    </div>

                    <Button type="submit" disabled={isCreating} className="w-full">
                        {isCreating ? 'Creating...' : 'Create Verse'}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}
