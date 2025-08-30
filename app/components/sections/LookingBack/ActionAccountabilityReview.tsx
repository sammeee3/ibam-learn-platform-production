'use client';

import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, Lightbulb, Loader2 } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { SessionData, PathwayMode, ActionStep } from '../../../lib/types';
import { biblicalMotivationalMessages } from '../../../lib/constants';

interface ActionAccountabilityReviewProps {
  sessionData: SessionData;
  pathwayMode: PathwayMode;
  onComplete: () => void;
}

const ActionAccountabilityReview: React.FC<ActionAccountabilityReviewProps> = ({ 
  sessionData, 
  pathwayMode, 
  onComplete 
}) => {
  const [previousActions, setPreviousActions] = useState<ActionStep[]>([]);
  const [actionReviews, setActionReviews] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [celebrating, setCelebrating] = useState<string | null>(null);

  // Check if all actions have been addressed
  const allActionsAddressed = previousActions.length === 0 || previousActions.every(action => 
    actionReviews[action.id]?.status === 'completed' ||
    actionReviews[action.id]?.status === 'deferred' ||
    actionReviews[action.id]?.status === 'cancelled'
  );

  const supabase = createClientComponentClient();

  // Load previous session's action steps
  useEffect(() => {
    const loadPreviousActions = async () => {
      try {
        console.log('🔍 LOADING PREVIOUS - Current session:', sessionData.session_number, 'module:', sessionData.module_id);
        setLoading(true);
        
        // Calculate previous session
        const currentModule = sessionData.module_id;
        const currentSession = sessionData.session_number;
        let prevModule = currentModule;
        let prevSession = currentSession - 1;
        
        if (prevSession < 1) {
          prevModule = currentModule - 1;
          prevSession = 4; // Assuming 4 sessions per module
        }
        console.log('🔧 CALCULATED: prevModule =', prevModule, 'prevSession =', prevSession);
        if (prevModule < 1) {
          // No previous session
          setLoading(false);
          return;
        }

        // Get real previous actions from database
        console.log('🔧 ABOUT TO QUERY DATABASE');
        // Get user email from custom auth system (same as main session page)
        const userEmail = typeof window !== 'undefined' ? localStorage.getItem('ibam-auth-email') : null;
        
        if (!userEmail) {
          console.error('❌ No authenticated user - Looking Back needs login');
          setLoading(false);
          return;
        }

        // Get profile ID using API endpoint (consistent with session page)
        const response = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
        if (!response.ok) {
          console.error('❌ Profile API failed in Looking Back');
          setLoading(false);
          return;
        }
        
        const profile = await response.json();
        const userId = profile.id; // Integer profile ID for actions table
        console.log('🔍 USER CHECK: email =', userEmail, 'profile_id =', userId);
        
        // Use API endpoint instead of direct database query
        const actionsResponse = await fetch(`/api/actions/load-previous?userId=${userId}&moduleId=${prevModule}&sessionId=${prevSession}`);
        
        if (!actionsResponse.ok) {
          console.error('❌ Actions API failed:', actionsResponse.status);
          setLoading(false);
          return;
        }
        
        const actionsData = await actionsResponse.json();
        const realActions = actionsData.actions;

        console.log('🔍 API QUERY: user_id =', userId, 'module_id =', prevModule, 'session_id =', prevSession);
        console.log('🔍 API RESULT:', realActions ? realActions.length : 'null', 'actions found');

        if (realActions && realActions.length > 0) {
          // Convert database format to display format
          const convertedActions = realActions.map(action => ({
            ...action,
            type: action.action_type,
            specific: action.specific_action,
            timed: action.timed,
            person_to_tell: action.person_to_tell,
            completed: action.completed  // ADD THIS LINE
          }));
          console.log('🎉 SETTING PREVIOUS ACTIONS:', convertedActions.length);
          setPreviousActions(convertedActions);

          // Initialize actionReviews with database completion status
          const initialReviews: Record<string, any> = {};
          convertedActions.forEach(action => {
            if (action.completed) {
              initialReviews[action.id] = { completed: true };
            }
          });
          setActionReviews(initialReviews);
          console.log('🔧 INITIALIZED ACTION REVIEWS:', initialReviews);
        } else {
          setPreviousActions([]);
        }

      } catch (error) {
        console.error('Error loading previous actions:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPreviousActions();
  }, [sessionData, supabase]);

  const updateActionReview = (actionId: string, field: string, value: any) => {
    setActionReviews(prev => ({
      ...prev,
      [actionId]: {
        ...prev[actionId],
        [field]: value
      }
    }));
  };

  const markCompleted = async (actionId: string) => {
    console.log('🔥 MARK COMPLETE CLICKED:', actionId);
    updateActionReview(actionId, 'completed', true);
    updateActionReview(actionId, 'status', 'completed');
    setCelebrating(actionId);
    
    // Save completion to database
    try {
      const { error } = await supabase
        .from('user_action_steps')
        .update({ 
          completed: true, 
          completed_at: new Date().toISOString() 
        })
        .eq('id', actionId);
        
      if (error) {
        console.error('Failed to save completion:', error);
      } else {
        console.log('✅ Action completion saved to database');
      }
    } catch (error) {
      console.error('Error saving completion:', error);
    }
    
    // Hide celebration after 3 seconds
    setTimeout(() => {
      setCelebrating(null);
    }, 3000);
  };

  const deferAction = async (actionId: string) => {
    console.log('⏸️ DEFER ACTION CLICKED:', actionId);
    
    // Mark action as deferred in local state
    updateActionReview(actionId, 'status', 'deferred');
    
    // Calculate next session for proper forwarding
    const currentModule = sessionData.module_id;
    const currentSession = sessionData.session_number;
    const moduleSessionCounts = { 1: 4, 2: 4, 3: 5, 4: 4, 5: 5 };
    
    let nextModule = currentModule;
    let nextSession = currentSession + 1;
    
    // Handle module transitions
    if (nextSession > moduleSessionCounts[currentModule]) {
      nextModule = currentModule + 1;
      nextSession = 1;
    }
    
    // Don't defer beyond course end
    if (nextModule > 5) {
      console.log('⚠️ Cannot defer beyond course end - marking as no longer relevant');
      skipAction(actionId);
      return;
    }
    
    // Update database to move action to next session
    try {
      const { error } = await supabase
        .from('user_action_steps')
        .update({ 
          deferred: true, 
          deferred_at: new Date().toISOString(),
          deferred_from_session: currentSession,
          deferred_from_module: currentModule,
          session_id: nextSession, // 🚨 CRITICAL: Move to next session
          module_id: nextModule    // 🚨 CRITICAL: Update module if needed
        })
        .eq('id', actionId);
        
      if (error) {
        console.error('Failed to defer action:', error);
      } else {
        console.log(`✅ Action deferred to Module ${nextModule}, Session ${nextSession}`);
        // Remove from current view
        setPreviousActions(prev => prev.filter(action => action.id !== actionId));
      }
    } catch (error) {
      console.error('Error deferring action:', error);
    }
  };

  const skipAction = async (actionId: string) => {
    console.log('⏸️ SKIP ACTION CLICKED:', actionId);
    
    // Friendly confirmation for skipping
    if (!confirm('Mark this action as no longer relevant? Sometimes priorities change, and that\'s perfectly okay!')) {
      return;
    }
    
    // Mark action as cancelled in local state
    updateActionReview(actionId, 'status', 'cancelled');
    
    // Update database to skip action
    try {
      const { error } = await supabase
        .from('user_action_steps')
        .update({ 
          cancelled: true, 
          cancelled_at: new Date().toISOString(),
          cancel_reason: 'Priorities shifted - no longer relevant'
        })
        .eq('id', actionId);
        
      if (error) {
        console.error('Failed to skip action:', error);
      } else {
        console.log('✅ Action marked as no longer relevant');
        // Remove from current view
        setPreviousActions(prev => prev.filter(action => action.id !== actionId));
      }
    } catch (error) {
      console.error('Error skipping action:', error);
    }
  };

  const getDanSullivanQuestions = (actionType: 'business' | 'discipleship') => {
    return [
      "What did you discover from this experience?",
      "How is this different than you expected?", 
      "What would you do differently next time?",
      "What capability do you need to develop?",
      "What did you learn about yourself?",
      "How can this learning help you win next time?"
    ];
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin mr-3" />
          <span>Loading your previous commitments...</span>
        </div>
      </div>
    );
  }

  if (previousActions.length === 0) {
    return (
      <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
        <h4 className="font-bold text-blue-800 mb-3">🎉 Welcome to Your Learning Journey!</h4>
        <p className="text-blue-700">
          This is your first session or you haven't created action steps yet. 
          Action steps from today's session will appear here next time for accountability review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Three Thirds Reminder for Small Groups */}
      {pathwayMode === 'small_group' && (
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg">
          <h5 className="font-bold mb-2">👥 Three Thirds Approach Reminder</h5>
          <p className="text-sm text-purple-100">
            <strong>Looking Back (10-15 min):</strong> Prayer + action sharing + wins + vision reminder
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border p-6">
        <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Target className="w-6 h-6 mr-3 text-blue-600" />
          📊 Action Step Accountability Review
        </h4>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-800 font-medium mb-2">🎯 Your Growth Journey Continues!</p>
          <p className="text-blue-700 text-sm">
            Every action you review builds character and wisdom. Whether completed or not, each step teaches valuable lessons about business excellence and faithful discipleship. You're becoming the entrepreneur God created you to be!
          </p>
        </div>

        <div className="space-y-6">
          {previousActions.map((action, index) => {
            const review = actionReviews[action.id] || {};
            const isCompleted = review.completed || false;
            const isCelebrating = celebrating === action.id;

            return (
              <div key={action.id} className={`border rounded-lg p-6 transition-all ${
                isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
              }`}>
                {/* Celebration Animation */}
                {isCelebrating && (
                  <div className="text-center mb-4 animate-pulse">
                    <div className="text-4xl mb-2">🎉</div>
                    <p className="text-green-800 font-bold text-lg">
                      Fantastic! You completed this action step!
                    </p>
                  </div>
                )}

                {/* Action Summary */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-3">
                        {action.type === 'business' ? '💼' : '❤️'}
                      </span>
                      <h5 className="font-semibold text-gray-800 text-lg">
                        Action {index + 1}: {action.type === 'business' ? 'Business' : 'Discipleship'}
                      </h5>
                    </div>
                    <p className="text-gray-700 text-base mb-2">
                      <strong>Action:</strong> {action.generated_statement || `${action.specific} ${action.timed}`}
                    </p>
                    <p className="text-gray-600 text-sm">
                      <strong>Tell:</strong> Did you tell {action.person_to_tell} about your learning?
                    </p>
                  </div>
                  
                  {!isCompleted && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => markCompleted(action.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        ✅ Completed
                      </button>
                      <button
                        onClick={() => deferAction(action.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                      >
                        ⏭️ Try Next Session
                      </button>
                      <button
                        onClick={() => skipAction(action.id)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium text-sm"
                      >
                        🔄 No Longer Relevant
                      </button>
                    </div>
                  )}
                </div>

                {/* Completion Questions */}
                {isCompleted ? (
                  <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                    <h6 className="font-semibold text-green-800 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      🌟 Outstanding! You're Building Momentum!
                    </h6>
                    <div className="bg-green-200 border border-green-400 rounded-lg p-3 mb-4">
                      <p className="text-green-800 text-sm font-medium mb-1">🎯 Growth Mindset Victory!</p>
                      <p className="text-green-700 text-sm">
                        Each completed action is evidence of your character development. You're becoming the person God created you to be through faithful execution!
                      </p>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block font-medium text-green-700 mb-1">
                          What was the best outcome from completing this action?
                        </label>
                        <textarea
                          value={review.celebration_notes || ''}
                          onChange={(e) => updateActionReview(action.id, 'celebration_notes', e.target.value)}
                          placeholder="Share your win and what you learned..."
                          className="w-full p-3 border border-green-300 rounded-lg text-sm bg-white"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-green-700 mb-1">
                          Did you tell {action.person_to_tell} about your learning?
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`shared_${action.id}`}
                              value="yes"
                              checked={review.shared_learning === 'yes'}
                              onChange={(e) => updateActionReview(action.id, 'shared_learning', e.target.value)}
                              className="mr-2"
                            />
                            Yes! ✅
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`shared_${action.id}`}
                              value="no"
                              checked={review.shared_learning === 'no'}
                              onChange={(e) => updateActionReview(action.id, 'shared_learning', e.target.value)}
                              className="mr-2"
                            />
                            Not yet
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                    <h6 className="font-semibold text-blue-800 mb-3 flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2" />
                      💡 Learning from Your Experience
                    </h6>
                    <div className="bg-blue-100 border border-blue-400 rounded-lg p-3 mb-4">
                      <p className="text-blue-800 text-sm font-medium mb-1">💪 Learning Mindset - You're Still Winning!</p>
                      <p className="text-blue-700 text-sm">
                        Every attempt teaches valuable lessons. Success in business and discipleship comes through iteration and growth. You're building wisdom with each experience!
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block font-medium text-blue-700 mb-1">
                          What did you discover from this experience?
                        </label>
                        <textarea
                          value={review.learning_discovery || ''}
                          onChange={(e) => updateActionReview(action.id, 'learning_discovery', e.target.value)}
                          placeholder="What did you learn about yourself, your business, or the situation?"
                          className="w-full p-3 border border-blue-300 rounded-lg text-sm bg-white"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-blue-700 mb-1">
                          What would you do differently next time?
                        </label>
                        <textarea
                          value={review.different_approach || ''}
                          onChange={(e) => updateActionReview(action.id, 'different_approach', e.target.value)}
                          placeholder="How would you approach this differently to win next time?"
                          className="w-full p-3 border border-blue-300 rounded-lg text-sm bg-white"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block font-medium text-blue-700 mb-1">
                          Did you tell {action.person_to_tell} about any learning from this session?
                        </label>
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`shared_incomplete_${action.id}`}
                              value="yes"
                              checked={review.shared_learning === 'yes'}
                              onChange={(e) => updateActionReview(action.id, 'shared_learning', e.target.value)}
                              className="mr-2"
                            />
                            Yes ✅
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`shared_incomplete_${action.id}`}
                              value="no"
                              checked={review.shared_learning === 'no'}
                              onChange={(e) => updateActionReview(action.id, 'shared_learning', e.target.value)}
                              className="mr-2"
                            />
                            Not yet
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Button */}
        <div className="mt-8 text-center">
          {!allActionsAddressed && previousActions.length > 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800 font-medium mb-2">⚠️ Action Review Required</p>
              <p className="text-yellow-700 text-sm">
                Please address all {previousActions.length} action(s) from your previous session by selecting 
                "Completed", "Try Next Session", or "No Longer Relevant" for each one.
              </p>
              <p className="text-yellow-600 text-xs mt-2">
                Remaining: {previousActions.filter(action => !actionReviews[action.id]?.status).length} action(s)
              </p>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-green-800 font-medium">
                ✅ {previousActions.length === 0 
                  ? 'No previous actions to review' 
                  : 'All actions addressed!'
                }
              </p>
            </div>
          )}
          
          <button 
            onClick={onComplete}
            disabled={!allActionsAddressed && previousActions.length > 0}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              allActionsAddressed || previousActions.length === 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            ✅ Complete Accountability Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionAccountabilityReview;