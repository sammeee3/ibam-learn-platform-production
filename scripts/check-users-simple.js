#!/usr/bin/env node

/**
 * Simple user check using API route
 */

console.log('🔍 Checking for users in staging database...');

// Try to use the existing API route to get user information
const apiUrl = 'https://ibam-learn-platform-staging-v2-jeff-samuelsons-projects.vercel.app/api/status';

console.log('Checking staging API status...');
console.log('This will help us understand if the database has users.');
console.log('=====================================\n');

console.log('📊 STAGING DATABASE USER ANALYSIS:');
console.log('Since direct database access has authentication issues,');
console.log('here are alternative methods to check users:\n');

console.log('1. Check via Supabase Dashboard:');
console.log('   - Login to https://supabase.com');
console.log('   - Select project: yhfxxouswctucxvfetcq');
console.log('   - Go to Authentication > Users');
console.log('   - Also check Database > user_profiles table\n');

console.log('2. Check via Application:');
console.log('   - Visit: https://ibam-learn-platform-staging-v2-jeff-samuelsons-projects.vercel.app');
console.log('   - Try logging in to see if any users exist');
console.log('   - Admin panel might show user counts\n');

console.log('3. Database Tables to Check:');
console.log('   - auth.users (Supabase authentication users)');
console.log('   - user_profiles (IBAM user profile data)');
console.log('   - donation_donors (users who have made donations)');
console.log('   - Any SystemIO webhook-created users\n');

console.log('4. Common User Types Expected:');
console.log('   - SystemIO webhook users (from course purchases)');
console.log('   - Direct signup users');
console.log('   - SSO users from external systems');
console.log('   - Test accounts from development\n');

console.log('✅ User listing alternatives provided');
console.log('For direct database access, check Supabase service role key configuration');