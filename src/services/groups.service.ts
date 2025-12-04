import { supabase } from '@/lib/supabase'
import type { Group, GroupMember, GroupPrivacy, GroupRole, GroupWithMembers } from '@/types/database.types'

export interface CreateGroupData {
    name: string
    handle?: string
    description?: string
    privacy?: GroupPrivacy
    coverMediaId?: string
}

export interface UpdateGroupData {
    name?: string
    description?: string
    privacy?: GroupPrivacy
    coverMediaId?: string
    settings?: any
}

export const groupsService = {
    /**
     * Create a new group
     */
    async createGroup(userId: string, data: CreateGroupData) {
        const { data: group, error: groupError } = await supabase
            .from('groups')
            .insert({
                owner_id: userId,
                name: data.name,
                handle: data.handle,
                description: data.description,
                privacy: data.privacy || 'public',
                cover_media_id: data.coverMediaId,
            })
            .select()
            .single()

        if (groupError) throw groupError

        // Add creator as owner member
        const { error: memberError } = await supabase
            .from('group_members')
            .insert({
                group_id: group.id,
                user_id: userId,
                role: 'owner',
            })

        if (memberError) throw memberError

        return group
    },

    /**
     * Get group by ID
     */
    async getGroupById(groupId: string, currentUserId?: string): Promise<GroupWithMembers | null> {
        const { data: group, error } = await supabase
            .from('groups')
            .select('*')
            .eq('id', groupId)
            .single()

        if (error) {
            if (error.code === 'PGRST116') return null
            throw error
        }

        // Get members count
        const { count } = await supabase
            .from('group_members')
            .select('user_id', { count: 'exact', head: true })
            .eq('group_id', groupId)

        // Check if current user is a member and their role
        let isMember = false
        let role: GroupRole | undefined

        if (currentUserId) {
            const { data: membership } = await supabase
                .from('group_members')
                .select('role')
                .eq('group_id', groupId)
                .eq('user_id', currentUserId)
                .single()

            if (membership) {
                isMember = true
                role = membership.role as GroupRole
            }
        }

        return {
            ...group,
            members_count: count || 0,
            is_member: isMember,
            role,
        }
    },

    /**
     * Get group by handle
     */
    async getGroupByHandle(handle: string, currentUserId?: string) {
        const { data: group, error } = await supabase
            .from('groups')
            .select('*')
            .ilike('handle', handle)
            .single()

        if (error) {
            if (error.code === 'PGRST116') return null
            throw error
        }

        return this.getGroupById(group.id, currentUserId)
    },

    /**
     * Update group
     */
    async updateGroup(groupId: string, userId: string, data: UpdateGroupData) {
        // Check if user has permission (owner or admin)
        const { data: membership } = await supabase
            .from('group_members')
            .select('role')
            .eq('group_id', groupId)
            .eq('user_id', userId)
            .single()

        if (!membership || !['owner', 'admin'].includes(membership.role)) {
            throw new Error('Unauthorized')
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
        // Only owner can delete
        const { data: group } = await supabase
            .from('groups')
            .select('owner_id')
            .eq('id', groupId)
            .single()

        if (!group || group.owner_id !== userId) {
            throw new Error('Unauthorized')
        }

        const { error } = await supabase
            .from('groups')
            .delete()
            .eq('id', groupId)

        if (error) throw error
    },

    /**
     * Join a group
     */
    async joinGroup(groupId: string, userId: string) {
        const { data, error } = await supabase
            .from('group_members')
            .insert({
                group_id: groupId,
                user_id: userId,
                role: 'member',
            })
            .select()
            .single()

        if (error) {
            if (error.code === '23505') throw new Error('Already a member')
            throw error
        }
        return data
    },

    /**
     * Leave a group
     */
    async leaveGroup(groupId: string, userId: string) {
        // Check if user is owner
        const { data: group } = await supabase
            .from('groups')
            .select('owner_id')
            .eq('id', groupId)
            .single()

        if (group?.owner_id === userId) {
            throw new Error('Owner cannot leave group. Transfer ownership or delete the group.')
        }

        const { error } = await supabase
            .from('group_members')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', userId)

        if (error) throw error
    },

    /**
     * Get group members
     */
    async getGroupMembers(groupId: string, limit = 50) {
        const { data, error } = await supabase
            .from('group_members')
            .select(`
        role,
        joined_at,
        user:users!group_members_user_id_fkey(id, handle, display_name, avatar_url, is_verified)
      `)
            .eq('group_id', groupId)
            .order('joined_at', { ascending: false })
            .limit(limit)

        if (error) throw error
        return data
    },

    /**
     * Update member role
     */
    async updateMemberRole(groupId: string, userId: string, targetUserId: string, newRole: GroupRole) {
        // Check if user has permission (owner or admin)
        const { data: membership } = await supabase
            .from('group_members')
            .select('role')
            .eq('group_id', groupId)
            .eq('user_id', userId)
            .single()

        if (!membership || !['owner', 'admin'].includes(membership.role)) {
            throw new Error('Unauthorized')
        }

        // Cannot change owner role
        if (newRole === 'owner') {
            throw new Error('Use transferOwnership to change owner')
        }

        const { data, error } = await supabase
            .from('group_members')
            .update({ role: newRole })
            .eq('group_id', groupId)
            .eq('user_id', targetUserId)
            .select()
            .single()

        if (error) throw error
        return data
    },

    /**
     * Remove member from group
     */
    async removeMember(groupId: string, userId: string, targetUserId: string) {
        // Check if user has permission (owner or admin)
        const { data: membership } = await supabase
            .from('group_members')
            .select('role')
            .eq('group_id', groupId)
            .eq('user_id', userId)
            .single()

        if (!membership || !['owner', 'admin'].includes(membership.role)) {
            throw new Error('Unauthorized')
        }

        const { error } = await supabase
            .from('group_members')
            .delete()
            .eq('group_id', groupId)
            .eq('user_id', targetUserId)

        if (error) throw error
    },

    /**
     * Search groups
     */
    async searchGroups(query: string, limit = 20) {
        const { data, error } = await supabase
            .from('groups')
            .select('*')
            .or(`name.ilike.%${query}%,handle.ilike.%${query}%`)
            .eq('privacy', 'public')
            .limit(limit)

        if (error) throw error
        return data
    },

    /**
     * Get user's groups
     */
    async getUserGroups(userId: string) {
        const { data, error } = await supabase
            .from('group_members')
            .select(`
        role,
        joined_at,
        group:groups!group_members_group_id_fkey(*)
      `)
            .eq('user_id', userId)
            .order('joined_at', { ascending: false })

        if (error) throw error
        return data
    },
}
