-- Verses Feature Schema
-- This creates simplified tables for the verses feature
-- Run this in your Supabase SQL Editor

-- Profiles table (extends Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Verses table (for user-generated content)
CREATE TABLE IF NOT EXISTS verses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE verses ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
-- Users can view any profile
CREATE POLICY "Profiles are viewable by everyone" 
  ON profiles FOR SELECT 
  USING (true);

-- Users can view their own profile
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" 
  ON profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Policies for verses
-- Public verses are viewable by everyone
CREATE POLICY "Public verses are viewable" 
  ON verses FOR SELECT 
  USING (is_public = true OR auth.uid() = user_id);

-- Users can view their own verses (public or private)
CREATE POLICY "Users can view own verses" 
  ON verses FOR SELECT 
  USING (auth.uid() = user_id);

-- Authenticated users can insert verses
CREATE POLICY "Authenticated users can insert verses" 
  ON verses FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own verses
CREATE POLICY "Users can update own verses" 
  ON verses FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own verses
CREATE POLICY "Users can delete own verses" 
  ON verses FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_verses_user_id ON verses(user_id);
CREATE INDEX IF NOT EXISTS idx_verses_created_at ON verses(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_verses_is_public ON verses(is_public);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on verses
DROP TRIGGER IF EXISTS update_verses_updated_at ON verses;
CREATE TRIGGER update_verses_updated_at
  BEFORE UPDATE ON verses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable realtime for verses table
ALTER PUBLICATION supabase_realtime ADD TABLE verses;

COMMENT ON TABLE profiles IS 'User profiles extending Supabase Auth users';
COMMENT ON TABLE verses IS 'User-generated verse content with privacy controls';
