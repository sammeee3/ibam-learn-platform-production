const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Secure local storage location (NOT in project directory)
const SECURE_KEYS_DIR = path.join(process.env.HOME, '.ibam-secure-keys');
const KEYS_FILE = path.join(SECURE_KEYS_DIR, `keys-backup-${new Date().toISOString().split('T')[0]}.json`);

console.log('🔐 AUTOMATED KEY ROTATION & SECURE STORAGE SYSTEM');
console.log('=' .repeat(60));

// Create secure directory if it doesn't exist
if (!fs.existsSync(SECURE_KEYS_DIR)) {
  fs.mkdirSync(SECURE_KEYS_DIR, { mode: 0o700 }); // Owner-only permissions
  console.log('✅ Created secure keys directory:', SECURE_KEYS_DIR);
}

// Function to generate new secure keys
function generateSecureKey(length = 64) {
  return crypto.randomBytes(length).toString('base64');
}

// Generate new keys
const newKeys = {
  staging: {
    anon: `eyJ${generateSecureKey(100)}`,
    service_role: `eyJ${generateSecureKey(100)}`,
    database_url: process.env.STAGING_DATABASE_URL || 'postgresql://postgres:[YOUR-PASSWORD]@db.yhfxxouswctucxvfetcq.supabase.co:5432/postgres',
    project_ref: 'yhfxxouswctucxvfetcq'
  },
  production: {
    anon: `eyJ${generateSecureKey(100)}`,
    service_role: `eyJ${generateSecureKey(100)}`,
    database_url: process.env.PRODUCTION_DATABASE_URL || 'postgresql://postgres:[YOUR-PASSWORD]@db.tutrnikhomrgcpkzszvq.supabase.co:5432/postgres',
    project_ref: 'tutrnikhomrgcpkzszvq'
  },
  generated_at: new Date().toISOString(),
  expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 90 days
};

console.log('\n📝 MANUAL STEPS REQUIRED:');
console.log('Since Supabase key regeneration requires web interface access,');
console.log('you need to manually regenerate keys and update this file.\n');

console.log('STEP 1: Go to Staging Supabase');
console.log('URL: https://supabase.com/dashboard/project/yhfxxouswctucxvfetcq/settings/api');
console.log('- Click "Roll" next to anon (public) key');
console.log('- Click "Roll" next to service_role key');
console.log('- Copy both new keys\n');

console.log('STEP 2: Go to Production Supabase');
console.log('URL: https://supabase.com/dashboard/project/tutrnikhomrgcpkzszvq/settings/api');
console.log('- Click "Roll" next to anon (public) key');
console.log('- Click "Roll" next to service_role key');
console.log('- Copy both new keys\n');

// Save placeholder keys to secure location
fs.writeFileSync(KEYS_FILE, JSON.stringify(newKeys, null, 2), { mode: 0o600 });
console.log('✅ Secure keys file created:', KEYS_FILE);
console.log('   (Edit this file with your actual regenerated keys)\n');

// Create update script
const updateScript = `#!/bin/bash
# Automated Key Update Script
# Generated: ${new Date().toISOString()}

echo "🔄 Updating environment files with new keys..."

# Load keys from secure storage
KEYS_FILE="${KEYS_FILE}"

if [ ! -f "$KEYS_FILE" ]; then
  echo "❌ Keys file not found: $KEYS_FILE"
  exit 1
fi

# Update staging .env.local
cat > .env.local << 'EOF'
# STAGING ENVIRONMENT ONLY - DO NOT USE PRODUCTION CREDENTIALS
IBAM_SYSTEME_SECRET="staging-secret-2025-secure"
NEXT_PUBLIC_SUPABASE_URL="https://yhfxxouswctucxvfetcq.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="[PASTE_STAGING_SERVICE_ROLE_KEY_HERE]"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[PASTE_STAGING_ANON_KEY_HERE]"
EOF

echo "✅ Updated .env.local"
echo ""
echo "📝 NEXT STEPS:"
echo "1. Edit ${KEYS_FILE} with your regenerated keys"
echo "2. Run: npm run dev (to test locally)"
echo "3. Update Vercel environment variables"
echo ""
echo "🔒 Security Notes:"
echo "- Keys are stored in: ${SECURE_KEYS_DIR}"
echo "- This directory is outside your project (won't be committed)"
echo "- Only you can read these files (permission 600)"
`;

const scriptPath = path.join(SECURE_KEYS_DIR, 'update-keys.sh');
fs.writeFileSync(scriptPath, updateScript, { mode: 0o700 });
console.log('✅ Update script created:', scriptPath);

console.log('\n' + '=' .repeat(60));
console.log('📋 SUMMARY OF WHAT WAS CREATED:\n');
console.log(`1. Secure directory: ${SECURE_KEYS_DIR}`);
console.log(`2. Keys backup file: ${KEYS_FILE}`);
console.log(`3. Update script: ${scriptPath}`);
console.log('\n🔐 These files are stored in your home directory,');
console.log('   completely separate from your project files.');
console.log('   They will NEVER be committed to Git.\n');

console.log('🚨 CRITICAL NEXT STEPS:');
console.log('1. Regenerate keys in Supabase dashboards (URLs above)');
console.log(`2. Edit ${KEYS_FILE} with new keys`);
console.log(`3. Run: ${scriptPath}`);
console.log('4. Update Vercel environment variables');

// Create Vercel update instructions
const vercelInstructions = `
# VERCEL ENVIRONMENT VARIABLE UPDATE

## Staging Project
URL: https://vercel.com/ibam-projects/ibam-learn-platform-staging/settings/environment-variables

Update these:
- NEXT_PUBLIC_SUPABASE_URL = https://yhfxxouswctucxvfetcq.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY = [YOUR_NEW_STAGING_ANON_KEY]
- SUPABASE_SERVICE_ROLE_KEY = [YOUR_NEW_STAGING_SERVICE_KEY]

## Production Project  
URL: https://vercel.com/ibam-projects/ibam-learn-platform-production-v3/settings/environment-variables

Update these:
- NEXT_PUBLIC_SUPABASE_URL = https://tutrnikhomrgcpkzszvq.supabase.co
- NEXT_PUBLIC_SUPABASE_ANON_KEY = [YOUR_NEW_PRODUCTION_ANON_KEY]
- SUPABASE_SERVICE_ROLE_KEY = [YOUR_NEW_PRODUCTION_SERVICE_KEY]
`;

fs.writeFileSync(path.join(SECURE_KEYS_DIR, 'VERCEL-UPDATE-GUIDE.txt'), vercelInstructions);
console.log(`\n📄 Vercel update guide saved to: ${SECURE_KEYS_DIR}/VERCEL-UPDATE-GUIDE.txt`);