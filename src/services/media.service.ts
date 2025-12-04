import { supabase } from '@/lib/supabase'
import type { Media, MediaType } from '@/types/database.types'

export interface UploadMediaOptions {
    file: File
    type: MediaType
    postId?: string
    onProgress?: (progress: number) => void
}

export const mediaService = {
    /**
     * Upload media file to Supabase Storage
     */
    async uploadMedia(userId: string, options: UploadMediaOptions): Promise<Media> {
        const { file, type, postId } = options

        // Generate unique file name
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const bucketName = type === 'image' ? 'images' : type === 'video' ? 'videos' : 'media'

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
            })

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName)

        // Get file dimensions for images
        let width: number | undefined
        let height: number | undefined

        if (type === 'image') {
            const dimensions = await this.getImageDimensions(file)
            width = dimensions.width
            height = dimensions.height
        }

        // Get video duration for videos
        let duration: number | undefined
        if (type === 'video') {
            duration = await this.getVideoDuration(file)
        }

        // Create media record in database
        const { data: media, error: mediaError } = await supabase
            .from('media')
            .insert({
                owner_id: userId,
                post_id: postId,
                storage_key: fileName,
                url: publicUrl,
                type,
                width,
                height,
                duration_seconds: duration,
                size_bytes: file.size,
                transcoding_status: type === 'video' ? 'pending' : 'done',
            })
            .select()
            .single()

        if (mediaError) {
            // Cleanup: delete uploaded file if database insert fails
            await supabase.storage.from(bucketName).remove([fileName])
            throw mediaError
        }

        // If video, create video record for transcoding
        if (type === 'video') {
            await supabase.from('videos').insert({
                media_id: media.id,
                transcoding_status: 'queued',
            })
        }

        return media
    },

    /**
     * Get media by ID
     */
    async getMediaById(mediaId: string) {
        const { data, error } = await supabase
            .from('media')
            .select('*')
            .eq('id', mediaId)
            .single()

        if (error) throw error
        return data
    },

    /**
     * Delete media
     */
    async deleteMedia(mediaId: string, userId: string) {
        // Get media to find storage key
        const { data: media, error: fetchError } = await supabase
            .from('media')
            .select('storage_key, type, owner_id')
            .eq('id', mediaId)
            .single()

        if (fetchError) throw fetchError
        if (media.owner_id !== userId) throw new Error('Unauthorized')

        // Delete from storage
        const bucketName = media.type === 'image' ? 'images' : media.type === 'video' ? 'videos' : 'media'
        await supabase.storage.from(bucketName).remove([media.storage_key])

        // Delete from database (will cascade to videos table)
        const { error: deleteError } = await supabase
            .from('media')
            .delete()
            .eq('id', mediaId)

        if (deleteError) throw deleteError
    },

    /**
     * Get user media gallery
     */
    async getUserMedia(userId: string, type?: MediaType, limit = 50) {
        let query = supabase
            .from('media')
            .select('*')
            .eq('owner_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (type) {
            query = query.eq('type', type)
        }

        const { data, error } = await query

        if (error) throw error
        return data
    },

    /**
     * Update media metadata
     */
    async updateMediaMetadata(mediaId: string, userId: string, metadata: any) {
        const { data, error } = await supabase
            .from('media')
            .update({ meta: metadata })
            .eq('id', mediaId)
            .eq('owner_id', userId)
            .select()
            .single()

        if (error) throw error
        return data
    },

    /**
     * Helper: Get image dimensions
     */
    async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
        return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => {
                resolve({ width: img.width, height: img.height })
            }
            img.onerror = reject
            img.src = URL.createObjectURL(file)
        })
    },

    /**
     * Helper: Get video duration
     */
    async getVideoDuration(file: File): Promise<number> {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video')
            video.preload = 'metadata'
            video.onloadedmetadata = () => {
                resolve(video.duration)
                URL.revokeObjectURL(video.src)
            }
            video.onerror = reject
            video.src = URL.createObjectURL(file)
        })
    },
}
