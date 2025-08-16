const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function createMagicTokensTable() {
  console.log('🔧 Creating magic_tokens table...');
  
  try {
    // Create the magic_tokens table
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
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
        
        CREATE INDEX IF NOT EXISTS idx_magic_tokens_token ON magic_tokens(token);
        CREATE INDEX IF NOT EXISTS idx_magic_tokens_email ON magic_tokens(email);
        CREATE INDEX IF NOT EXISTS idx_magic_tokens_expires ON magic_tokens(expires_at);
      `
    });
    
    if (error) {
      console.log('❌ Table creation failed:', error.message);
      
      // If exec_sql RPC doesn't exist, try direct SQL execution
      console.log('🔄 Trying alternative approach...');
      
      // Create table using direct query (may need to be done in Supabase dashboard)
      console.log(`
📋 MANUAL SETUP REQUIRED:
Please run this SQL in your Supabase dashboard:

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

CREATE INDEX IF NOT EXISTS idx_magic_tokens_token ON magic_tokens(token);
CREATE INDEX IF NOT EXISTS idx_magic_tokens_email ON magic_tokens(email);
CREATE INDEX IF NOT EXISTS idx_magic_tokens_expires ON magic_tokens(expires_at);
      `);
      
    } else {
      console.log('✅ magic_tokens table created successfully!');
    }
    
  } catch (error) {
    console.error('💥 Error creating table:', error);
    console.log(`
📋 MANUAL SETUP REQUIRED:
Please run this SQL in your Supabase dashboard:

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

CREATE INDEX IF NOT EXISTS idx_magic_tokens_token ON magic_tokens(token);
CREATE INDEX IF NOT EXISTS idx_magic_tokens_email ON magic_tokens(email);
CREATE INDEX IF NOT EXISTS idx_magic_tokens_expires ON magic_tokens(expires_at);
    `);
  }
}

// Run the table creation
createMagicTokensTable()
  .then(() => {
    console.log('🎯 Magic tokens table setup complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });