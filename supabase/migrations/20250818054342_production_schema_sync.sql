-- Production Schema Sync Migration
-- This migration creates the complete IBAM production schema in staging
-- Safe: Creates tables only, no data transfer

-- User Profiles Table (Core authentication and user data)
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  login_source VARCHAR(50) DEFAULT 'direct',
  created_via_webhook BOOLEAN DEFAULT false,
  magic_token VARCHAR(64),
  magic_token_expires_at TIMESTAMP WITH TIME ZONE
);

-- Sessions Table (Learning progress tracking)
CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  module_id VARCHAR(255) NOT NULL,
  session_id VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  description TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Progress Table (Course completion tracking)
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  user_profile_id INTEGER REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_id INTEGER REFERENCES sessions(id) ON DELETE CASCADE,
  completion_percentage INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Magic Tokens Table (System.io integration)
CREATE TABLE IF NOT EXISTS magic_tokens (
  id SERIAL PRIMARY KEY,
  token VARCHAR(64) UNIQUE NOT NULL,
  user_profile_id INTEGER REFERENCES user_profiles(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  course_id VARCHAR(255),
  course_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_magic_token ON user_profiles(magic_token);
CREATE INDEX IF NOT EXISTS idx_sessions_module_session ON sessions(module_id, session_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_profile_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_session_id ON user_progress(session_id);
CREATE INDEX IF NOT EXISTS idx_magic_tokens_token ON magic_tokens(token);
CREATE INDEX IF NOT EXISTS idx_magic_tokens_email ON magic_tokens(email);
CREATE INDEX IF NOT EXISTS idx_magic_tokens_expires ON magic_tokens(expires_at);

-- Row Level Security (RLS) Setup
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE magic_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid()::text = user_profile_id::text);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT WITH CHECK (auth.uid()::text = user_profile_id::text);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE USING (auth.uid()::text = user_profile_id::text);

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE ON user_profiles TO authenticated;
GRANT SELECT ON sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON user_progress TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON magic_tokens TO service_role;

-- Grant sequence permissions
GRANT USAGE, SELECT ON SEQUENCE user_profiles_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE sessions_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE user_progress_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE magic_tokens_id_seq TO service_role;