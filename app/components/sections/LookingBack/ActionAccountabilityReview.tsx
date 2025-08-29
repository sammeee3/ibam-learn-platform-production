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
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || '0571f8be-e6d4-4158-9301-a6cf2183e40f';

        console.log('🔍 USER CHECK:', user?.id);
        // Single database query - no duplicates
        const { data: realActions, error } = await supabase
          .from('user_action_steps')
          .select('*')
          .eq('user_id', userId)
          .eq('module_id', prevModule)
          .eq('session_id', prevSession);

        console.log('🔍 DATABASE QUERY: user_id =', userId, 'module_id =', prevModule, 'session_id =', prevSession);
        console.log('🔍 DATABASE RESULT:', realActions ? realActions.length : 'null', 'actions found');

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
    
    // Update database to defer action (move to next session)
    try {
      const { error } = await supabase
        .from('user_action_steps')
        .update({ 
          deferred: true, 
          deferred_at: new Date().toISOString(),
          // Could move to next session by updating session_id
        })
        .eq('id', actionId);
        
      if (error) {
        console.error('Failed to defer action:', error);
      } else {
        console.log('⏸️ Action deferred to next session');
        // Remove from current view
        setPreviousActions(prev => prev.filter(action => action.id !== actionId));
      }
    } catch (error) {
      console.error('Error deferring action:', error);
    }
  };

  const cancelAction = async (actionId: string) => {
    console.log('❌ CANCEL ACTION CLICKED:', actionId);
    
    // Confirm cancellation
    if (!confirm('Are you sure you want to cancel this action? This will mark it as no longer relevant.')) {
      return;
    }
    
    // Update database to cancel action
    try {
      const { error } = await supabase
        .from('user_action_steps')
        .update({ 
          cancelled: true, 
          cancelled_at: new Date().toISOString(),
          cancel_reason: 'No longer fits priorities'
        })
        .eq('id', actionId);
        
      if (error) {
        console.error('Failed to cancel action:', error);
      } else {
        console.log('❌ Action cancelled');
        // Remove from current view
        setPreviousActions(prev => prev.filter(action => action.id !== actionId));
      }
    } catch (error) {
      console.error('Error cancelling action:', error);
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
        <button 
          onClick={onComplete}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          ✅ Continue to Learning
        </button>
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
        <p className="text-gray-600 mb-6">
          Let's review the action steps you committed to in your last session. Remember: Learning is winning!
        </p>

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
                        ⏸️ Defer
                      </button>
                      <button
                        onClick={() => cancelAction(action.id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                      >
                        ❌ Cancel
                      </button>
                    </div>
                  )}
                </div>

                {/* Completion Questions */}
                {isCompleted ? (
                  <div className="bg-green-100 border border-green-300 rounded-lg p-4">
                    <h6 className="font-semibold text-green-800 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      🎉 Excellent Work! Share Your Win
                    </h6>
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
                    <p className="text-blue-700 text-sm mb-4">
                      <strong>Remember:</strong> Not completing an action is still learning! Every experience teaches valuable lessons.
                    </p>
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
          <button 
            onClick={onComplete}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            ✅ Complete Accountability Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionAccountabilityReview;