'use client';

import { useState, useEffect } from 'react';
import { 
  isFeatureEnabled, 
  getGraceFeatures,
  shouldShowGraceFeatures 
} from '../../lib/features/grace-features-config';

interface EnhancedSessionTemplateProps {
  children: React.ReactNode;
  userEmail?: string;
  moduleId: number;
  sessionId: number;
}

// Wrapper component that conditionally adds grace features
export default function EnhancedSessionTemplate({ 
  children, 
  userEmail,
  moduleId,
  sessionId 
}: EnhancedSessionTemplateProps) {
  const [graceEnabled, setGraceEnabled] = useState(false);
  const [features, setFeatures] = useState(getGraceFeatures());

  useEffect(() => {
    // Check if this user should see grace features
    const shouldShow = shouldShowGraceFeatures(userEmail);
    setGraceEnabled(shouldShow);
    
    // Log for monitoring (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Grace Features Status:', {
        user: userEmail,
        enabled: shouldShow,
        features: features
      });
    }
  }, [userEmail]);

  // Render children with grace context
  return (
    <GraceContext.Provider value={{ graceEnabled, features }}>
      <div className="enhanced-session-wrapper">
        {/* Optional: Grace indicator for testing */}
        {graceEnabled && process.env.NODE_ENV !== 'production' && (
          <div className="fixed bottom-4 left-4 px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full z-50">
            Grace Features Active
          </div>
        )}
        {children}
      </div>
    </GraceContext.Provider>
  );
}

// Context for grace features
import { createContext, useContext } from 'react';

interface GraceContextType {
  graceEnabled: boolean;
  features: any;
}

const GraceContext = createContext<GraceContextType>({
  graceEnabled: false,
  features: {}
});

export const useGraceFeatures = () => useContext(GraceContext);

// Hook for individual components to check features
export function useGraceFeature(feature: string, userEmail?: string): boolean {
  const { graceEnabled, features } = useGraceFeatures();
  
  if (!graceEnabled) return false;
  
  return isFeatureEnabled(feature as any, userEmail);
}

// Example component showing conditional rendering
export function LookingBackSection({ previousActions }: any) {
  const showEncouragement = useGraceFeature('showEncouragementMessages');
  const showKingdomPurpose = useGraceFeature('enableKingdomPurpose');
  const enableGraceRelease = useGraceFeature('enableGraceRelease');

  return (
    <div>
      <h2>Looking Back</h2>
      
      {/* Grace Enhancement: Only shows if feature is enabled */}
      {showEncouragement && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
          <p className="text-green-700">
            ✨ Remember: Every attempt is growth. Progress over perfection!
          </p>
        </div>
      )}

      {/* Existing functionality remains unchanged */}
      {previousActions.map((action: any) => (
        <div key={action.id} className="border rounded-lg p-4 mb-4">
          <p>{action.description}</p>
          
          {/* Grace Enhancement: Kingdom Purpose (only if enabled) */}
          {showKingdomPurpose && action.kingdomPurpose && (
            <div className="mt-2 p-2 bg-purple-50 rounded">
              <p className="text-sm text-purple-600">
                Kingdom Purpose: {action.kingdomPurpose}
              </p>
            </div>
          )}

          {/* Grace Release after 2 deferrals (only if enabled) */}
          {enableGraceRelease && action.deferrals >= 2 ? (
            <div className="mt-4 p-4 bg-purple-50 rounded">
              <p className="text-purple-700">
                This has been deferred twice. Release with grace?
              </p>
              <button className="mt-2 px-4 py-2 bg-purple-600 text-white rounded">
                Release with Grace
              </button>
            </div>
          ) : (
            // Standard buttons always show
            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-green-600 text-white rounded">
                Complete
              </button>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded">
                Learning
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Defer
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}