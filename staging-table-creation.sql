-- Create user_profiles table for staging database
-- Run this in: https://supabase.com/dashboard/project/yhfxxouswctucxvfetcq/sql

CREATE TABLE public.user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  is_active BOOLEAN DEFAULT true,
  has_platform_access BOOLEAN DEFAULT true,
  created_via_webhook BOOLEAN DEFAULT false,
  login_source TEXT DEFAULT 'direct',
  magic_token TEXT,
  magic_token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_auth_user_id ON public.user_profiles(auth_user_id);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create basic policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Allow service role to do everything
CREATE POLICY "Service role full access" ON public.user_profiles
  FOR ALL USING (auth.role() = 'service_role');
