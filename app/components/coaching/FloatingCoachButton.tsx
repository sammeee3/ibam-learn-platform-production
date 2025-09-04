'use client';

import { useState, useEffect } from 'react';
import AIChatInterface from './AIChatInterface';

interface FloatingCoachButtonProps {
  moduleId?: number;
  sessionId?: number;
  sessionTitle?: string;
  currentSection?: string;
}

const FloatingCoachButton: React.FC<FloatingCoachButtonProps> = ({ 
  moduleId, 
  sessionId, 
  sessionTitle = "Current Session",
  currentSection = "session" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Hide button when mobile keyboard is open (viewport height shrinks significantly)
  useEffect(() => {
    let initialHeight = window.innerHeight;
    
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialHeight - currentHeight;
      
      // If height decreased by more than 150px, likely keyboard is open
      if (isMobile && heightDifference > 150) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  // Get module color theme
  const getModuleTheme = (moduleId: number) => {
    const themes = {
      1: { gradient: 'from-blue-500 to-blue-600', shadow: 'shadow-blue-500/20' },
      2: { gradient: 'from-green-500 to-green-600', shadow: 'shadow-green-500/20' },
      3: { gradient: 'from-purple-500 to-purple-600', shadow: 'shadow-purple-500/20' },
      4: { gradient: 'from-orange-500 to-orange-600', shadow: 'shadow-orange-500/20' },
      5: { gradient: 'from-teal-500 to-teal-600', shadow: 'shadow-teal-500/20' },
    };
    return themes[moduleId as keyof typeof themes] || themes[1];
  };

  const theme = getModuleTheme(moduleId || 1);
  const coachTitle = `Module ${moduleId || ''} Coach`;

  return (
    <>
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes gentlePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          50% { transform: scale(1.02); box-shadow: 0 0 0 8px rgba(59, 130, 246, 0); }
        }
        @keyframes slideUpMobile {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      {/* Enlarged Centered Button */}
      {isVisible && (
        <button
          onClick={() => setIsOpen(true)}
          className={`
            fixed bottom-[120px] left-1/2 transform -translate-x-1/2 z-[9998]
            bg-gradient-to-r ${theme.gradient}
            text-white px-8 py-6 rounded-full
            shadow-xl ${theme.shadow}
            hover:scale-105 active:scale-95
            transition-all duration-200 ease-in-out
            text-2xl font-bold
            flex items-center gap-4
            min-w-[200px]
          `}
          style={{
            animation: 'gentlePulse 3s infinite ease-in-out',
          }}
          title={`Get help with ${sessionTitle}`}
        >
          <span className="text-3xl">🎯</span>
          <span>Coach</span>
        </button>
      )}

      {/* Chat Interface Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setIsOpen(false)}
        >
          {/* Mobile: Slide up from bottom */}
          {isMobile ? (
            <div 
              className="w-full max-h-[80vh] bg-white rounded-t-xl shadow-2xl"
              style={{ animation: 'slideUpMobile 0.3s ease-out' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Mobile Header */}
              <div className={`bg-gradient-to-r ${theme.gradient} text-white p-4 rounded-t-xl`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">🎯 {coachTitle}</h3>
                    <p className="text-sm text-white/80">{sessionTitle}</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white text-2xl font-light"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              {/* Mobile Chat Content */}
              <div className="overflow-hidden">
                <AIChatInterface 
                  moduleId={moduleId}
                  sessionId={sessionId}
                  sessionTitle={sessionTitle}
                  currentSection={currentSection}
                  isMobile={true}
                />
              </div>
            </div>
          ) : (
            /* Desktop: Centered modal */
            <div 
              className="w-full max-w-2xl mx-4 bg-white rounded-xl shadow-2xl max-h-[80vh] overflow-hidden"
              style={{ animation: 'fadeIn 0.3s ease-out' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Desktop Header */}
              <div className={`bg-gradient-to-r ${theme.gradient} text-white p-6`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-xl">🎯 {coachTitle}</h3>
                    <p className="text-white/80">{sessionTitle}</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white text-3xl font-light transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
              
              {/* Desktop Chat Content */}
              <div className="overflow-hidden">
                <AIChatInterface 
                  moduleId={moduleId}
                  sessionId={sessionId}
                  sessionTitle={sessionTitle}
                  currentSection={currentSection}
                  isMobile={false}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default FloatingCoachButton;