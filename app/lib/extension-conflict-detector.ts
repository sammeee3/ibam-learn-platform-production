// Browser Extension Conflict Detection and Mitigation
// Detects and handles conflicts with password manager extensions

export interface ExtensionConflict {
  detected: boolean;
  extensionId?: string;
  conflictType: 'auth_blocker' | 'frame_error' | 'variable_error' | 'unknown';
  mitigation: string;
}

// Known problematic extension patterns
const KNOWN_PROBLEMATIC_EXTENSIONS = [
  'pejdijmoenmkgeppbflobdenhhabjlaj', // The specific extension causing issues
  // Add more as discovered
];

export class ExtensionConflictDetector {
  private conflicts: ExtensionConflict[] = [];

  detectConflicts(): ExtensionConflict[] {
    this.conflicts = [];
    
    // Detect extension-related console errors
    this.detectConsoleErrors();
    
    // Detect frame manipulation
    this.detectFrameManipulation();
    
    // Detect authentication interference
    this.detectAuthInterference();
    
    return this.conflicts;
  }

  private detectConsoleErrors(): void {
    // Override console.error temporarily to catch extension errors
    const originalError = console.error;
    let extensionErrors = 0;
    
    console.error = (...args) => {
      const errorMessage = args.join(' ');
      
      // Check for extension-specific error patterns
      if (errorMessage.includes('Could not establish connection. Receiving end does not exist') ||
          errorMessage.includes('FrameDoesNotExistError') ||
          errorMessage.includes('background.js') ||
          errorMessage.includes('chrome-extension://')) {
        extensionErrors++;
        
        // Extract extension ID if possible
        const extensionIdMatch = errorMessage.match(/chrome-extension:\/\/([a-z]{32})/);
        const extensionId = extensionIdMatch ? extensionIdMatch[1] : undefined;
        
        if (extensionErrors > 5) { // Threshold for problematic extension
          this.conflicts.push({
            detected: true,
            extensionId,
            conflictType: 'frame_error',
            mitigation: 'Extension is interfering with page frames - recommend disabling'
          });
        }
      }
      
      originalError.apply(console, args);
    };
    
    // Restore original console.error after a short delay
    setTimeout(() => {
      console.error = originalError;
    }, 2000);
  }

  private detectFrameManipulation(): void {
    // Check if extensions are manipulating iframes or page structure
    const iframes = document.querySelectorAll('iframe');
    const suspiciousIframes = Array.from(iframes).filter(iframe => {
      const src = iframe.src || '';
      return src.includes('chrome-extension://') || 
             iframe.hasAttribute('data-extension') ||
             iframe.className.includes('extension');
    });

    if (suspiciousIframes.length > 0) {
      this.conflicts.push({
        detected: true,
        conflictType: 'frame_error',
        mitigation: 'Extension-created iframes detected - may interfere with auth'
      });
    }
  }

  private detectAuthInterference(): void {
    // Check for extension scripts that might interfere with auth
    const scripts = document.querySelectorAll('script');
    const extensionScripts = Array.from(scripts).filter(script => {
      const src = script.src || '';
      return src.includes('chrome-extension://') && 
             (src.includes('background.js') || 
              src.includes('content.js') || 
              src.includes('auth') || 
              src.includes('login'));
    });

    if (extensionScripts.length > 0) {
      this.conflicts.push({
        detected: true,
        conflictType: 'auth_blocker',
        mitigation: 'Extension scripts detected that may block authentication'
      });
    }
  }

  // Get user-friendly conflict report
  getConflictReport(): string {
    if (this.conflicts.length === 0) {
      return 'No extension conflicts detected.';
    }

    const report = this.conflicts.map(conflict => {
      let message = `⚠️ Extension Conflict Detected: ${conflict.conflictType}`;
      if (conflict.extensionId) {
        message += ` (ID: ${conflict.extensionId})`;
      }
      message += `\n   Solution: ${conflict.mitigation}`;
      return message;
    }).join('\n\n');

    return report;
  }

  // Check if specific extension is problematic
  isProblematicExtension(extensionId?: string): boolean {
    if (!extensionId) return false;
    return KNOWN_PROBLEMATIC_EXTENSIONS.includes(extensionId);
  }

  // Suggest mitigation steps
  getMitigationSteps(): string[] {
    const steps = [
      '1. Try signing in using an incognito/private browsing window',
      '2. Temporarily disable browser extensions (especially password managers)',
      '3. Clear browser cache and cookies for this site',
      '4. Try a different browser (Chrome, Firefox, Safari, Edge)',
      '5. Check for browser extension updates'
    ];

    // Add specific steps for known extensions
    if (this.conflicts.some(c => c.extensionId === 'pejdijmoenmkgeppbflobdenhhabjlaj')) {
      steps.unshift('0. Disable the problematic extension (ID: pejdijmoenmkgeppbflobdenhhabjlaj)');
    }

    return steps;
  }
}

// Utility function to create user-friendly error message
export function createExtensionConflictMessage(conflicts: ExtensionConflict[]): string {
  if (conflicts.length === 0) return '';

  return `
🚨 Browser Extension Conflict Detected

It looks like a browser extension is interfering with the sign-in process. This is a common issue with password managers or security extensions.

Quick Fix:
• Try signing in using an incognito/private browsing window
• Or temporarily disable browser extensions and try again

Technical Details:
${conflicts.map(c => `• ${c.conflictType}: ${c.mitigation}`).join('\n')}

If the problem persists, please contact support.
  `.trim();
}

// Auto-detect and report conflicts on page load
export function autoDetectExtensionConflicts(): ExtensionConflict[] {
  const detector = new ExtensionConflictDetector();
  return detector.detectConflicts();
}