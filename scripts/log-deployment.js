#!/usr/bin/env node

/**
 * AUTOMATED DEPLOYMENT LOGGING SCRIPT
 * 
 * This script automatically creates deployment logs by analyzing git commits
 * and detecting the deployment environment. Can be integrated into CI/CD pipelines.
 * 
 * Usage:
 * - node scripts/log-deployment.js --env=production --version=v2.3.0
 * - node scripts/log-deployment.js --env=staging --auto-version
 * - node scripts/log-deployment.js --help
 */

const { execSync } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://ibam-learn-platform-v3.vercel.app'
  : 'https://ibam-learn-platform-staging.vercel.app';

const CREATE_LOG_ENDPOINT = '/api/admin/create-deployment-log';

// Command line arguments
const args = process.argv.slice(2);
const config = parseArguments(args);

async function main() {
  try {
    console.log('🚀 Starting automated deployment logging...');
    console.log(`📊 Environment: ${config.environment}`);
    console.log(`📝 Version: ${config.version}`);
    
    // Validate we're in a git repository
    if (!isGitRepository()) {
      throw new Error('Not in a git repository. Please run this script from the project root.');
    }

    // Get deployment start time
    const deploymentStartTime = new Date().toISOString();
    
    // Collect git data
    const gitData = await collectGitData(config);
    console.log(`📊 Analyzed ${gitData.commits.length} commits`);

    // Determine version if auto-versioning
    if (config.version === 'auto') {
      config.version = await generateVersion(config.environment, gitData);
      console.log(`📋 Auto-generated version: ${config.version}`);
    }

    // Create deployment log
    const deploymentEndTime = new Date().toISOString();
    const logData = {
      version_number: config.version,
      environment: config.environment,
      git_commits: gitData.commits,
      deployed_by: gitData.author || 'automated-system',
      deployment_start_time: deploymentStartTime,
      deployment_end_time: deploymentEndTime
    };

    console.log('📤 Creating deployment log...');
    const result = await createDeploymentLog(logData);
    
    if (result.success) {
      console.log(`✅ Deployment logged successfully!`);
      console.log(`📋 Action: ${result.action}`);
      console.log(`📊 Summary: ${result.summary.features} features, ${result.summary.bugs} fixes, ${result.summary.improvements} improvements`);
      console.log(`⚡ Impact Level: ${result.summary.impact}`);
    } else {
      console.error(`❌ Failed to create deployment log: ${result.error}`);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Deployment logging failed:', error.message);
    process.exit(1);
  }
}

// Parse command line arguments
function parseArguments(args) {
  const config = {
    environment: null,
    version: 'auto',
    commitRange: null,
    help: false
  };

  for (const arg of args) {
    if (arg === '--help' || arg === '-h') {
      config.help = true;
    } else if (arg.startsWith('--env=')) {
      config.environment = arg.split('=')[1];
    } else if (arg.startsWith('--version=')) {
      config.version = arg.split('=')[1];
    } else if (arg === '--auto-version') {
      config.version = 'auto';
    } else if (arg.startsWith('--commits=')) {
      config.commitRange = arg.split('=')[1];
    }
  }

  if (config.help) {
    showHelp();
    process.exit(0);
  }

  // Validate environment
  if (!config.environment) {
    // Try to detect environment from current branch or URL
    try {
      const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
      if (currentBranch === 'main' && process.env.VERCEL_URL?.includes('production')) {
        config.environment = 'production';
      } else if (currentBranch === 'main') {
        config.environment = 'staging';
      } else {
        throw new Error('Cannot auto-detect environment');
      }
    } catch (error) {
      throw new Error('Environment not specified. Use --env=staging or --env=production');
    }
  }

  if (!['staging', 'production'].includes(config.environment)) {
    throw new Error('Environment must be either "staging" or "production"');
  }

  return config;
}

// Check if we're in a git repository
function isGitRepository() {
  try {
    execSync('git rev-parse --git-dir', { stdio: 'ignore' });
    return true;
  } catch (error) {
    return false;
  }
}

// Collect git data for deployment log
async function collectGitData(config) {
  try {
    // Determine commit range
    let commitRange = config.commitRange;
    if (!commitRange) {
      // Get commits since last tag or last 20 commits
      try {
        const lastTag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
        commitRange = `${lastTag}..HEAD`;
      } catch (error) {
        // No tags found, use last 20 commits
        commitRange = 'HEAD~20..HEAD';
      }
    }

    // Get commit data
    const commitFormat = '--pretty=format:{%n  "hash": "%H",%n  "short_hash": "%h",%n  "author": "%an",%n  "email": "%ae",%n  "date": "%ai",%n  "message": "%s",%n  "body": "%b"%n},';
    
    const gitOutput = execSync(`git log ${commitRange} ${commitFormat}`, { encoding: 'utf8' });
    
    // Parse commit data
    const commitsJson = '[' + gitOutput.slice(0, -1) + ']'; // Remove last comma and wrap in array
    const commits = JSON.parse(commitsJson);

    // Get current author info
    let author = null;
    try {
      author = execSync('git config user.name', { encoding: 'utf8' }).trim();
    } catch (error) {
      author = 'unknown';
    }

    return {
      commits,
      author,
      commitCount: commits.length,
      latestCommit: commits[0]?.hash || null
    };

  } catch (error) {
    console.error('Error collecting git data:', error.message);
    return {
      commits: [],
      author: 'unknown',
      commitCount: 0,
      latestCommit: null
    };
  }
}

// Generate version number automatically
async function generateVersion(environment, gitData) {
  const date = new Date();
  const dateString = date.toISOString().split('T')[0].replace(/-/g, '');
  const timeString = date.toTimeString().split(' ')[0].replace(/:/g, '');
  
  // Get current version from package.json if available
  let baseVersion = '2.3.0'; // Default version
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (packageJson.version) {
      baseVersion = packageJson.version;
    }
  } catch (error) {
    // Use default version
  }

  // Create version based on environment and git data
  if (environment === 'production') {
    return `v${baseVersion}`;
  } else {
    return `v${baseVersion}-staging-${dateString}-${timeString}`;
  }
}

// Create deployment log via API
async function createDeploymentLog(logData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(logData);
    
    const url = new URL(API_BASE_URL + CREATE_LOG_ENDPOINT);
    const options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'IBAM-Deployment-Logger/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (error) {
          reject(new Error('Invalid JSON response from API'));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Show help information
function showHelp() {
  console.log(`
🚀 IBAM Deployment Logging Script

USAGE:
  node scripts/log-deployment.js [OPTIONS]

OPTIONS:
  --env=ENVIRONMENT        Set deployment environment (staging|production)
  --version=VERSION        Set version number (default: auto-generated)
  --auto-version           Auto-generate version number (default)
  --commits=RANGE          Specify git commit range (default: since last tag)
  --help, -h               Show this help message

EXAMPLES:
  # Log production deployment with auto version
  node scripts/log-deployment.js --env=production

  # Log staging deployment with specific version
  node scripts/log-deployment.js --env=staging --version=v2.3.1-hotfix

  # Log with specific commit range
  node scripts/log-deployment.js --env=staging --commits=HEAD~10..HEAD

INTEGRATION:
  # Add to Vercel build script in package.json:
  "scripts": {
    "build": "next build && node scripts/log-deployment.js --env=staging",
    "deploy:prod": "vercel --prod && node scripts/log-deployment.js --env=production"
  }

  # Or use in GitHub Actions:
  - name: Log Deployment
    run: node scripts/log-deployment.js --env=production --version=GITHUB_REF_NAME

ENVIRONMENT VARIABLES:
  NODE_ENV                 Determines API base URL (production|development)
  VERCEL_URL               Used for environment auto-detection
`);
}

// Run the script
if (require.main === module) {
  main();
}