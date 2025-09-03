'use client';

import React, { useState, useEffect } from 'react';
import { Target, Heart, CheckCircle, Loader2, Star, MessageCircle } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { SessionData, PathwayMode } from '../../../lib/types';
import { sessionPrayers } from '../../../lib/constants';
import ActionAccountabilityReview from './ActionAccountabilityReview';

interface EnhancedLookingBackProps {
  sessionData: SessionData;
  pathwayMode: PathwayMode;
  onComplete: () => void;
  onSubsectionComplete?: (subsection: string) => void;
  isCompleted?: boolean; // 🔧 NEW: Pass database completion state
}

const EnhancedLookingBack: React.FC<EnhancedLookingBackProps> = ({ 
  sessionData, 
  pathwayMode, 
  onComplete,
  onSubsectionComplete,
  isCompleted = false // 🔧 NEW: Default to false if not provided
}) => {
  console.log('🏗️ EnhancedLookingBack component rendering with isCompleted:', isCompleted);
  const supabase = createClientComponentClient();
  
  // State for 3-part structure
  const [prayerCompleted, setPrayerCompleted] = useState(false);
  const [checkInResponses, setCheckInResponses] = useState({
    feeling: '',
    stress: '',
    happiness: ''
  });
  const [showActionAccountability, setShowActionAccountability] = useState(false);
  const [showVisionReminder, setShowVisionReminder] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationItems, setValidationItems] = useState<string[]>([]);

  // Session-specific prayer
  const prayerKey = `${sessionData.module_id}_${sessionData.session_number}`;
  const currentPrayer = sessionPrayers[prayerKey]?.[pathwayMode] || sessionPrayers["1_1"][pathwayMode];
  

  // Load prayer status - PRIORITIZE DATABASE STATE over sessionStorage  
  useEffect(() => {
    console.log('🔄 EnhancedLookingBack: Loading completion state:', { 
      isCompleted, 
      moduleId: sessionData.module_id, 
      sessionNumber: sessionData.session_number 
    });
    
    if (isCompleted) {
      // 🔧 FIX: If database shows section is completed, restore ALL states
      console.log('✅ DATABASE RESTORATION: Looking Back completed - forcing state restore');
      setPrayerCompleted(true);
      setShowActionAccountability(true);
      
      // 🚨 FORCE UPDATE: Also save to sessionStorage to prevent conflicts
      const sessionKey = `prayer_${sessionData.module_id}_${sessionData.session_number}`;
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(sessionKey, 'true');
        console.log('💾 Force-saved prayer completion to sessionStorage for consistency');
      }
    } else {
      // Reset states when not completed
      console.log('🔄 Database shows not completed - checking sessionStorage fallback');
      const sessionKey = `prayer_${sessionData.module_id}_${sessionData.session_number}`;
      const saved = typeof window !== 'undefined' && window.sessionStorage?.getItem(sessionKey) === 'true';
      if (saved) {
        console.log('📱 SessionStorage shows prayer completed');
        setPrayerCompleted(true);
        setShowActionAccountability(true);
      } else {
        console.log('🚫 No completion found in database or sessionStorage - resetting states');
        setPrayerCompleted(false);
        setShowActionAccountability(false);
      }
    }
  }, [sessionData.module_id, sessionData.session_number, isCompleted]);

  const handlePrayerComplete = (checked: boolean) => {
    try {
      console.log('🙏 Prayer checkbox clicked:', checked);
      setPrayerCompleted(checked);
      
      const sessionKey = `prayer_${sessionData.module_id}_${sessionData.session_number}`;
      console.log('💾 Session key:', sessionKey);
      
      if (checked) {
        // Save to session storage
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.setItem(sessionKey, 'true');
          console.log('✅ Saved prayer completion to sessionStorage');
        }
        // Show action accountability section after prayer
        setShowActionAccountability(true);
        console.log('✅ Action accountability enabled');
        
        // 🚨 FIXED: Only trigger subsection completion, NOT full section completion
        if (onSubsectionComplete) {
          console.log('🎯 Triggering prayer subsection completion');
          onSubsectionComplete('prayer');
        }
        
        // 🚨 REMOVED: Do NOT trigger onComplete() here! 
        // Looking Back can only be completed after ALL actions are addressed
        console.log('✅ Prayer completed, action accountability enabled - but section NOT yet complete');
        
      } else {
        // Hide action accountability if prayer unchecked
        setShowActionAccountability(false);
        if (typeof window !== 'undefined' && window.sessionStorage) {
          window.sessionStorage.removeItem(sessionKey);
        }
        console.log('❌ Action accountability disabled');
      }
    } catch (error) {
      console.error('💥 Error in handlePrayerComplete:', error);
      // Still try to update the prayer state even if other operations fail
      setPrayerCompleted(checked);
    }
  };

  const isFirstSession = sessionData.module_id === 1 && sessionData.session_number === 1;

  // Smart completion validation
  const validateCompletion = () => {
    const missing: string[] = [];
    
    // Required: Prayer
    if (!prayerCompleted) {
      missing.push("Complete opening prayer");
    }
    
    // Required: Action accountability (if previous actions exist and not first session)
    if (!isFirstSession && showActionAccountability) {
      // Check if there are previous actions that haven't been reviewed
      // This would need to integrate with ActionAccountabilityReview component
      // For now, we'll assume if showActionAccountability is true, they need to review
    }
    
    return missing;
  };

  // Enhanced button click handler with validation
  const handleReadyForLookingForward = () => {
    console.log('🚀 Ready for Looking Forward clicked!');
    
    const missingItems = validateCompletion();
    
    if (missingItems.length > 0) {
      // Show beautiful validation modal
      setValidationItems(missingItems);
      setShowValidationModal(true);
      return;
    }
    
    setButtonClicked(true);
    
    // Mark Looking Back as complete
    onComplete();
    
    // Scroll to Looking UP section and auto-expand it
    setTimeout(() => {
      console.log('🔍 Looking for Looking UP section...');
      
      // Try multiple selectors to find the Looking UP section
      const lookingUpSection = document.querySelector('.bg-green-500') || 
                              document.querySelector('[class*="bg-green"]') ||
                              document.querySelector('div[class*="green"]:contains("LOOKING UP")') ||
                              document.querySelector('h3:contains("LOOKING UP")');
                              
      console.log('🎯 Found Looking UP section:', lookingUpSection);
      
      if (lookingUpSection) {
        lookingUpSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        console.log('📜 Scrolled to Looking UP section');
        
        // Trigger click to expand Looking Up
        setTimeout(() => {
          console.log('🖱️ Clicking Looking UP section to expand...');
          (lookingUpSection as HTMLElement).click();
        }, 1000); // Increased timeout for better reliability
      } else {
        console.warn('⚠️ Looking UP section not found, trying parent container approach');
        // Fallback: try to find and expand by calling parent component
        window.dispatchEvent(new CustomEvent('expandLookingUp'));
      }
    }, 700);
  };

  // Special first session experience
  if (isFirstSession) {
    return (
      <div className="space-y-6">
        {/* Part 1: Welcome Prayer */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
          <h4 className="font-bold text-blue-800 mb-3 flex items-center">
            🙏 Welcome Prayer
          </h4>
          <div className="bg-white p-4 rounded-lg mb-4">
            <p className="text-gray-700 italic leading-relaxed">
              {currentPrayer}
            </p>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="first-prayer-check"
              checked={prayerCompleted}
              onChange={(e) => handlePrayerComplete(e.target.checked)}
              className="mr-3 w-4 h-4"
            />
            <label htmlFor="first-prayer-check" className="text-gray-700">
              I have prayed this prayer
            </label>
          </div>
        </div>

        {/* Part 2: First Session Encouragement */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-6 rounded-lg">
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h4 className="text-xl font-bold mb-3">
              Congratulations on Starting Your Faith-Driven Business Journey!
            </h4>
            <p className="mb-4">
              You've taken a significant step by committing to integrate your faith with your business. 
              This journey will transform not just your business, but your entire approach to God's calling on your life.
            </p>
            <div className="bg-white/20 rounded-lg p-4 mt-4">
              <h5 className="font-bold mb-2">How Looking Forward & Looking Back Work Together:</h5>
              <div className="text-sm space-y-2 text-left">
                <p>• <strong>Looking Forward:</strong> At the end of each session, you'll create specific action commitments</p>
                <p>• <strong>Looking Back:</strong> At the start of the next session, we'll review those commitments together</p>
                <p>• This accountability system will help you actually implement what you learn</p>
                <p>• Remember: Progress, not perfection, is the goal!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Part 3: Vision Reminder */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg">
          <h4 className="text-lg font-bold mb-3 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            ✨ Why This Matters
          </h4>
          <p className="text-lg font-medium">
            "Multiplying disciples through business" - This is not just a course, it's a calling. 
            Your business has the potential to be a platform for Kingdom impact that reaches far beyond profit.
          </p>
        </div>

        {/* Enhanced Complete Button */}
        <div className="text-center">
          <button 
            onClick={buttonClicked ? undefined : handleReadyForLookingForward}
            disabled={!prayerCompleted || buttonClicked}
            className={`px-8 py-3 rounded-lg font-semibold transition-all transform ${
              buttonClicked
                ? 'bg-purple-600 text-white scale-105 cursor-default'
                : prayerCompleted 
                  ? 'bg-orange-600 text-white hover:bg-orange-700 hover:scale-105' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {buttonClicked ? '🎉 Looking Up Opened!' : '🚀 Ready for Looking Up!'}
          </button>
          {buttonClicked && (
            <p className="text-sm text-purple-600 mt-2 font-medium">
              Scroll down for Scripture + Business Learning! ⬇️
            </p>
          )}
        </div>
      </div>
    );
  }

  // Regular session experience (3-part structure)
  return (
    <div className="space-y-6">
      {/* Part 1: Session Prayer */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
        <h4 className="font-bold text-blue-800 mb-3 flex items-center">
          🙏 Opening Prayer (v2.1)
        </h4>
        <div className="bg-white p-4 rounded-lg mb-4">
          <p className="text-gray-700 italic leading-relaxed">
            {currentPrayer}
          </p>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="session-prayer-check"
            checked={prayerCompleted}
            onChange={(e) => handlePrayerComplete(e.target.checked)}
            className="mr-3 w-4 h-4"
          />
          <label htmlFor="session-prayer-check" className="text-gray-700">
            I have prayed this prayer
          </label>
        </div>
      </div>

      {/* Part 2: Personal Check-In (only after prayer) */}
      {prayerCompleted && (
        <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
          <h4 className="font-bold text-green-800 mb-4 flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            💭 Quick Check-In 
            <span className="text-xs bg-green-200 text-green-700 px-2 py-1 rounded-full ml-2 font-normal">
              Optional
            </span>
          </h4>
          {pathwayMode === 'individual' ? (
            <p className="text-gray-700 mb-4">
              <strong>Individual Study:</strong> Take a moment to reflect on these questions. You can answer them here or just think through them - whatever helps you process:
            </p>
          ) : (
            <p className="text-gray-700 mb-4">
              <strong>Group Study:</strong> This is a great time for your group to check in with each other. Take time to ask these questions and pray for one another before moving on:
            </p>
          )}
          <div className="space-y-4">
            <div>
              <label className="block font-medium text-green-700 mb-2">
                How are you feeling since our last session?
              </label>
              <textarea
                value={checkInResponses.feeling}
                onChange={(e) => setCheckInResponses(prev => ({ ...prev, feeling: e.target.value }))}
                placeholder="Share how you're doing emotionally, spiritually, business-wise..."
                className="w-full p-3 border border-green-300 rounded-lg bg-white text-gray-800"
                rows={2}
              />
            </div>
            <div>
              <label className="block font-medium text-green-700 mb-2">
                What has been stressful in your life lately?
              </label>
              <textarea
                value={checkInResponses.stress}
                onChange={(e) => setCheckInResponses(prev => ({ ...prev, stress: e.target.value }))}
                placeholder="Any challenges, pressures, or concerns you're facing..."
                className="w-full p-3 border border-green-300 rounded-lg bg-white text-gray-800"
                rows={2}
              />
            </div>
            <div>
              <label className="block font-medium text-green-700 mb-2">
                What are you genuinely happy about right now?
              </label>
              <textarea
                value={checkInResponses.happiness}
                onChange={(e) => setCheckInResponses(prev => ({ ...prev, happiness: e.target.value }))}
                placeholder="Celebrate your wins, breakthroughs, blessings..."
                className="w-full p-3 border border-green-300 rounded-lg bg-white text-gray-800"
                rows={2}
              />
            </div>
          </div>
        </div>
      )}

      {/* Part 3: Action Accountability (only after prayer completed) */}
      {showActionAccountability && (
        <div className="bg-white rounded-lg border-l-4 border-orange-400">
          <ActionAccountabilityReview 
            sessionData={sessionData}
            pathwayMode={pathwayMode}
            onComplete={() => {
              // Mark accountability subsection as complete
              if (onSubsectionComplete) {
                console.log('🎯 Triggering accountability subsection completion');
                onSubsectionComplete('accountability');
              }
              // Show vision reminder after accountability
              setShowVisionReminder(true);
            }}
          />
        </div>
      )}

      {/* Part 4: Vision Reminder */}
      {showActionAccountability && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-lg shadow-lg">
          <h4 className="text-lg font-bold mb-3 flex items-center">
            <Star className="w-5 h-5 mr-2" />
            🌟 Remember Your Why
          </h4>
          <div className="bg-white/20 rounded-lg p-4">
            <p className="text-lg font-medium mb-2">
              "Multiplying disciples through business"
            </p>
            <p className="text-sm opacity-90">
              Every action you take, every challenge you face, every success you celebrate - 
              it all serves this greater purpose. Your business is a platform for Kingdom impact 
              that will reach far beyond what you can imagine.
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Complete Button */}
      <div className="text-center">
        <button 
          onClick={buttonClicked ? undefined : handleReadyForLookingForward}
          disabled={!prayerCompleted || buttonClicked}
          className={`px-8 py-3 rounded-lg font-semibold transition-all transform ${
            buttonClicked
              ? 'bg-purple-600 text-white scale-105 cursor-default'
              : prayerCompleted 
                ? 'bg-orange-600 text-white hover:bg-orange-700 hover:scale-105' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {buttonClicked ? '🎉 Looking Up Opened!' : '🚀 Ready for Looking Up!'}
        </button>
        {buttonClicked && (
          <p className="text-sm text-purple-600 mt-2 font-medium">
            Scroll down for Scripture + Business Learning! ⬇️
          </p>
        )}
      </div>

      {/* Beautiful Validation Modal */}
      {showValidationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Complete Looking Back Section
              </h3>
              <p className="text-gray-600">
                You still need to complete a few required items:
              </p>
            </div>
            
            <div className="space-y-3 mb-6">
              {validationItems.map((item, index) => (
                <div key={index} className="flex items-center text-red-600">
                  <span className="text-red-500 mr-2">❌</span>
                  <span>{item}</span>
                </div>
              ))}
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center text-blue-600 mb-2">
                  <span className="text-blue-400 mr-2">💭</span>
                  <span className="font-medium">Optional (encouraged):</span>
                </div>
                <p className="text-sm text-blue-700 ml-6">
                  Personal check-in questions (you can skip these)
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowValidationModal(false);
                  // Focus on the missing items
                }}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Complete Missing Items
              </button>
              <button
                onClick={() => {
                  setShowValidationModal(false);
                  // Continue anyway - they chose to skip
                  setButtonClicked(true);
                  onComplete();
                  setTimeout(() => {
                    const lookingForwardSection = document.querySelector('[style*="bg-orange"], .bg-orange-500');
                    if (lookingForwardSection) {
                      lookingForwardSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      setTimeout(() => {
                        (lookingForwardSection as HTMLElement).click();
                      }, 800);
                    }
                  }, 500);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition-colors font-medium"
              >
                Skip for Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedLookingBack;