'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  TrophyIcon,
  LightBulbIcon,
  HeartIcon,
  TargetIcon,
  FireIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface ActionCommitment {
  id: string;
  user_id: string;
  module_id: number;
  session_id: number;
  action_type: 'business' | 'discipleship';
  specific_action: string;
  timed: string;
  generated_statement: string;
  person_to_tell: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export default function CommitmentFlowDemo() {
  const [currentSession, setCurrentSession] = useState({ module: 1, session: 2 });
  const [previousSession, setPreviousSession] = useState({ module: 1, session: 1 });
  const [view, setView] = useState<'menu' | 'lookback' | 'lookforward'>('menu');
  const [previousActions, setPreviousActions] = useState<ActionCommitment[]>([]);
  const [newActions, setNewActions] = useState<ActionCommitment[]>([]);
  const [actionReviews, setActionReviews] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  
  const supabase = createClientComponentClient();

  // Simulate loading previous actions
  useEffect(() => {
    if (view === 'lookback') {
      loadPreviousActions();
    }
  }, [view]);

  const loadPreviousActions = async () => {
    setLoading(true);
    
    // Simulate database load
    setTimeout(() => {
      const mockPreviousActions: ActionCommitment[] = [
        {
          id: 'prev-1',
          user_id: 'demo-user',
          module_id: previousSession.module,
          session_id: previousSession.session,
          action_type: 'business',
          specific_action: 'Call 5 potential customers to discuss their business challenges',
          timed: 'Wednesday and Thursday, 2-4 PM',
          generated_statement: 'I will call 5 potential customers to discuss their business challenges | When: Wednesday and Thursday, 2-4 PM',
          person_to_tell: 'John (my accountability partner)',
          completed: false,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'prev-2',
          user_id: 'demo-user',
          module_id: previousSession.module,
          session_id: previousSession.session,
          action_type: 'discipleship',
          specific_action: 'Have coffee with Sarah from accounting and ask about her family',
          timed: 'Friday at 3 PM',
          generated_statement: 'I will have coffee with Sarah from accounting and ask about her family | When: Friday at 3 PM',
          person_to_tell: 'My spouse',
          completed: false,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setPreviousActions(mockPreviousActions);
      setLoading(false);
    }, 1000);
  };

  const markActionComplete = (actionId: string) => {
    setPreviousActions(prev => 
      prev.map(action => 
        action.id === actionId 
          ? { ...action, completed: true, completed_at: new Date().toISOString() }
          : action
      )
    );
    
    setActionReviews(prev => ({
      ...prev,
      [actionId]: {
        ...prev[actionId],
        completed: true,
        completedAt: new Date().toISOString()
      }
    }));
  };

  const markActionIncomplete = (actionId: string, reason: string, learning: string, nextStep: string) => {
    setActionReviews(prev => ({
      ...prev,
      [actionId]: {
        ...prev[actionId],
        completed: false,
        reason,
        learning,
        nextStep,
        deferredToNext: false
      }
    }));
  };

  const deferActionToNext = (actionId: string) => {
    const action = previousActions.find(a => a.id === actionId);
    if (action) {
      setActionReviews(prev => ({
        ...prev,
        [actionId]: {
          ...prev[actionId],
          deferredToNext: true
        }
      }));
      
      // Add to new actions for current session
      setNewActions(prev => [...prev, {
        ...action,
        id: `new-${Date.now()}`,
        module_id: currentSession.module,
        session_id: currentSession.session,
        created_at: new Date().toISOString(),
        completed: false
      }]);
    }
  };

  const createNewAction = (type: 'business' | 'discipleship', specific: string, timed: string, person: string) => {
    const newAction: ActionCommitment = {
      id: `new-${Date.now()}`,
      user_id: 'demo-user',
      module_id: currentSession.module,
      session_id: currentSession.session,
      action_type: type,
      specific_action: specific,
      timed: timed,
      generated_statement: `I will ${specific} | When: ${timed}`,
      person_to_tell: person,
      completed: false,
      created_at: new Date().toISOString()
    };
    
    setNewActions(prev => [...prev, newAction]);
  };

  if (view === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Action Commitment Flow
            </h1>
            <p className="text-xl text-white/90">
              Experience the complete cycle of commitment, accountability, and growth
            </p>
            <div className="mt-6 inline-flex bg-white/20 backdrop-blur-lg rounded-full px-6 py-3">
              <span className="text-white">
                Module {currentSession.module}, Session {currentSession.session}
              </span>
            </div>
          </div>

          {/* Flow Diagram */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">The IBAM Action Cycle</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Previous Session */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-3">📝</div>
                <h3 className="font-bold text-gray-800 mb-2">Previous Session</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Module {previousSession.module}, Session {previousSession.session}
                </p>
                <div className="text-left space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span>Created 2 actions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HeartIcon className="w-4 h-4 text-pink-500" />
                    <span>Committed to share</span>
                  </div>
                </div>
              </motion.div>

              {/* Arrow */}
              <div className="flex items-center justify-center">
                <ArrowRightIcon className="w-8 h-8 text-white" />
              </div>

              {/* Current Session */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-6 text-center"
              >
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="font-bold mb-2">Current Session</h3>
                <p className="text-sm opacity-90 mb-3">
                  Module {currentSession.module}, Session {currentSession.session}
                </p>
                <div className="text-left space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <ArrowLeftIcon className="w-4 h-4" />
                    <span>Review past actions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LightBulbIcon className="w-4 h-4" />
                    <span>Learn from results</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRightIcon className="w-4 h-4" />
                    <span>Create new actions</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Looking Back Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView('lookback')}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden group"
            >
              <div className="bg-gradient-to-r from-orange-400 to-pink-600 p-6 text-white">
                <ArrowLeftIcon className="w-10 h-10 mb-3" />
                <h3 className="text-2xl font-bold">Looking Back</h3>
                <p className="opacity-90">Review & Learn from Previous Actions</p>
              </div>
              <div className="p-6">
                <ul className="text-left space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                    <span>Mark actions complete/incomplete</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <LightBulbIcon className="w-4 h-4 text-yellow-500" />
                    <span>Record insights & learning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-blue-500" />
                    <span>Defer actions to next session</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <TrophyIcon className="w-4 h-4 text-purple-500" />
                    <span>Celebrate wins & progress</span>
                  </li>
                </ul>
                <div className="mt-4 text-center">
                  <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    Start Here →
                  </span>
                </div>
              </div>
            </motion.button>

            {/* Looking Forward Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setView('lookforward')}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden group"
            >
              <div className="bg-gradient-to-r from-blue-400 to-indigo-600 p-6 text-white">
                <ArrowRightIcon className="w-10 h-10 mb-3" />
                <h3 className="text-2xl font-bold">Looking Forward</h3>
                <p className="opacity-90">Create New Action Commitments</p>
              </div>
              <div className="p-6">
                <ul className="text-left space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <TargetIcon className="w-4 h-4 text-teal-500" />
                    <span>Build SMART business actions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <HeartIcon className="w-4 h-4 text-pink-500" />
                    <span>Create discipleship actions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-purple-500" />
                    <span>Include deferred actions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FireIcon className="w-4 h-4 text-orange-500" />
                    <span>Set accountability partners</span>
                  </li>
                </ul>
                <div className="mt-4 text-center">
                  <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                    Continue Journey →
                  </span>
                </div>
              </div>
            </motion.button>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-3">🔄 The Power of Continuous Commitment</h3>
            <p className="mb-3">
              Each session builds on the last. You create actions based on what you learned (Looking Up), 
              then review them in the next session (Looking Back) to understand what worked, what didn't, 
              and why. This creates a powerful cycle of continuous improvement.
            </p>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <div className="bg-white/10 rounded-lg p-3">
                <strong>Win:</strong> Action completed successfully → Celebrate & document success factors
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <strong>Learn:</strong> Action not completed → Extract insights & adjust approach
              </div>
              <div className="bg-white/10 rounded-lg p-3">
                <strong>Defer:</strong> Still relevant → Move to current session with new timeline
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (view === 'lookback') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-pink-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => setView('menu')}
              className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Menu
            </button>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent mb-4">
              Looking Back: Action Accountability
            </h1>
            <p className="text-gray-600">
              Review the actions you committed to in Module {previousSession.module}, Session {previousSession.session}
            </p>
          </motion.div>

          {loading ? (
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4" />
              <p>Loading your previous commitments...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {previousActions.map((action, index) => {
                const review = actionReviews[action.id] || {};
                const isCompleted = action.completed || review.completed;
                const isDeferred = review.deferredToNext;
                
                return (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                      isCompleted ? 'ring-2 ring-green-400' : 
                      isDeferred ? 'ring-2 ring-blue-400' : ''
                    }`}
                  >
                    {/* Action Header */}
                    <div className={`p-6 ${
                      isCompleted ? 'bg-green-50' : 
                      isDeferred ? 'bg-blue-50' : 
                      'bg-gray-50'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {action.action_type === 'business' ? (
                              <TargetIcon className="w-6 h-6 text-teal-600" />
                            ) : (
                              <HeartIcon className="w-6 h-6 text-pink-600" />
                            )}
                            <h3 className="text-lg font-bold text-gray-800">
                              {action.action_type === 'business' ? 'Business' : 'Discipleship'} Action #{index + 1}
                            </h3>
                            {isCompleted && (
                              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                ✅ Completed
                              </span>
                            )}
                            {isDeferred && (
                              <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                                ⏩ Deferred
                              </span>
                            )}
                          </div>
                          <p className="text-gray-700 font-medium mb-2">
                            {action.generated_statement}
                          </p>
                          <p className="text-sm text-gray-600">
                            <strong>Accountability:</strong> {action.person_to_tell}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Review Section */}
                    <div className="p-6 border-t">
                      {!isCompleted && !review.reason && (
                        <div className="space-y-4">
                          <p className="font-medium text-gray-800 mb-3">How did this action go?</p>
                          
                          <div className="grid md:grid-cols-3 gap-3">
                            <button
                              onClick={() => markActionComplete(action.id)}
                              className="p-4 bg-green-50 hover:bg-green-100 rounded-lg border-2 border-green-300 transition-all"
                            >
                              <CheckCircleIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                              <p className="font-medium text-green-800">Completed!</p>
                              <p className="text-xs text-green-600">I did it!</p>
                            </button>
                            
                            <button
                              onClick={() => markActionIncomplete(
                                action.id, 
                                'partial',
                                'Started but didn\'t finish',
                                'Break it into smaller steps'
                              )}
                              className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg border-2 border-yellow-300 transition-all"
                            >
                              <ClockIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                              <p className="font-medium text-yellow-800">Partial</p>
                              <p className="text-xs text-yellow-600">Made progress</p>
                            </button>
                            
                            <button
                              onClick={() => markActionIncomplete(
                                action.id,
                                'notstarted',
                                'Didn\'t get to it',
                                'Schedule specific time'
                              )}
                              className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border-2 border-gray-300 transition-all"
                            >
                              <XCircleIcon className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                              <p className="font-medium text-gray-800">Not Started</p>
                              <p className="text-xs text-gray-600">Couldn\'t do it</p>
                            </button>
                          </div>
                        </div>
                      )}

                      {isCompleted && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-green-100 rounded-lg p-4"
                        >
                          <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                            <TrophyIcon className="w-5 h-5" />
                            Congratulations! Share your win:
                          </h4>
                          <textarea
                            placeholder="What was the best outcome? What did you learn?"
                            className="w-full p-3 rounded-lg border border-green-300 bg-white"
                            rows={3}
                            value={review.celebration || ''}
                            onChange={(e) => setActionReviews(prev => ({
                              ...prev,
                              [action.id]: { ...prev[action.id], celebration: e.target.value }
                            }))}
                          />
                        </motion.div>
                      )}

                      {review.reason && !isCompleted && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-4"
                        >
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                              <LightBulbIcon className="w-5 h-5" />
                              Learning Opportunity:
                            </h4>
                            <p className="text-blue-700 mb-3">
                              <strong>Status:</strong> {review.learning}
                            </p>
                            <textarea
                              placeholder="What prevented completion? What did you discover?"
                              className="w-full p-3 rounded-lg border border-blue-300 bg-white mb-3"
                              rows={2}
                            />
                            
                            {!isDeferred && (
                              <button
                                onClick={() => deferActionToNext(action.id)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                              >
                                ⏩ Defer to Current Session
                              </button>
                            )}
                            {isDeferred && (
                              <p className="text-blue-600 font-medium">
                                ✅ Added to current session actions
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8"
              >
                <button
                  onClick={() => setView('lookforward')}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all"
                >
                  Continue to Looking Forward →
                </button>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (view === 'lookforward') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <button
              onClick={() => setView('menu')}
              className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Back to Menu
            </button>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Looking Forward: New Commitments
            </h1>
            <p className="text-gray-600">
              Create action commitments for Module {currentSession.module}, Session {currentSession.session}
            </p>
          </motion.div>

          {/* Deferred Actions */}
          {newActions.filter(a => previousActions.some(pa => pa.specific_action === a.specific_action)).length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 bg-blue-50 rounded-xl p-6 border-2 border-blue-200"
            >
              <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
                <ClockIcon className="w-5 h-5" />
                Deferred Actions (Automatically Added)
              </h3>
              <div className="space-y-2">
                {newActions
                  .filter(a => previousActions.some(pa => pa.specific_action === a.specific_action))
                  .map(action => (
                    <div key={action.id} className="bg-white rounded-lg p-3">
                      <p className="text-gray-700">{action.generated_statement}</p>
                    </div>
                  ))}
              </div>
            </motion.div>
          )}

          {/* Action Builder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Create Your Actions ({newActions.length}/4)
            </h3>
            
            {newActions.length < 4 && (
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() => createNewAction(
                      'business',
                      'Review financial statements and identify top 3 cost-saving opportunities',
                      'Monday morning, 9-10 AM',
                      'My business partner'
                    )}
                    className="p-4 bg-teal-50 hover:bg-teal-100 rounded-lg border-2 border-teal-300 text-left transition-all"
                  >
                    <TargetIcon className="w-6 h-6 text-teal-600 mb-2" />
                    <p className="font-medium text-teal-800">Sample Business Action</p>
                    <p className="text-xs text-teal-600">Review financials for cost savings</p>
                  </button>
                  
                  <button
                    onClick={() => createNewAction(
                      'discipleship',
                      'Pray with a colleague who mentioned stress',
                      'Tuesday lunch break',
                      'Prayer partner'
                    )}
                    className="p-4 bg-pink-50 hover:bg-pink-100 rounded-lg border-2 border-pink-300 text-left transition-all"
                  >
                    <HeartIcon className="w-6 h-6 text-pink-600 mb-2" />
                    <p className="font-medium text-pink-800">Sample Discipleship Action</p>
                    <p className="text-xs text-pink-600">Support a stressed colleague</p>
                  </button>
                </div>
              </div>
            )}

            {/* Current Actions */}
            {newActions.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-700">Your Actions for This Session:</h4>
                {newActions.map((action, index) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 rounded-lg p-4 flex items-start justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {action.action_type === 'business' ? (
                          <TargetIcon className="w-5 h-5 text-teal-600" />
                        ) : (
                          <HeartIcon className="w-5 h-5 text-pink-600" />
                        )}
                        <span className="font-medium text-gray-800">
                          {action.action_type === 'business' ? 'Business' : 'Discipleship'} Action
                        </span>
                      </div>
                      <p className="text-gray-700">{action.generated_statement}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Tell:</strong> {action.person_to_tell}
                      </p>
                    </div>
                    <button
                      onClick={() => setNewActions(prev => prev.filter(a => a.id !== action.id))}
                      className="text-red-500 hover:text-red-700 ml-4"
                    >
                      <XCircleIcon className="w-5 h-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}

            {newActions.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 bg-green-50 rounded-lg p-4 text-center"
              >
                <p className="text-green-700 mb-3">
                  ✅ Great! You've created {newActions.length} action{newActions.length > 1 ? 's' : ''}.
                </p>
                <button
                  onClick={() => {
                    alert('Actions saved! They will appear in your next session\'s Looking Back review.');
                    setView('menu');
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-bold"
                >
                  Complete Session
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Key Principles */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6"
          >
            <h3 className="font-bold text-indigo-800 mb-3">🎯 Creating Winnable Actions</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-indigo-700 mb-1">Make it Specific:</p>
                <p className="text-gray-600">Clear, concrete actions you can visualize doing</p>
              </div>
              <div>
                <p className="font-medium text-indigo-700 mb-1">Make it Timed:</p>
                <p className="text-gray-600">Schedule when and where it will happen</p>
              </div>
              <div>
                <p className="font-medium text-indigo-700 mb-1">Make it Accountable:</p>
                <p className="text-gray-600">Share with someone who will check on you</p>
              </div>
              <div>
                <p className="font-medium text-indigo-700 mb-1">Make it Achievable:</p>
                <p className="text-gray-600">Start small and build momentum</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return null;
}