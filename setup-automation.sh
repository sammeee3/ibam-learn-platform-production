#!/bin/bash

# 🤖 AUTOMATED ACCESS SETUP SCRIPT
# This sets up automated access to Supabase and Vercel

echo "🚀 Setting up automated platform access..."
echo "=" 
echo ""

# Check prerequisites
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ $1 is not installed"
        return 1
    else
        echo "✅ $1 is installed"
        return 0
    fi
}

echo "📋 Checking prerequisites..."
check_command "node"
check_command "npm"
check_command "docker"

# Install Vercel CLI (can fully automate env vars)
echo ""
echo "📦 Installing Vercel CLI..."
if ! command -v vercel &> /dev/null; then
    npm install -g vercel
    echo "✅ Vercel CLI installed"
else
    echo "✅ Vercel CLI already installed"
fi

# Install Supabase CLI (limited automation)
echo ""
echo "📦 Installing Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install supabase/tap/supabase
    else
        # Linux installation
        curl -sSL https://github.com/supabase/cli/releases/download/v1.106.1/supabase_linux_amd64.tar.gz | tar -xz
        sudo mv supabase /usr/local/bin/
    fi
    echo "✅ Supabase CLI installed"
else
    echo "✅ Supabase CLI already installed"
fi

# Install Playwright for browser automation
echo ""
echo "📦 Installing Playwright for browser automation..."
npm install playwright
npx playwright install chromium
echo "✅ Playwright installed with Chromium"

# Create automation directory
AUTOMATION_DIR="$HOME/.ibam-automation"
mkdir -p "$AUTOMATION_DIR"
chmod 700 "$AUTOMATION_DIR"
echo "✅ Created secure automation directory: $AUTOMATION_DIR"

# Create credentials template
cat > "$AUTOMATION_DIR/credentials.env" << 'EOF'
# SUPABASE CREDENTIALS (for automated login)
SUPABASE_EMAIL=your-email@example.com
SUPABASE_PASSWORD=your-password

# VERCEL CREDENTIALS
VERCEL_TOKEN=get-from-vercel-dashboard

# PROJECT IDs
STAGING_PROJECT_ID=yhfxxouswctucxvfetcq
PRODUCTION_PROJECT_ID=tutrnikhomrgcpkzszvq
EOF

chmod 600 "$AUTOMATION_DIR/credentials.env"
echo "✅ Created credentials template: $AUTOMATION_DIR/credentials.env"

# Create automated key rotation script
cat > "$AUTOMATION_DIR/rotate-keys-automated.js" << 'EOF'
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'credentials.env') });

async function rotateSupabaseKeys(projectId, projectName) {
  console.log(`🔄 Rotating keys for ${projectName}...`);
  
  const browser = await chromium.launch({ 
    headless: false, // Set to true for background operation
    slowMo: 500 // Slow down for reliability
  });
  
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Login to Supabase
    console.log('📝 Logging into Supabase...');
    await page.goto('https://supabase.com/dashboard/sign-in');
    await page.fill('input[type="email"]', process.env.SUPABASE_EMAIL);
    await page.fill('input[type="password"]', process.env.SUPABASE_PASSWORD);
    await page.click('button[type="submit"]');
    
    // Wait for dashboard to load
    await page.waitForURL('**/dashboard/**', { timeout: 30000 });
    console.log('✅ Logged in successfully');
    
    // Navigate to API settings
    console.log('📍 Navigating to API settings...');
    await page.goto(`https://supabase.com/dashboard/project/${projectId}/settings/api`);
    await page.waitForSelector('text=API Settings', { timeout: 10000 });
    
    // Get current keys before rotation
    const oldAnonKey = await page.textContent('[data-testid="anon-key-value"]').catch(() => null);
    const oldServiceKey = await page.textContent('[data-testid="service-key-value"]').catch(() => null);
    
    // Rotate anon key
    console.log('🔄 Rotating anon key...');
    await page.click('button:has-text("Roll"):near([data-testid="anon-key"])');
    await page.click('button:has-text("Confirm")');
    await page.waitForTimeout(2000);
    
    // Rotate service key
    console.log('🔄 Rotating service role key...');
    await page.click('button:has-text("Roll"):near([data-testid="service-key"])');
    await page.click('button:has-text("Confirm")');
    await page.waitForTimeout(2000);
    
    // Get new keys
    const newAnonKey = await page.textContent('[data-testid="anon-key-value"]').catch(() => null);
    const newServiceKey = await page.textContent('[data-testid="service-key-value"]').catch(() => null);
    
    console.log('✅ Keys rotated successfully');
    
    await browser.close();
    
    return {
      project: projectName,
      projectId,
      oldKeys: { anon: oldAnonKey, service: oldServiceKey },
      newKeys: { anon: newAnonKey, service: newServiceKey },
      rotatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Error rotating keys:', error);
    await browser.close();
    throw error;
  }
}

async function updateVercelEnvVars(keys) {
  console.log('🔄 Updating Vercel environment variables...');
  
  // This uses Vercel CLI which must be authenticated
  const { exec } = require('child_process');
  const { promisify } = require('util');
  const execAsync = promisify(exec);
  
  try {
    // Update staging
    if (keys.staging) {
      await execAsync(`vercel env rm NEXT_PUBLIC_SUPABASE_ANON_KEY --yes`);
      await execAsync(`vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production <<< "${keys.staging.newKeys.anon}"`);
      
      await execAsync(`vercel env rm SUPABASE_SERVICE_ROLE_KEY --yes`);
      await execAsync(`vercel env add SUPABASE_SERVICE_ROLE_KEY production <<< "${keys.staging.newKeys.service}"`);
    }
    
    console.log('✅ Vercel environment variables updated');
  } catch (error) {
    console.error('❌ Error updating Vercel:', error);
  }
}

// Main execution
async function main() {
  console.log('🚀 AUTOMATED KEY ROTATION SYSTEM');
  console.log('='.repeat(50));
  
  const results = {};
  
  // Rotate staging keys
  try {
    results.staging = await rotateSupabaseKeys(
      process.env.STAGING_PROJECT_ID,
      'Staging'
    );
  } catch (error) {
    console.error('Failed to rotate staging keys:', error);
  }
  
  // Rotate production keys
  try {
    results.production = await rotateSupabaseKeys(
      process.env.PRODUCTION_PROJECT_ID,
      'Production'
    );
  } catch (error) {
    console.error('Failed to rotate production keys:', error);
  }
  
  // Save results
  const resultsPath = path.join(__dirname, `key-rotation-${Date.now()}.json`);
  fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));
  console.log(`\n📄 Results saved to: ${resultsPath}`);
  
  // Update Vercel
  await updateVercelEnvVars(results);
  
  console.log('\n✅ KEY ROTATION COMPLETE');
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { rotateSupabaseKeys, updateVercelEnvVars };
EOF

chmod +x "$AUTOMATION_DIR/rotate-keys-automated.js"
echo "✅ Created automated rotation script"

echo ""
echo "=" 
echo "🎯 SETUP COMPLETE!"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Edit credentials file: $AUTOMATION_DIR/credentials.env"
echo "2. Add your Supabase email and password"
echo "3. Login to Vercel CLI: vercel login"
echo "4. Login to Supabase CLI: supabase login"
echo ""
echo "🚀 TO RUN AUTOMATED KEY ROTATION:"
echo "   cd $AUTOMATION_DIR"
echo "   node rotate-keys-automated.js"
echo ""
echo "⚠️  SECURITY NOTES:"
echo "- Credentials are stored in your home directory (not in project)"
echo "- Files have restricted permissions (only you can read)"
echo "- Consider using a password manager CLI for better security"
echo ""
echo "🐳 FOR DOCKER ISOLATION (optional):"
echo "   docker build -t key-rotator ."
echo "   docker run --env-file credentials.env key-rotator"