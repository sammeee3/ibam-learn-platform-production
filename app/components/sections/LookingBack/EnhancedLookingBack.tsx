'use client';

import React, { useState, useEffect } from 'react';
import { Target, Lightbulb, CheckCircle, Loader2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { SessionData, PathwayMode, ActionStep } from '../../../lib/types';
import { pathwayPrayers, biblicalMotivationalMessages } from '../../../lib/constants';
import ActionAccountabilityReview from './ActionAccountabilityReview';

interface EnhancedLookingBackProps {
  sessionData: SessionData;
  pathwayMode: PathwayMode;
  onComplete: () => void;
}

const EnhancedLookingBack: React.FC<EnhancedLookingBackProps> = ({ 
  sessionData, 
  pathwayMode, 
  onComplete 
}) => {
  // In-memory prayer tracking (works in all environments)
  const sessionKey = `prayer_${sessionData.module_id}_${sessionData.session_number}`;
  const [prayerCompleted, setPrayerCompleted] = useState(() => {
    return (typeof window !== 'undefined' && window.sessionStorage?.getItem(sessionKey) === 'true') || false;
  });

  // Save prayer status when completed
  const handlePrayerChange = (checked: boolean) => {
    console.log('🔧 PRAYER CHANGE:', { checked, sessionKey });
    setPrayerCompleted(checked);
    if (checked && window.sessionStorage) {
      window.sessionStorage.setItem(sessionKey, 'true');
      console.log('💾 SAVED TO STORAGE:', sessionKey);
    }
    console.log('✅ PRAYER STATUS UPDATED:', checked);
  };

  console.log('🙏 PRAYER DEBUG:', {
    sessionKey: sessionKey,
    prayerCompleted: prayerCompleted
  });

  const isFirstSession = sessionData.content?.look_back?.is_first_session || 
                        (sessionData.module_id === 1 && sessionData.session_number === 1);

  // First session experience
  if (isFirstSession) {
    return (
      <div className="space-y-6">
        {/* Different Opening Prayer based on mode */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
          <h4 className="font-bold text-blue-800 mb-3 flex items-center">
            🙏 Opening Prayer
          </h4>
          <div className="bg-white p-4 rounded-lg mb-4">
            <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line italic">
              {pathwayMode === 'individual' ? pathwayPrayers.individual : pathwayPrayers.group}
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="prayer-check"
              checked={prayerCompleted}
              onChange={(e) => {
                console.log('🔥 CHECKBOX EVENT FIRED');
                const newValue = e.target.checked;
                setPrayerCompleted(newValue);

                // Save to sessionStorage when checked
                if (newValue) {
                  const key = `prayer_${sessionData.module_id}_${sessionData.session_number}`;
                  if (window.sessionStorage) {
                    window.sessionStorage.setItem(key, 'true');
                  }
                  console.log('💾 SAVED TO SESSION STORAGE:', key);
                }
              }}
              className="mr-3 w-4 h-4"
            />
            <label htmlFor="prayer-check" className="text-gray-700">
              {pathwayMode === 'individual' ?
                "I have prayed this prayer (or my own version)" :
                "We have prayed together as a group"
              }
            </label>
          </div>
        </div>

        {/* First Session Celebration - Different for Individual vs Group */}
        <div className={`text-white p-6 rounded-lg ${
          pathwayMode === 'individual' 
            ? 'bg-gradient-to-r from-green-400 to-blue-500' 
            : 'bg-gradient-to-r from-purple-400 to-pink-500'
        }`}>
          <div className="text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h4 className="text-xl font-bold mb-3">
              {pathwayMode === 'individual' 
                ? "Congratulations on Starting Your Personal Journey!" 
                : "Congratulations on Forming Your Learning Group!"
              }
            </h4>
            <p className={`mb-4 ${pathwayMode === 'individual' ? 'text-green-100' : 'text-purple-100'}`}>
              {pathwayMode === 'individual' 
                ? "You've taken a significant step by committing to personal growth in faith-driven entrepreneurship. This shows your heart for integrating your faith with your work!"
                : "You've gathered as believers committed to growing together in marketplace ministry. The accountability and encouragement you'll provide each other will multiply your impact!"
              }
            </p>
          </div>
        </div>

        {/* Vision Statement Reminder */}
        <div className="bg-gradient-to-r from-teal-400 to-slate-700 rounded-lg p-6 text-white">
          <div className="text-center">
            <h4 className="text-xl font-bold mb-3">✨ Our Vision</h4>
            <p className="text-lg">
              Multiplying Followers of Jesus Christ through excellent, Faith-Driven Businesses.
            </p>
          </div>
        </div>

        <button 
          onClick={onComplete}
          disabled={!prayerCompleted}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ✅ Complete Looking Back
        </button>
      </div>
    );
  }

  // Regular session - use Action Accountability Review
  return (
    <div className="space-y-6">
      {/* Opening Prayer */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
        <h4 className="font-bold text-blue-800 mb-3 flex items-center">
          🙏 {pathwayMode === 'individual' ? 'Personal Opening Prayer' : 'Group Opening Prayer'}
        </h4>
        <div className="bg-white p-4 rounded-lg mb-4">
          <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line italic">
            {pathwayMode === 'individual' ? pathwayPrayers.individual : pathwayPrayers.group}
          </div>
        </div>
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="prayer-check"
            checked={prayerCompleted}
            onChange={(e) => setPrayerCompleted(e.target.checked)}
            className="mr-3 w-4 h-4" 
          />
          <label htmlFor="prayer-check" className="text-gray-700">
            {pathwayMode === 'individual' ? 
              "I have prayed this prayer (or my own version)" : 
              "We have prayed together as a group"
            }
          </label>
        </div>
      </div>

      {/* Action Accountability Review */}
      {prayerCompleted && (
        <ActionAccountabilityReview 
          sessionData={sessionData}
          pathwayMode={pathwayMode}
          onComplete={onComplete}
        />
      )}

      {!prayerCompleted && (
        <div className="bg-gray-100 border border-gray-300 rounded-lg p-6 text-center">
          <p className="text-gray-600">Complete the opening prayer to begin your accountability review.</p>
        </div>
      )}
    </div>
  );
};

export default EnhancedLookingBack;