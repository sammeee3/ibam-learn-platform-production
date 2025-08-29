'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import SmartActionCoachingInterface from '../../coaching/SmartActionCoachingInterface';
import { getCoachingLevel } from '../../../lib/smart-action-coach';
import type { ActionCommitment, PathwayMode, SessionData } from '../../../lib/types';

interface UnifiedLookingForwardProps {
  sessionData: SessionData;
  pathwayMode: PathwayMode;
  onComplete: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

interface UserActionStats {
  totalCompleted: number;
  completionStreak: number;
  averageQualityScore: number;
  lastQualityScore?: number;
}

const UnifiedLookingForward: React.FC<UnifiedLookingForwardProps> = ({
  sessionData,
  pathwayMode,
  onComplete,
  isExpanded,
  onToggleExpanded
}) => {
  const [currentAction, setCurrentAction] = useState('');
  const [actionType, setActionType] = useState<'business' | 'discipleship'>('business');
  const [accountabilityPerson, setAccountabilityPerson] = useState('');
  const [sharingCommitment, setSharingCommitment] = useState('');
  const [userStats, setUserStats] = useState<UserActionStats>({
    totalCompleted: 0,
    completionStreak: 0,
    averageQualityScore: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const supabase = createClientComponentClient();
  const coachingLevel = getCoachingLevel(sessionData.session_number);

  // Load user stats on mount
  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get completed actions count and streak
      const { data: actions } = await supabase
        .from('user_action_steps')
        .select('completed, quality_score, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (actions) {
        const completedActions = actions.filter(a => a.completed);
        const totalCompleted = completedActions.length;
        
        // Calculate completion streak (consecutive sessions with completed actions)
        let streak = 0;
        const recentActions = actions.slice(0, 10);
        for (const action of recentActions) {
          if (action.completed) streak++;
          else break;
        }

        // Calculate average quality score
        const scoredActions = actions.filter(a => a.quality_score);
        const avgScore = scoredActions.length > 0 
          ? scoredActions.reduce((sum, a) => sum + a.quality_score, 0) / scoredActions.length 
          : 0;

        setUserStats({
          totalCompleted,
          completionStreak: streak,
          averageQualityScore: Math.round(avgScore * 10) / 10,
          lastQualityScore: scoredActions[0]?.quality_score
        });
      }
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const handleActionApproved = async () => {
    if (!currentAction.trim() || !accountabilityPerson.trim()) return;
    
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Save action to database with quality score
      const { error } = await supabase
        .from('user_action_steps')
        .insert({
          user_id: user.id,
          module_id: sessionData.module_id,
          session_id: sessionData.session_number,
          action_type: actionType,
          specific_action: currentAction,
          person_to_tell: accountabilityPerson,
          generated_statement: currentAction,
          sharing_commitment: sharingCommitment,
          completed: false,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onComplete();
      }, 2000);

    } catch (error) {
      console.error('Error saving action:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progressive pathway selection based on coaching level
  const getPathwayOptions = () => {
    switch (coachingLevel.level) {
      case 'foundation':
        return [
          { id: 'quick', name: 'Quick Action', description: 'Simple, immediate action (15-30 min)', icon: '⚡' },
          { id: 'deep', name: 'Deep Commitment', description: 'Weekly project with accountability', icon: '🎯' }
        ];
      case 'refinement':
        return [
          { id: 'business', name: 'Business Growth', description: 'Revenue or customer focused action', icon: '💼' },
          { id: 'discipleship', name: 'Discipleship Impact', description: 'Spiritual growth or ministry action', icon: '✝️' }
        ];
      case 'integration':
        return [
          { id: 'compound', name: 'Compound Action', description: 'Builds on previous successes', icon: '🔗' },
          { id: 'teaching', name: 'Teaching Action', description: 'Share knowledge with others', icon: '👨‍🏫' }
        ];
      case 'mastery':
        return [
          { id: 'system', name: 'System Creation', description: 'Create repeatable processes', icon: '⚙️' },
          { id: 'multiplication', name: 'Multiplication', description: 'Multiply impact through others', icon: '🌱' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div 
        className="bg-orange-500 hover:bg-orange-600 text-white p-6 cursor-pointer transition-colors"
        onClick={onToggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Lightbulb className="w-8 h-8 mr-3" />
            <div>
              <h3 className="text-2xl font-bold">🎯 LOOKING FORWARD</h3>
              <p className="text-orange-100">
                {coachingLevel.level.toUpperCase()} Level Action Planning • Session {sessionData.session_number}
              </p>
            </div>
          </div>
          {isExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </div>
      </div>

      {isExpanded && (
        <div className="p-6 bg-orange-50 space-y-8">
          {/* Progress Stats */}
          {userStats.totalCompleted > 0 && (
            <div className="bg-white rounded-lg p-4 border">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{userStats.totalCompleted}</div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{userStats.completionStreak}</div>
                  <div className="text-sm text-gray-600">Streak</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{userStats.averageQualityScore}</div>
                  <div className="text-sm text-gray-600">Avg Quality</div>
                </div>
              </div>
            </div>
          )}

          {/* Pathway Selection */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-gray-800">Choose Your Action Pathway:</h4>
            <div className="grid md:grid-cols-2 gap-4">
              {getPathwayOptions().map((pathway) => (
                <motion.button
                  key={pathway.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    actionType === pathway.id 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setActionType(pathway.id as 'business' | 'discipleship')}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{pathway.icon}</span>
                    <div>
                      <h5 className="font-semibold text-gray-800">{pathway.name}</h5>
                      <p className="text-sm text-gray-600">{pathway.description}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Smart Action Coaching Interface */}
          <SmartActionCoachingInterface
            sessionNumber={sessionData.session_number}
            currentAction={currentAction}
            onActionUpdate={setCurrentAction}
            onActionApproved={handleActionApproved}
            userPatterns={{
              previousScore: userStats.lastQualityScore,
              completionStreak: userStats.completionStreak,
              totalActionsCompleted: userStats.totalCompleted
            }}
          />

          {/* Accountability Person */}
          <div className="bg-white rounded-lg p-6 border">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Accountability Partner
            </h4>
            <p className="text-gray-600 mb-4">
              Who will you share this commitment with? Accountability increases success rates by 65%!
            </p>
            <input
              type="text"
              value={accountabilityPerson}
              onChange={(e) => setAccountabilityPerson(e.target.value)}
              placeholder="e.g., John Smith, my spouse, my business partner..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              required
            />
          </div>

          {/* Sharing Commitment */}
          <div className="bg-indigo-50 rounded-lg p-6 border-l-4 border-indigo-400">
            <h4 className="font-bold text-indigo-800 mb-3">🤝 Multiplication Through Sharing</h4>
            <p className="text-gray-700 mb-4">
              Teaching reinforces learning. Who will you share today's key insights with this week?
            </p>
            <input
              type="text"
              value={sharingCommitment}
              onChange={(e) => setSharingCommitment(e.target.value)}
              placeholder="e.g., My team during our weekly meeting, my small group..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
          </div>

          {/* Success Animation */}
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
            >
              <div className="bg-white rounded-lg p-8 text-center shadow-xl">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  🎉
                </motion.div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Action Created!</h3>
                <p className="text-gray-600">Your commitment is locked and loaded. Time to make it happen!</p>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default UnifiedLookingForward;