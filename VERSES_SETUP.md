# Verses Feature Setup Guide

## Quick Start

Follow these steps to get the verses feature working:

### 1. Apply Database Schema

1. Open your Supabase dashboard at https://supabase.com
2. Navigate to **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Open `supabase/verses_schema.sql` in this project
5. Copy the entire contents and paste into the SQL Editor
6. Click **"Run"** to execute the schema
7. Verify success: Go to **Table Editor** and confirm `profiles` and `verses` tables exist

### 2. Verify Environment Variables

Make sure your `.env.local` file has:

```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Test the Feature

1. Navigate to `http://localhost:5173/verses`
2. **Sign up** with a new account (email, password, username)
3. **Create a verse** with title and content
4. **View the feed** to see your verse appear
5. **Test real-time**: Open another browser window, create a verse, and watch it appear in the first window

## Features

✅ **Authentication** - Sign up and login with email/password  
✅ **User Profiles** - Automatic profile creation with username  
✅ **Verse Creation** - Create verses with title, content, and privacy settings  
✅ **Public/Private Verses** - Toggle verse visibility  
✅ **Real-time Feed** - Automatically updates when new verses are created  
✅ **Modern UI** - Beautiful gradient design with shadcn/ui components

## Troubleshooting

### TypeScript Errors

The TypeScript errors you see are expected because the database types don't include the new `verses` and simplified `profiles` tables. The code will work at runtime once the schema is applied. To fix the TypeScript errors, you would need to regenerate the database types from Supabase.

### "Table doesn't exist" Error

Make sure you've run the SQL schema in your Supabase dashboard. The `profiles` and `verses` tables must exist.

### Real-time Not Working

1. Check that Realtime is enabled in Supabase: **Settings** → **API** → **Realtime**
2. Verify the schema includes: `ALTER PUBLICATION supabase_realtime ADD TABLE verses;`

### Authentication Issues

- Verify your Supabase URL and anon key in `.env.local`
- Check browser console for errors
- Ensure the `profiles` table was created successfully

## File Structure

```
src/
├── components/
│   ├── auth/
│   │   └── AuthForm.tsx          # Login/signup form
│   └── verses/
│       ├── VerseCreationForm.tsx # Create new verses
│       └── VerseFeed.tsx         # Display verse feed
├── hooks/
│   └── useVerses.ts              # Verse operations hook
├── pages/
│   └── Verses.tsx                # Main verses page
└── services/
    └── verses.service.ts         # Verse CRUD operations

supabase/
└── verses_schema.sql             # Database schema
```

## Next Steps

- Add user profiles page to display username instead of user ID
- Add verse editing and deletion
- Add comments on verses
- Add likes/reactions
- Implement verse search and filtering
- Add pagination for large feeds
