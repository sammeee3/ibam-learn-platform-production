import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

// Patterns that indicate exposed secrets - ENHANCED
const SECRET_PATTERNS = [
  { pattern: /eyJ[A-Za-z0-9+/=]{50,}/g, type: 'JWT/Supabase Key', severity: 'CRITICAL' },
  { pattern: /sb_secret_[A-Za-z0-9_]{20,}/g, type: 'Supabase Service Role Key', severity: 'CRITICAL' },
  { pattern: /sk_live_[A-Za-z0-9]{24,}/g, type: 'Stripe Live Key', severity: 'CRITICAL' },
  { pattern: /sk_test_[A-Za-z0-9]{24,}/g, type: 'Stripe Test Key', severity: 'HIGH' },
  { pattern: /service_role.*['"]\s*[:=]\s*['"][^'"]{20,}/gi, type: 'Service Role Key', severity: 'CRITICAL' },
  { pattern: /SUPABASE_.*KEY.*['"]\s*[:=]\s*['"][^'"]{20,}/gi, type: 'Supabase Key', severity: 'CRITICAL' },
  { pattern: /postgresql:\/\/[^@]+@[^/]+/g, type: 'Database URL', severity: 'CRITICAL' },
  { pattern: /Bearer\s+[A-Za-z0-9+/=]{20,}/g, type: 'Bearer Token', severity: 'HIGH' },
  { pattern: /IBAM_SYSTEME_SECRET.*['"]\s*[:=]\s*['"][^'"]{10,}/gi, type: 'Webhook Secret', severity: 'HIGH' },
  { pattern: /RESEND_API_KEY.*['"]\s*[:=]\s*['"][^'"]{10,}/gi, type: 'Email API Key', severity: 'MEDIUM' }
];

// Files to exclude from scanning
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  '.git',
  '*.md',
  '.env.example',
  'package-lock.json'
];

export async function GET() {
  console.log('🔍 Starting repository security scan...');
  
  const threats: any[] = [];
  const scannedFiles: string[] = [];
  let totalExposures = 0;

  try {
    // Get list of all JavaScript, TypeScript, and environment files
    const { stdout: fileList } = await execAsync(
      `find . -type f \\( -name "*.js" -o -name "*.ts" -o -name "*.tsx" -o -name "*.jsx" -o -name ".env*" \\) \
       -not -path "./node_modules/*" -not -path "./.next/*" -not -path "./.git/*" -not -name ".env.example"`
    );
    
    const files = fileList.split('\n').filter(f => f.length > 0);
    
    // Scan each file for exposed secrets
    for (const file of files) {
      try {
        const content = await fs.readFile(file, 'utf-8');
        scannedFiles.push(file);
        
        for (const { pattern, type, severity } of SECRET_PATTERNS) {
          const matches = content.match(pattern);
          if (matches) {
            totalExposures += matches.length;
            
            // Don't expose the actual secret in logs
            const sanitized = matches.map(m => 
              m.substring(0, 10) + '...' + m.substring(m.length - 4)
            );
            
            threats.push({
              severity: severity,
              type: `Exposed ${type}`,
              file: file,
              count: matches.length,
              preview: sanitized[0], // Show first match only
              action: file.includes('.env') 
                ? 'URGENT: Remove .env file from repository and regenerate all keys'
                : 'Remove hardcoded secret and use environment variables'
            });
          }
        }
      } catch (err) {
        // Skip files that can't be read
        continue;
      }
    }

    // Check if .env files are in .gitignore
    try {
      const gitignore = await fs.readFile('.gitignore', 'utf-8');
      if (!gitignore.includes('.env')) {
        threats.push({
          severity: 'HIGH',
          type: 'Missing .env in .gitignore',
          file: '.gitignore',
          action: 'Add .env files to .gitignore immediately'
        });
      }
    } catch (err) {
      threats.push({
        severity: 'MEDIUM',
        type: 'No .gitignore file',
        file: 'root',
        action: 'Create .gitignore file with proper exclusions'
      });
    }

    // Check for committed .env files
    try {
      const { stdout: envFiles } = await execAsync('git ls-files | grep -E "^\\.env"');
      if (envFiles) {
        threats.push({
          severity: 'CRITICAL',
          type: 'Committed .env files',
          files: envFiles.split('\n'),
          action: 'Remove .env files from git history immediately'
        });
      }
    } catch (err) {
      // No .env files in git (good!)
    }

    // Check git history for exposed secrets (last 50 commits)
    try {
      const { stdout: gitLog } = await execAsync(
        'git log --oneline -50 --grep="key" --grep="secret" --grep="token" -i'
      );
      
      const suspiciousCommits = gitLog.split('\n').filter(l => l.length > 0);
      if (suspiciousCommits.length > 0) {
        threats.push({
          severity: 'HIGH',
          type: 'Suspicious commits in history',
          count: suspiciousCommits.length,
          recent: suspiciousCommits.slice(0, 5),
          action: 'Review commit history for exposed secrets'
        });
      }
    } catch (err) {
      // No suspicious commits found
    }

    // Generate security report
    const report = {
      timestamp: new Date().toISOString(),
      status: threats.length === 0 ? 'SECURE' : 'VULNERABLE',
      riskLevel: threats.some(t => t.severity === 'CRITICAL') ? 'CRITICAL' :
                 threats.some(t => t.severity === 'HIGH') ? 'HIGH' :
                 threats.some(t => t.severity === 'MEDIUM') ? 'MEDIUM' : 'LOW',
      filesScanned: scannedFiles.length,
      totalExposures,
      threats,
      recommendations: generateRecommendations(threats)
    };

    // Send alert if critical issues found
    if (report.riskLevel === 'CRITICAL') {
      console.error('🚨 CRITICAL SECURITY VULNERABILITIES DETECTED!');
      console.error(`Found ${totalExposures} exposed secrets in repository`);
      
      // Here you could send an email/SMS alert
      // await sendSecurityAlert(report);
    }

    return NextResponse.json(report);
    
  } catch (error) {
    console.error('Repository scan error:', error);
    return NextResponse.json({
      error: 'Failed to scan repository',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function generateRecommendations(threats: any[]) {
  const recommendations: Array<{
    priority: string;
    action: string;
    steps: string[];
  }> = [];
  
  if (threats.some(t => t.type.includes('Exposed'))) {
    recommendations.push({
      priority: 'IMMEDIATE',
      action: 'Rotate all exposed API keys',
      steps: [
        'Regenerate keys in Supabase dashboard',
        'Update environment variables in Vercel',
        'Remove hardcoded keys from source code',
        'Clean git history of exposed secrets'
      ]
    });
  }
  
  if (threats.some(t => t.type.includes('.env'))) {
    recommendations.push({
      priority: 'HIGH',
      action: 'Secure environment files',
      steps: [
        'Add .env to .gitignore',
        'Remove .env from git history',
        'Use environment variables exclusively'
      ]
    });
  }
  
  recommendations.push({
    priority: 'ONGOING',
    action: 'Implement pre-commit hooks',
    steps: [
      'Install husky for git hooks',
      'Add secret scanning to pre-commit',
      'Block commits with exposed secrets'
    ]
  });
  
  return recommendations;
}