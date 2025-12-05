import { supabase } from '@/integrations/supabase/client'

export interface CreateGroupData {
    name: string
    description?: string
    category?: string
    is_private?: boolean
    avatar_url?: string
}

export interface UpdateGroupData {
    name?: string
    description?: string
    category?: string
    is_private?: boolean
    avatar_url?: string
}

export const groupsService = {
    /**
     * Create a new group
     */
    async createGroup(userId: string, data: CreateGroupData) {
        const { data: group, error } = await supabase
            .from('groups')
            .insert({
                created_by: userId,
                name: data.name,
                description: data.description || null,
                category: data.category || null,
                is_private: data.is_private || false,
                avatar_url: data.avatar_url || null,
                member_count: 1,
            })
            .select()
            .single()

        if (error) throw error

        // Add creator as admin
        await supabase
            .from('group_members')
            .insert({
                group_id: group.id,
                user_id: userId,
                role: 'admin',
            })

        return group
    },

    /**
     * Get group by ID
     */
    async getGroupById(groupId: string) {
        const { data, error } = await supabase
            .from('groups')
            .select('*')
            .eq('id', groupId)
            .single()

        if (error && error.code !== 'PGRST116') throw error
        return data
    },

    /**
     * Get groups for user
     */
    async getUserGroups(userId: string) {
        const { data: memberships, error: memberError } = await supabase
            .from('group_members')
            .select('group_id, role')
            .eq('user_id', userId)

        if (memberError) throw memberError
        if (!memberships || memberships.length === 0) return []

        const groupIds = memberships.map(m => m.group_id)
        const { data: groups, error } = await supabase
            .from('groups')
            .select('*')
            .in('id', groupIds)

        if (error) throw error
        return groups || []
    },

    /**
     * Update group
     */
    async updateGroup(groupId: string, userId: string, data: UpdateGroupData) {
        // Check if user is admin
        const { data: membership } = await supabase
            .from('group_members')
            .select('role')
            .eq('group_id', groupId)
            .eq('user_id', userId)
            .single()

        if (!membership || membership.role !== 'admin') {
            throw new Error('Not authorized to update this group')
        }

        const { data: group, error } = await supabase
            .from('groups')
            .update(data)
            .eq('id', groupId)
            .select()
            .single()

        if (error) throw error
        return group
    },

    /**
     * Delete group
     */
    async deleteGroup(groupId: string, userId: string) {
        const { data: group } = await supabase
            .from('groups')
            .select('created_by')
            .eq('id', groupId)
            .single()

        if (!group || group.created_by !== userId) {
            throw new Error('Not authorized to delete this group')
        }

        await supabase.from('group_members').delete().eq('group_id', groupId)
        const { error } = await supabase.from('groups').delete().eq('id', groupId)

        if (error) throw error
    },

    /**
     * Join group
     */
    async joinGroup(groupId: string, userId: string) {
        const { error } = await supabase
            .from('group_members')
            .insert({
                group_id: groupId,
                user_id: userId,
                role: 'member',
            })

        if (error) throw error
    },

    /**
     * Leave group
     */
    async leaveGroup(groupId: string, userId: string) {
        const { error } = await supabase
            .from('group_members')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', userId)

        if (error) throw error
    },

    /**
     * Search groups
     */
    async searchGroups(query: string, limit = 20) {
        const { data, error } = await supabase
            .from('groups')
            .select('*')
            .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
            .eq('is_private', false)
            .limit(limit)

        if (error) throw error
        return data || []
    },
}
