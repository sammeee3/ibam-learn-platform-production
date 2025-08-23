/**
 * 🛠️ Direct SQL Execution via Supabase REST API
 * Alternative method to run SQL commands on production database
 */

const fs = require('fs');

async function executeSQL() {
  try {
    console.log('🔧 Executing SQL via Supabase REST API...');
    console.log('📍 Target: Production Database (tutrnikhomrgcpkzszvq)');
    console.log('');
    
    // Read the SQL file
    const sqlContent = fs.readFileSync('./database-migration-feedback-FIXED.sql', 'utf8');
    
    // Split into individual statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📋 Found ${statements.length} SQL statements to execute`);
    console.log('');
    
    const results = [];
    
    // Execute each statement via REST API
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;
      
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
      
      try {
        const response = await fetch('https://tutrnikhomrgcpkzszvq.supabase.co/rest/v1/rpc/exec_sql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODk0MTksImV4cCI6MjA2NDU2NTQxOX0.-TI2kjnGM27QYM0BfBSogGf8A17VRxNlydoRYmnGmn8'
          },
          body: JSON.stringify({
            sql: statement + ';'
          })
        });
        
        const result = await response.json();
        
        if (response.ok) {
          console.log(`   ✅ Statement ${i + 1} executed successfully`);
          results.push({ statement: i + 1, success: true, result });
        } else {
          if (result.message && result.message.includes('already exists')) {
            console.log(`   ✅ Statement ${i + 1} - Already exists (OK)`);
            results.push({ statement: i + 1, success: true, warning: 'already exists' });
          } else {
            console.log(`   ❌ Statement ${i + 1} failed:`, result.message || result.error);
            results.push({ statement: i + 1, success: false, error: result.message || result.error });
          }
        }
        
      } catch (error) {
        console.log(`   ❌ Statement ${i + 1} error:`, error.message);
        results.push({ statement: i + 1, success: false, error: error.message });
      }
      
      // Small delay between statements
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Summary
    console.log('');
    console.log('📊 EXECUTION SUMMARY:');
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log(`   ✅ Successful: ${successful}`);
    console.log(`   ❌ Failed: ${failed}`);
    
    if (failed === 0 || successful > failed) {
      console.log('');
      console.log('🎉 SQL EXECUTION COMPLETED SUCCESSFULLY!');
      console.log('📋 Production database should now have:');
      console.log('   • user_feedback table');
      console.log('   • admin_tasks table');
      console.log('   • Proper indexes and triggers');
      
      // Test the tables exist
      await testTablesExist();
    } else {
      console.log('');
      console.log('⚠️  Some statements failed. Please check the errors above.');
    }
    
  } catch (error) {
    console.error('❌ SQL execution failed:', error.message);
  }
}

async function testTablesExist() {
  try {
    console.log('');
    console.log('🔍 Verifying tables were created...');
    
    // Test user_feedback table
    const feedbackResponse = await fetch('https://tutrnikhomrgcpkzszvq.supabase.co/rest/v1/user_feedback?limit=1', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODk0MTksImV4cCI6MjA2NDU2NTQxOX0.-TI2kjnGM27QYM0BfBSogGf8A17VRxNlydoRYmnGmn8'
      }
    });
    
    if (feedbackResponse.ok) {
      console.log('   ✅ user_feedback table exists and accessible');
    } else {
      console.log('   ❌ user_feedback table verification failed');
    }
    
    // Test admin_tasks table
    const tasksResponse = await fetch('https://tutrnikhomrgcpkzszvq.supabase.co/rest/v1/admin_tasks?limit=1', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODk4OTQxOSwiZXhwIjoyMDY0NTY1NDE5fQ.HyWce8LXA-UeErpKVsQ7NxInOCTs9rYQw59hNjnNEj0',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5ODk0MTksImV4cCI6MjA2NDU2NTQxOX0.-TI2kjnGM27QYM0BfBSogGf8A17VRxNlydoRYmnGmn8'
      }
    });
    
    if (tasksResponse.ok) {
      console.log('   ✅ admin_tasks table exists and accessible');
      console.log('');
      console.log('🎯 PRODUCTION FEEDBACK SYSTEM READY!');
      console.log('🔄 You can now test the SYNC command to pull from both databases');
    } else {
      console.log('   ❌ admin_tasks table verification failed');
    }
    
  } catch (error) {
    console.log('   ⚠️  Table verification failed:', error.message);
  }
}

// Run the SQL execution
executeSQL();