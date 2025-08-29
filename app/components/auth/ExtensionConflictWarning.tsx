'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, HelpCircle, RefreshCw } from 'lucide-react';
import { ExtensionConflictDetector, createExtensionConflictMessage, type ExtensionConflict } from '../../lib/extension-conflict-detector';

interface ExtensionConflictWarningProps {
  onDismiss?: () => void;
  showOnAuthError?: boolean;
}

const ExtensionConflictWarning: React.FC<ExtensionConflictWarningProps> = ({
  onDismiss,
  showOnAuthError = false
}) => {
  const [conflicts, setConflicts] = useState<ExtensionConflict[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Auto-detect conflicts on component mount
    const detector = new ExtensionConflictDetector();
    
    // Delay detection to allow page to fully load
    const detectTimer = setTimeout(() => {
      const detectedConflicts = detector.detectConflicts();
      setConflicts(detectedConflicts);
      
      // Show warning if conflicts detected or if auth error occurred
      if (detectedConflicts.length > 0 || showOnAuthError) {
        setShowWarning(true);
      }
    }, 1000);

    return () => clearTimeout(detectTimer);
  }, [showOnAuthError]);

  const handleDismiss = () => {
    setDismissed(true);
    setShowWarning(false);
    onDismiss?.();
  };

  const handleRetryInIncognito = () => {
    // Open current URL in new window (user can manually open incognito)
    const currentUrl = window.location.href;
    alert('Please copy this URL and open it in an incognito/private browsing window:\n\n' + currentUrl);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  if (dismissed || (!showWarning && conflicts.length === 0)) {
    return null;
  }

  const detector = new ExtensionConflictDetector();
  const mitigationSteps = detector.getMitigationSteps();

  return (
    <AnimatePresence>
      {showWarning && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95 }}
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
        >
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg shadow-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2 flex-shrink-0" />
                <h3 className="font-bold text-yellow-800">Sign-In Issue Detected</h3>
              </div>
              <button
                onClick={handleDismiss}
                className="text-yellow-600 hover:text-yellow-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-yellow-700 mb-4 text-sm">
              A browser extension appears to be interfering with the sign-in process. This is common with password managers.
            </p>

            <div className="flex flex-col gap-2 mb-4">
              <button
                onClick={handleRetryInIncognito}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                🔒 Try Incognito Mode (Recommended)
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={handleRefresh}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Refresh Page
                </button>
                
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t border-yellow-300 pt-3 mt-3"
                >
                  <h4 className="font-semibold text-yellow-800 mb-2 text-sm">
                    Troubleshooting Steps:
                  </h4>
                  <ol className="text-xs text-yellow-700 space-y-1 pl-4">
                    {mitigationSteps.map((step, index) => (
                      <li key={index} className="list-decimal">
                        {step.replace(/^\d+\.\s*/, '')}
                      </li>
                    ))}
                  </ol>
                  
                  {conflicts.length > 0 && (
                    <div className="mt-3 p-2 bg-yellow-100 rounded text-xs">
                      <strong>Technical Details:</strong>
                      <pre className="whitespace-pre-wrap mt-1 text-yellow-800">
                        {conflicts.map(c => `${c.conflictType}: ${c.mitigation}`).join('\n')}
                      </pre>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-xs text-yellow-600 mt-3 pt-3 border-t border-yellow-300">
              💡 <strong>Quick Fix:</strong> Most sign-in issues are resolved by using incognito mode or temporarily disabling browser extensions.
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExtensionConflictWarning;