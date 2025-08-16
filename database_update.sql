-- SAFE DATABASE UPDATE: Add login_source column
-- This is completely safe and reversible
-- Run this in Supabase SQL Editor

ALTER TABLE user_profiles 
ADD COLUMN login_source text DEFAULT 'direct';

-- Verification query (run after to confirm it worked)
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND column_name = 'login_source';

-- ROLLBACK COMMAND (if needed):
-- ALTER TABLE user_profiles DROP COLUMN login_source;