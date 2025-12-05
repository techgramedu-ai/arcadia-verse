import { supabase } from '@/integrations/supabase/client'

export const mediaService = {
    /**
     * Upload a file
     */
    async uploadFile(userId: string, file: File, bucket = 'uploads') {
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}/${Date.now()}.${fileExt}`

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, file)

        if (error) throw error

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName)

        return { path: data.path, publicUrl }
    },

    /**
     * Delete a file
     */
    async deleteFile(path: string, bucket = 'uploads') {
        const { error } = await supabase.storage
            .from(bucket)
            .remove([path])

        if (error) throw error
    },

    /**
     * Get public URL for a file
     */
    getPublicUrl(path: string, bucket = 'uploads') {
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(path)

        return publicUrl
    },
}
