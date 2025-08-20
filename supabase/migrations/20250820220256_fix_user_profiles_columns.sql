-- Fix user_profiles table - add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add auth_user_id column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'auth_user_id'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
    
    -- Add other essential columns if they don't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'first_name'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN first_name TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'last_name'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN last_name TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'is_active'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'has_platform_access'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN has_platform_access BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'created_via_webhook'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN created_via_webhook BOOLEAN DEFAULT false;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'login_source'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN login_source TEXT DEFAULT 'direct';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'magic_token'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN magic_token TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'magic_token_expires_at'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN magic_token_expires_at TIMESTAMPTZ;
    END IF;
    
END $$;

-- Create missing indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_user_id ON public.user_profiles(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_magic_token ON public.user_profiles(magic_token);

-- Ensure email column exists and has proper constraints
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profiles' 
        AND column_name = 'email'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN email TEXT NOT NULL UNIQUE;
    END IF;
END $$;