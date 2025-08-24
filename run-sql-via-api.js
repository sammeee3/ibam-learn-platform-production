const fs = require('fs');

// Read the SQL file
const sql = fs.readFileSync('COMPLETE-STAGING-RESET.sql', 'utf8');

// Parse SQL statements
const statements = sql
  .split(/;\s*$|;\s*\n/m)
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.match(/^--.*$/m));

console.log('🚀 SQL Schema Reset Instructions\n');
console.log('Since the service role key appears invalid, you need to:');
console.log('\n1. Go to: https://supabase.com/dashboard/project/yhfxxouswctucxvfetcq/sql/new');
console.log('\n2. Copy and paste the following SQL:\n');
console.log('='.repeat(60));
console.log(sql);
console.log('='.repeat(60));
console.log('\n3. Click "Run" to execute the SQL');
console.log('\n4. Then come back and run: node AUTOMATED-STAGING-SYNC.js');
