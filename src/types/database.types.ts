// Database Types - Generated from Supabase Schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PostVisibility = 'public' | 'followers' | 'private' | 'groups'
export type MediaType = 'image' | 'video' | 'audio' | 'thumbnail' | 'other'
export type GroupPrivacy = 'public' | 'private' | 'secret'
export type ProfileType = 'personal' | 'professional' | 'company'
export type GroupRole = 'owner' | 'admin' | 'moderator' | 'member'
export type ReportStatus = 'open' | 'in_review' | 'resolved' | 'dismissed'
export type TranscodingStatus = 'pending' | 'queued' | 'processing' | 'done' | 'failed'

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          phone: string | null
          password_hash: string | null
          handle: string
          display_name: string | null
          avatar_url: string | null
          profile_type: ProfileType
          is_verified: boolean
          created_at: string
          last_seen_at: string | null
          metadata: Json
        }
        Insert: {
          id?: string
          email?: string | null
          phone?: string | null
          password_hash?: string | null
          handle: string
          display_name?: string | null
          avatar_url?: string | null
          profile_type?: ProfileType
          is_verified?: boolean
          created_at?: string
          last_seen_at?: string | null
          metadata?: Json
        }
        Update: {
          id?: string
          email?: string | null
          phone?: string | null
          password_hash?: string | null
          handle?: string
          display_name?: string | null
          avatar_url?: string | null
          profile_type?: ProfileType
          is_verified?: boolean
          created_at?: string
          last_seen_at?: string | null
          metadata?: Json
        }
      }
      profiles: {
        Row: {
          user_id: string
          headline: string | null
          bio: string | null
          location: string | null
          website: string | null
          skills: Json
          education: Json
          experience: Json
          portfolio_links: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          headline?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          skills?: Json
          education?: Json
          experience?: Json
          portfolio_links?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          headline?: string | null
          bio?: string | null
          location?: string | null
          website?: string | null
          skills?: Json
          education?: Json
          experience?: Json
          portfolio_links?: Json
          created_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          caption: string | null
          content: Json
          visibility: PostVisibility
          is_pinned: boolean
          language: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          caption?: string | null
          content?: Json
          visibility?: PostVisibility
          is_pinned?: boolean
          language?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          caption?: string | null
          content?: Json
          visibility?: PostVisibility
          is_pinned?: boolean
          language?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      media: {
        Row: {
          id: string
          owner_id: string
          post_id: string | null
          storage_key: string
          url: string | null
          type: MediaType
          width: number | null
          height: number | null
          duration_seconds: number | null
          size_bytes: number | null
          meta: Json
          transcoding_status: TranscodingStatus
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          post_id?: string | null
          storage_key: string
          url?: string | null
          type: MediaType
          width?: number | null
          height?: number | null
          duration_seconds?: number | null
          size_bytes?: number | null
          meta?: Json
          transcoding_status?: TranscodingStatus
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          post_id?: string | null
          storage_key?: string
          url?: string | null
          type?: MediaType
          width?: number | null
          height?: number | null
          duration_seconds?: number | null
          size_bytes?: number | null
          meta?: Json
          transcoding_status?: TranscodingStatus
          created_at?: string
        }
      }
      videos: {
        Row: {
          id: string
          media_id: string
          transcoding_status: TranscodingStatus
          renditions: Json
          thumbnails: Json
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          media_id: string
          transcoding_status?: TranscodingStatus
          renditions?: Json
          thumbnails?: Json
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          media_id?: string
          transcoding_status?: TranscodingStatus
          renditions?: Json
          thumbnails?: Json
          created_at?: string
          updated_at?: string | null
        }
      }
      stories: {
        Row: {
          id: string
          user_id: string
          media_id: string
          created_at: string
          expires_at: string
          viewers_count: number
          privacy: Json
        }
        Insert: {
          id?: string
          user_id: string
          media_id: string
          created_at?: string
          expires_at: string
          viewers_count?: number
          privacy?: Json
        }
        Update: {
          id?: string
          user_id?: string
          media_id?: string
          created_at?: string
          expires_at?: string
          viewers_count?: number
          privacy?: Json
        }
      }
      follows: {
        Row: {
          follower_id: string
          followee_id: string
          created_at: string
        }
        Insert: {
          follower_id: string
          followee_id: string
          created_at?: string
        }
        Update: {
          follower_id?: string
          followee_id?: string
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          target_type: string
          target_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          target_type: string
          target_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          target_type?: string
          target_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          parent_id: string | null
          content: string
          metadata: Json
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          parent_id?: string | null
          content: string
          metadata?: Json
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          parent_id?: string | null
          content?: string
          metadata?: Json
          created_at?: string
          updated_at?: string | null
        }
      }
      groups: {
        Row: {
          id: string
          owner_id: string
          name: string
          handle: string | null
          description: string | null
          cover_media_id: string | null
          privacy: GroupPrivacy
          settings: Json
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          handle?: string | null
          description?: string | null
          cover_media_id?: string | null
          privacy?: GroupPrivacy
          settings?: Json
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          handle?: string | null
          description?: string | null
          cover_media_id?: string | null
          privacy?: GroupPrivacy
          settings?: Json
          created_at?: string
        }
      }
      group_members: {
        Row: {
          group_id: string
          user_id: string
          role: GroupRole
          joined_at: string
        }
        Insert: {
          group_id: string
          user_id: string
          role?: GroupRole
          joined_at?: string
        }
        Update: {
          group_id?: string
          user_id?: string
          role?: GroupRole
          joined_at?: string
        }
      }
      threads: {
        Row: {
          id: string
          is_group: boolean
          name: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          is_group?: boolean
          name?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          is_group?: boolean
          name?: string | null
          metadata?: Json
          created_at?: string
        }
      }
      thread_members: {
        Row: {
          thread_id: string
          user_id: string
          joined_at: string
          last_read_at: string | null
        }
        Insert: {
          thread_id: string
          user_id: string
          joined_at?: string
          last_read_at?: string | null
        }
        Update: {
          thread_id?: string
          user_id?: string
          joined_at?: string
          last_read_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          thread_id: string
          sender_id: string
          content: Json
          created_at: string
          edited_at: string | null
        }
        Insert: {
          id?: string
          thread_id: string
          sender_id: string
          content: Json
          created_at?: string
          edited_at?: string | null
        }
        Update: {
          id?: string
          thread_id?: string
          sender_id?: string
          content?: Json
          created_at?: string
          edited_at?: string | null
        }
      }
      companies: {
        Row: {
          id: string
          name: string
          handle: string | null
          description: string | null
          website: string | null
          logo_media_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          handle?: string | null
          description?: string | null
          website?: string | null
          logo_media_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          handle?: string | null
          description?: string | null
          website?: string | null
          logo_media_id?: string | null
          created_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          company_id: string | null
          poster_id: string | null
          title: string
          description: string | null
          location: string | null
          employment_type: string | null
          salary_range: Json | null
          requirements: Json | null
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          company_id?: string | null
          poster_id?: string | null
          title: string
          description?: string | null
          location?: string | null
          employment_type?: string | null
          salary_range?: Json | null
          requirements?: Json | null
          created_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          company_id?: string | null
          poster_id?: string | null
          title?: string
          description?: string | null
          location?: string | null
          employment_type?: string | null
          salary_range?: Json | null
          requirements?: Json | null
          created_at?: string
          expires_at?: string | null
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string | null
          target_type: string
          target_id: string
          reason: string | null
          details: Json
          status: ReportStatus
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          reporter_id?: string | null
          target_type: string
          target_id: string
          reason?: string | null
          details?: Json
          status?: ReportStatus
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          reporter_id?: string | null
          target_type?: string
          target_id?: string
          reason?: string | null
          details?: Json
          status?: ReportStatus
          created_at?: string
          updated_at?: string | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          admin_user_id: string | null
          action: string
          target_type: string | null
          target_id: string | null
          payload: Json
          created_at: string
        }
        Insert: {
          id?: string
          admin_user_id?: string | null
          action: string
          target_type?: string | null
          target_id?: string | null
          payload?: Json
          created_at?: string
        }
        Update: {
          id?: string
          admin_user_id?: string | null
          action?: string
          target_type?: string | null
          target_id?: string | null
          payload?: Json
          created_at?: string
        }
      }
    }
    Views: {
      user_activity_summary: {
        Row: {
          user_id: string | null
          handle: string | null
          posts_count: number | null
          comments_count: number | null
          likes_given: number | null
        }
      }
    }
  }
}

// Helper types for easier usage
export type User = Database['public']['Tables']['users']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Post = Database['public']['Tables']['posts']['Row']
export type Media = Database['public']['Tables']['media']['Row']
export type Video = Database['public']['Tables']['videos']['Row']
export type Story = Database['public']['Tables']['stories']['Row']
export type Follow = Database['public']['Tables']['follows']['Row']
export type Like = Database['public']['Tables']['likes']['Row']
export type Comment = Database['public']['Tables']['comments']['Row']
export type Group = Database['public']['Tables']['groups']['Row']
export type GroupMember = Database['public']['Tables']['group_members']['Row']
export type Thread = Database['public']['Tables']['threads']['Row']
export type ThreadMember = Database['public']['Tables']['thread_members']['Row']
export type Message = Database['public']['Tables']['messages']['Row']
export type Company = Database['public']['Tables']['companies']['Row']
export type Job = Database['public']['Tables']['jobs']['Row']
export type Report = Database['public']['Tables']['reports']['Row']
export type AuditLog = Database['public']['Tables']['audit_logs']['Row']

// Extended types with relations
export interface UserWithProfile extends User {
  profile?: Profile
}

export interface PostWithUser extends Post {
  user: User
  media?: Media[]
  likes_count?: number
  comments_count?: number
  is_liked?: boolean
}

export interface CommentWithUser extends Comment {
  user: User
  replies?: CommentWithUser[]
}

export interface GroupWithMembers extends Group {
  members_count?: number
  is_member?: boolean
  role?: GroupRole
}
