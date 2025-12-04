# Supabase Backend Setup Guide

This guide will help you set up the Supabase backend for Arcadia Verse.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **"New Project"**
3. Fill in your project details:
   - **Name**: arcadia-verse (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Click **"Create new project"**
5. Wait for the project to be provisioned (takes ~2 minutes)

## Step 2: Run the Database Schema

1. In your Supabase dashboard, go to the **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open the file `supabase/schema.sql` in this project
4. Copy the entire contents and paste it into the SQL Editor
5. Click **"Run"** to execute the schema
6. You should see a success message

## Step 3: Configure Environment Variables

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (the long string under "Project API keys")

3. Create a `.env.local` file in the project root:

```bash
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace the values with your actual Supabase credentials.

## Step 4: Set Up Storage Buckets

For media uploads to work, you need to create storage buckets:

1. In Supabase dashboard, go to **Storage** (left sidebar)
2. Create the following buckets:
   - **images** (for image uploads)
   - **videos** (for video uploads)
   - **media** (for other media types)

3. For each bucket, set the following policies:
   - **Public access**: Enable if you want media to be publicly accessible
   - **Upload policy**: Allow authenticated users to upload
   - **Delete policy**: Allow users to delete their own files

### Example Storage Policy (for images bucket):

**Insert Policy:**
```sql
CREATE POLICY "Users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**Select Policy (Public):**
```sql
CREATE POLICY "Images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'images');
```

**Delete Policy:**
```sql
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

Repeat similar policies for `videos` and `media` buckets.

## Step 5: Enable Row Level Security (Optional but Recommended)

For production, you should enable Row Level Security (RLS) on your tables:

1. In SQL Editor, run:

```sql
-- Enable RLS on posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Public posts are visible to everyone
CREATE POLICY "Public posts are viewable by everyone"
ON posts FOR SELECT
USING (visibility = 'public');

-- Users can view their own posts
CREATE POLICY "Users can view own posts"
ON posts FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own posts
CREATE POLICY "Users can create posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);
```

Repeat similar policies for other tables as needed.

## Step 6: Test the Integration

1. Install dependencies (if not already done):
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Test authentication:
   - Try signing up with a new account
   - Check if the user appears in the Supabase dashboard under **Authentication** → **Users**

4. Test database operations:
   - Create a post
   - Upload an image
   - Check if data appears in **Table Editor**

## Step 7: Using the Backend Services

### Authentication Example

```typescript
import { useAuth } from '@/hooks/useAuth'

function LoginForm() {
  const { signIn, isSigningIn } = useAuth()

  const handleSubmit = async (email: string, password: string) => {
    try {
      await signIn({ email, password })
      // User is now signed in
    } catch (error) {
      console.error('Sign in failed:', error)
    }
  }
}
```

### Posts Example

```typescript
import { usePosts } from '@/hooks/usePosts'

function Feed() {
  const { posts, isLoading, fetchNextPage, hasNextPage } = usePosts()

  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>
          Load More
        </button>
      )}
    </div>
  )
}
```

### Real-time Messages Example

```typescript
import { useRealtimeMessages, useMessages } from '@/hooks/useMessages'

function ChatThread({ threadId }: { threadId: string }) {
  const { messages } = useMessages(threadId)
  useRealtimeMessages(threadId) // Automatically subscribes to new messages

  return (
    <div>
      {messages.map(msg => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
    </div>
  )
}
```

## Available Services

All services are located in `src/services/`:

- **auth.service.ts** - Authentication (sign up, sign in, sign out)
- **users.service.ts** - User profiles and search
- **posts.service.ts** - Posts CRUD and feed
- **media.service.ts** - Media upload and management
- **social.service.ts** - Follows, likes, comments
- **stories.service.ts** - 24-hour ephemeral stories
- **messages.service.ts** - Real-time messaging
- **groups.service.ts** - Communities and groups
- **jobs.service.ts** - Job postings and companies

## Available Hooks

All hooks are located in `src/hooks/`:

- **useAuth.ts** - Authentication state and actions
- **usePosts.ts** - Posts feed with infinite scroll
- **useUsers.ts** - User profiles and search
- **useSocial.ts** - Social interactions
- **useMessages.ts** - Messaging with real-time updates

## Troubleshooting

### "Missing Supabase environment variables"
- Make sure `.env.local` exists and contains valid credentials
- Restart the dev server after creating `.env.local`

### "Failed to upload media"
- Check that storage buckets are created
- Verify storage policies allow authenticated uploads
- Check file size limits in Supabase dashboard

### "Authentication not working"
- Verify Supabase project URL and anon key are correct
- Check that the `users` table was created successfully
- Look for errors in browser console

### "Real-time not working"
- Ensure Realtime is enabled in Supabase dashboard (**Settings** → **API** → **Realtime**)
- Check that you're subscribed to the correct channel

## Next Steps

- Implement UI components using the provided hooks
- Add more RLS policies for security
- Set up email templates in Supabase for password reset
- Configure OAuth providers (Google, GitHub, etc.) in Supabase Auth settings
- Set up database backups in production

## Support

For issues with:
- **Supabase**: Check [Supabase docs](https://supabase.com/docs)
- **This integration**: Review the implementation plan and service files
