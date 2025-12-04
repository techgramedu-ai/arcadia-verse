-- Enable extensions commonly useful on Supabase/Postgres
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users: core account info
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE,
  phone text UNIQUE,
  password_hash text,                -- optional if using Supabase auth
  handle text UNIQUE NOT NULL,
  display_name text,
  avatar_url text,
  profile_type text DEFAULT 'personal', -- 'personal' | 'professional' | 'company'
  is_verified boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  last_seen_at timestamptz,
  metadata jsonb DEFAULT '{}'        -- store misc flags, preferences
);

CREATE INDEX idx_users_handle ON users (lower(handle));
CREATE INDEX idx_users_email ON users (lower(email));

-- Profiles: social + professional info
CREATE TABLE profiles (
  user_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  headline text,                       -- short professional headline / tagline
  bio text,
  location text,
  website text,
  skills jsonb DEFAULT '[]'::jsonb,    -- array of skills
  education jsonb DEFAULT '[]'::jsonb, -- list of education objects
  experience jsonb DEFAULT '[]'::jsonb,-- list of experience objects
  portfolio_links jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Posts table (images, carousels, text-only, link posts)
CREATE TYPE post_visibility AS ENUM ('public','followers','private','groups');
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  caption text,
  content jsonb DEFAULT '{}'::jsonb,   -- flexible: attachments, mentions, metadata
  visibility post_visibility DEFAULT 'public',
  is_pinned boolean DEFAULT false,
  language text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);
CREATE INDEX idx_posts_user_created ON posts (user_id, created_at DESC);

-- Media table: stores each media asset (images, video, audio)
CREATE TYPE media_type AS ENUM ('image','video','audio','thumbnail','other');
CREATE TABLE media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id uuid REFERENCES posts(id) ON DELETE SET NULL,
  storage_key text NOT NULL,           -- key in R2 / object storage
  url text,                            -- CDN URL (cached)
  type media_type NOT NULL,
  width int,
  height int,
  duration_seconds numeric,
  size_bytes bigint,
  meta jsonb DEFAULT '{}'::jsonb,      -- e.g. {"codec":"h264","bitrate":...}
  transcoding_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_media_owner ON media (owner_id);
CREATE INDEX idx_media_post ON media (post_id);

-- Videos: additional per-video state (transcoding, renditions)
CREATE TABLE videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id uuid UNIQUE NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  transcoding_status text DEFAULT 'queued', -- queued | processing | done | failed
  renditions jsonb DEFAULT '[]'::jsonb,     -- [{resolution:'720p', key:'...'}]
  thumbnails jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);
CREATE INDEX idx_videos_status ON videos (transcoding_status);

-- Stories (ephemeral content)
CREATE TABLE stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  media_id uuid NOT NULL REFERENCES media(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,     -- set to created_at + interval '24 hours' at insert
  viewers_count bigint DEFAULT 0,
  privacy jsonb DEFAULT '{}'::jsonb
);
CREATE INDEX idx_stories_user ON stories (user_id);
CREATE INDEX idx_stories_expires ON stories (expires_at);

-- Follows / Connections
CREATE TABLE follows (
  follower_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  followee_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (follower_id, followee_id)
);
CREATE INDEX idx_follows_followee ON follows (followee_id);

-- Likes (generic polymorphic targets)
CREATE TABLE likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  target_type text NOT NULL,   -- 'post', 'comment', 'media', 'story' etc
  target_id uuid NOT NULL,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_likes_user ON likes (user_id);
CREATE INDEX idx_likes_target ON likes (target_type, target_id);

-- Comments (threaded)
CREATE TABLE comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_id uuid REFERENCES comments(id) ON DELETE CASCADE,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb, -- e.g. editing history
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);
CREATE INDEX idx_comments_post ON comments (post_id, created_at DESC);

-- Groups / Communities
CREATE TYPE group_privacy AS ENUM ('public','private','secret');
CREATE TABLE groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  name text NOT NULL,
  handle text UNIQUE,
  description text,
  cover_media_id uuid REFERENCES media(id),
  privacy group_privacy DEFAULT 'public',
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_groups_owner ON groups (owner_id);

CREATE TABLE group_members (
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text DEFAULT 'member', -- 'owner','admin','moderator','member'
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (group_id, user_id)
);

-- Messages / Threads (basic)
CREATE TABLE threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_group boolean DEFAULT false,
  name text,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE thread_members (
  thread_id uuid NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  joined_at timestamptz DEFAULT now(),
  last_read_at timestamptz,
  PRIMARY KEY (thread_id, user_id)
);

CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content jsonb NOT NULL,  -- supports text, attachments, reactions, ephemeral flags
  created_at timestamptz DEFAULT now(),
  edited_at timestamptz
);
CREATE INDEX idx_messages_thread_created ON messages (thread_id, created_at DESC);

-- Jobs / Professional listings
CREATE TABLE companies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  handle text UNIQUE,
  description text,
  website text,
  logo_media_id uuid REFERENCES media(id),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid REFERENCES companies(id) ON DELETE CASCADE,
  poster_id uuid REFERENCES users(id) ON DELETE SET NULL,
  title text NOT NULL,
  description text,
  location text,
  employment_type text, -- full-time, part-time, contract
  salary_range jsonb,
  requirements jsonb,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz
);
CREATE INDEX idx_jobs_company ON jobs (company_id);

-- Reports table for moderation
CREATE TABLE reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id uuid REFERENCES users(id) ON DELETE SET NULL,
  target_type text NOT NULL,  -- 'post','comment','user','media'
  target_id uuid NOT NULL,
  reason text,
  details jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'open',  -- open | in_review | resolved | dismissed
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);
CREATE INDEX idx_reports_status ON reports (status);

-- Audit log (admin actions)
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid REFERENCES users(id),
  action text NOT NULL,
  target_type text,
  target_id uuid,
  payload jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Example materialized view: user activity summary (optional)
CREATE MATERIALIZED VIEW user_activity_summary AS
SELECT
  u.id AS user_id,
  u.handle,
  COUNT(DISTINCT p.id) AS posts_count,
  COUNT(DISTINCT c.id) AS comments_count,
  COUNT(DISTINCT l.id) FILTER (WHERE l.target_type = 'post') AS likes_given
FROM users u
LEFT JOIN posts p ON p.user_id = u.id
LEFT JOIN comments c ON c.user_id = u.id
LEFT JOIN likes l ON l.user_id = u.id
GROUP BY u.id, u.handle;

-- Index recommendations for feed queries
CREATE INDEX idx_posts_created ON posts (created_at DESC);
CREATE INDEX idx_posts_visibility ON posts (visibility);

-- Row-Level Security (RLS) examples (enable and customize in Supabase)
-- NOTE: enable RLS only after testing policies
-- ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "public_posts" ON posts FOR SELECT USING (visibility = 'public');
-- CREATE POLICY "owner_can_modify" ON posts FOR UPDATE USING (user_id = auth.uid());

-- Example sequences or helper functions (if needed)
-- CREATE SEQUENCE seq_notification_id START 1;
