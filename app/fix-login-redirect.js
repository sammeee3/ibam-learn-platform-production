#!/usr/bin/env node

/**
 * Fix IBAM Login Redirect Script
 * This script finds and updates login redirects from /dashboard to /direct-access
 * 
 * Usage: 
 * 1. Save this file as fix-login-redirect.js in your project root
 * 2. Run: node fix-login-redirect.js
 * 3. Review the changes and test your login
 */

const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  // Directories to search
  searchDirs: ['app', 'components', 'lib', 'utils', 'pages', 'src'],
  
  // File extensions to check
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  
  // Patterns to find and replace
  patterns: [
    // Router push patterns
    {
      find: /router\.push\(['"`]\/dashboard['"`]\)/g,
      replace: "router.push('/direct-access')",
      description: "router.push redirect"
    },
    // Window location patterns
    {
      find: /window\.location\.href\s*=\s*['"`]\/dashboard['"`]/g,
      replace: "window.location.href = '/direct-access'",
      description: "window.location redirect"
    },
    // Next.js redirect patterns
    {
      find: /redirect\(['"`]\/dashboard['"`]\)/g,
      replace: "redirect('/direct-access')",
      description: "Next.js redirect"
    },
    // Replace function patterns
    {
      find: /replace\(['"`]\/dashboard['"`]\)/g,
      replace: "replace('/direct-access')",
      description: "replace redirect"
    },
    // Navigation patterns
    {
      find: /navigate\(['"`]\/dashboard['"`]\)/g,
      replace: "navigate('/direct-access')",
      description: "navigate redirect"
    },
    // Href patterns in JSX
    {
      find: /href=['"`]\/dashboard['"`]/g,
      replace: 'href="/direct-access"',
      description: "href attribute"
    },
    // Next.js Link component
    {
      find: /<Link\s+href=['"`]\/dashboard['"`]/g,
      replace: '<Link href="/direct-access"',
      description: "Next.js Link component"
    }
  ],
  
  // Files to skip
  skipFiles: ['node_modules', '.next', '.git', 'dist', 'build', '.vercel']
};

// Track changes
let filesModified = 0;
let totalReplacements = 0;
const changes = [];

// Recursive function to find files
function findFiles(dir, fileList = []) {
  // Skip if directory doesn't exist
  if (!fs.existsSync(dir)) {
    return fileList;
  }

  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    // Skip specified directories
    if (stat.isDirectory() && !config.skipFiles.includes(file)) {
      findFiles(filePath, fileList);
    } else if (stat.isFile() && config.extensions.includes(path.extname(file))) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let fileChanges = [];
    
    // Check each pattern
    config.patterns.forEach(pattern => {
      if (pattern.find.test(content)) {
        const matches = content.match(pattern.find);
        if (matches) {
          content = content.replace(pattern.find, pattern.replace);
          modified = true;
          fileChanges.push({
            pattern: pattern.description,
            count: matches.length
          });
          totalReplacements += matches.length;
        }
      }
    });
    
    // Write back if modified
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesModified++;
      changes.push({
        file: filePath,
        changes: fileChanges
      });
      console.log(`✅ Modified: ${filePath}`);
      fileChanges.forEach(change => {
        console.log(`   - ${change.pattern}: ${change.count} replacement(s)`);
      });
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Main execution
console.log('🔍 IBAM Login Redirect Fix Script');
console.log('==================================\n');

console.log('Searching for files to update...\n');

// Find all files
let allFiles = [];
config.searchDirs.forEach(dir => {
  console.log(`📁 Searching in: ${dir}/`);
  allFiles = allFiles.concat(findFiles(dir));
});

console.log(`\n📋 Found ${allFiles.length} files to check\n`);

// Process each file
allFiles.forEach(file => {
  processFile(file);
});

// Summary
console.log('\n==================================');
console.log('📊 SUMMARY');
console.log('==================================');
console.log(`Files checked: ${allFiles.length}`);
console.log(`Files modified: ${filesModified}`);
console.log(`Total replacements: ${totalReplacements}`);

if (filesModified > 0) {
  console.log('\n✅ SUCCESS! Login redirects have been updated.');
  console.log('\n📝 Next steps:');
  console.log('1. Review the changes above');
  console.log('2. Test your login flow');
  console.log('3. If login still goes to /dashboard, check:');
  console.log('   - Middleware files (middleware.js or _middleware.js)');
  console.log('   - Environment variables');
  console.log('   - Supabase auth redirects');
  console.log('\n💡 TIP: You can search for remaining instances with:');
  console.log('   grep -r "dashboard" --include="*.js" --include="*.jsx" .');
} else {
  console.log('\n⚠️  No login redirects to /dashboard were found.');
  console.log('\nPossible reasons:');
  console.log('1. The redirect might be in a different location');
  console.log('2. It might be using a variable instead of hardcoded string');
  console.log('3. It might be configured in:');
  console.log('   - Environment variables (.env files)');
  console.log('   - Supabase dashboard settings');
  console.log('   - Middleware configuration');
  console.log('   - A configuration file');
  console.log('\n💡 Try searching manually:');
  console.log('   grep -r "dashboard" --include="*.js" --include="*.jsx" --include="*.json" .');
}

// Create a backup reference
if (filesModified > 0) {
  const backupInfo = {
    date: new Date().toISOString(),
    filesModified: filesModified,
    totalReplacements: totalReplacements,
    changes: changes
  };
  
  fs.writeFileSync('login-redirect-changes.json', JSON.stringify(backupInfo, null, 2));
  console.log('\n📄 Backup of changes saved to: login-redirect-changes.json');
}