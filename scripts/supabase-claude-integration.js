const { createClient } = require('@supabase/supabase-js');
const { Anthropic } = require('@anthropic-ai/sdk');

// Load environment variables
require('dotenv').config();

// Supabase setup - using your staging database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Claude setup - you'll need to add your API key to .env.local
const anthropicKey = process.env.ANTHROPIC_API_KEY;

if (!anthropicKey) {
  console.error('❌ Missing ANTHROPIC_API_KEY in environment variables');
  console.log('Add ANTHROPIC_API_KEY="your-key-here" to .env.local');
  process.exit(1);
}

const anthropic = new Anthropic({ apiKey: anthropicKey });

async function analyzeUserProfiles() {
  try {
    console.log('🔍 Querying user profiles from staging database...');
    
    // Query user profiles from staging database
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(5); // Limit for testing
    
    if (error) {
      console.error('❌ Supabase error:', error);
      return;
    }

    console.log(`✅ Retrieved ${data.length} user profiles`);
    
    if (data.length === 0) {
      console.log('ℹ️ No user profiles found in staging database');
      return;
    }

    // Send data to Claude for analysis (using modern API)
    console.log('🤖 Sending data to Claude for analysis...');
    
    const prompt = `Analyze this user profile data from an IBAM learning platform database:

${JSON.stringify(data, null, 2)}

Please provide insights on:
1. User engagement patterns
2. Registration trends
3. Any data quality issues
4. Recommendations for improving user experience

Keep the analysis concise and actionable.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    console.log('\n🎯 Claude Analysis:');
    console.log('='.repeat(50));
    console.log(response.content[0].text);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error in analysis:', error.message);
  }
}

async function testDatabaseSchema() {
  try {
    console.log('🔍 Testing database schema...');
    
    // Test what columns exist in user_profiles
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Schema test error:', error);
      return;
    }

    if (data.length > 0) {
      console.log('✅ Available columns in user_profiles:');
      console.log(Object.keys(data[0]).sort());
    } else {
      console.log('ℹ️ No data found to determine schema');
    }

  } catch (error) {
    console.error('❌ Schema test error:', error.message);
  }
}

async function main() {
  console.log('🚀 IBAM Supabase-Claude Integration Script');
  console.log('========================================');
  
  // Test database connection first
  await testDatabaseSchema();
  
  console.log('\n');
  
  // Analyze user profiles
  await analyzeUserProfiles();
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { analyzeUserProfiles, testDatabaseSchema };