// app/components/sections/LookingForward/LookingForwardSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, ChevronDown, ChevronRight, HelpCircle, X, Plus, Target, Heart, Users } from 'lucide-react';
import type { ActionCommitment, PathwayMode } from '../../../lib/types';

interface LookingForwardSectionProps {
  savedActions: ActionCommitment[];
  onSaveAction: (action: ActionCommitment) => void;
  pathwayMode: PathwayMode;
  sharingCommitment: string;
  setSharingCommitment: (value: string) => void;
  actionsLoaded: boolean;
  setSavedActions: React.Dispatch<React.SetStateAction<ActionCommitment[]>>;
  onMarkComplete: (section: string) => void;
  onNavigateTo: (path: string) => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

const LookingForwardSection: React.FC<LookingForwardSectionProps> = ({
  savedActions,
  onSaveAction,
  pathwayMode,
  sharingCommitment,
  setSharingCommitment,
  actionsLoaded,
  setSavedActions,
  onMarkComplete,
  onNavigateTo,
  isExpanded,
  onToggleExpanded
}) => {
  // State for help popups
  const [showHelp, setShowHelp] = useState<'business' | 'spiritual' | 'sharing' | null>(null);
  
  // State for creating new actions
  const [creatingBusinessAction, setCreatingBusinessAction] = useState(false);
  const [creatingSpiritualAction, setCreatingSpiritualAction] = useState(false);
  
  // Form states for simple action creation
  const [businessActionText, setBusinessActionText] = useState('');
  const [spiritualActionText, setSpiritualActionText] = useState('');

  // Calculate completion status
  const businessActions = savedActions.filter(action => action.type === 'business');
  const spiritualActions = savedActions.filter(action => action.type === 'discipleship' || action.type === 'spiritual_integration');
  
  const businessCompleted = businessActions.length >= 1;
  const spiritualCompleted = spiritualActions.length >= 1;
  const sharingCompleted = sharingCommitment.trim().length > 0;
  
  const completedCount = [businessCompleted, spiritualCompleted, sharingCompleted].filter(Boolean).length;
  const allThreeCompleted = completedCount === 3;

  // Auto-save sharing commitment
  useEffect(() => {
    if (sharingCommitment.trim().length > 0) {
      const saveTimeout = setTimeout(() => {
        try {
          localStorage.setItem('ibam_sharing_commitment_draft', sharingCommitment);
          console.log('💾 Sharing commitment auto-saved');
        } catch (error) {
          console.warn('Failed to save sharing commitment:', error);
        }
      }, 2000);
      return () => clearTimeout(saveTimeout);
    }
  }, [sharingCommitment]);

  // Simple action creation handlers
  const createBusinessAction = () => {
    if (!businessActionText.trim()) return;
    
    const newAction: ActionCommitment = {
      id: `business_${Date.now()}`,
      type: 'business',
      title: businessActionText,
      generatedStatement: businessActionText,
      createdAt: new Date().toISOString(),
      smartData: {
        specific: businessActionText,
        measurable: '',
        achievable: '',
        relevant: '',
        timed: 'this week'
      }
    };
    
    onSaveAction(newAction);
    setBusinessActionText('');
    setCreatingBusinessAction(false);
  };

  const createSpiritualAction = () => {
    if (!spiritualActionText.trim()) return;
    
    const newAction: ActionCommitment = {
      id: `spiritual_${Date.now()}`,
      type: 'spiritual_integration', // Changed from discipleship
      title: spiritualActionText,
      generatedStatement: spiritualActionText,
      createdAt: new Date().toISOString(),
      smartData: {
        specific: spiritualActionText,
        ministryMinded: '',
        achievable: '',
        relational: '',
        timed: 'this week'
      }
    };
    
    onSaveAction(newAction);
    setSpiritualActionText('');
    setCreatingSpiritualAction(false);
  };

  const deleteAction = (actionId: string) => {
    setSavedActions(prev => prev.filter(a => a.id !== actionId));
  };

  // Help popup content
  const helpContent = {
    business: {
      title: "Build Your Business",
      content: (
        <div>
          <p className="mb-3">What's one thing you can do this week to grow or improve your business?</p>
          <div className="mb-3">
            <p className="font-medium mb-2">Examples:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>"Call 3 new prospects"</li>
              <li>"Update my website prices"</li>
              <li>"Meet with my supplier"</li>
              <li>"Write a blog post"</li>
            </ul>
          </div>
          <p className="text-sm text-gray-600">Keep it simple and doable!</p>
        </div>
      )
    },
    spiritual: {
      title: "Life & Faith",
      content: (
        <div>
          <p className="mb-3">How can you bring your faith into your work or relationships this week?</p>
          <div className="mb-3">
            <p className="font-medium mb-2">Examples:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>"Pray for my team before big meetings"</li>
              <li>"Help a coworker who's struggling"</li>
              <li>"Be more patient with difficult customers"</li>
              <li>"Share encouragement with someone"</li>
            </ul>
          </div>
          <p className="text-sm text-gray-600">Small actions make big impact!</p>
        </div>
      )
    },
    sharing: {
      title: "Share Your Progress",
      content: (
        <div>
          <p className="mb-3">Who can you tell about what you're learning and doing?</p>
          <div className="mb-3">
            <p className="font-medium mb-2">This could be:</p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Your spouse or family</li>
              <li>A close friend</li>
              <li>A business partner</li>
              <li>Someone who encourages you</li>
            </ul>
          </div>
          <p className="text-sm text-gray-600">Teaching others helps you learn twice as much!</p>
        </div>
      )
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                {completedCount}/3 Complete: Plan your next steps
              </p>
            </div>
          </div>
          {isExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-6 bg-orange-50 space-y-6">
          
          {/* Part 1: Business Actions */}
          <div className={`border-2 rounded-lg p-5 transition-all ${
            businessCompleted 
              ? 'border-green-300 bg-green-50' 
              : 'border-blue-300 bg-blue-50 hover:bg-blue-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Target className="w-6 h-6 text-blue-600" />
                <h3 className="font-bold text-gray-800 text-lg">🏢 Business Action</h3>
                {businessCompleted && <span className="text-green-600 text-sm font-medium">✅ Done!</span>}
              </div>
              <button 
                className="text-blue-600 hover:text-blue-800 transition-colors" 
                onClick={() => setShowHelp('business')}
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            
            {businessCompleted ? (
              <div className="space-y-3">
                <div className="text-green-700 font-medium">
                  Great! You've created {businessActions.length} business action{businessActions.length > 1 ? 's' : ''}:
                </div>
                {businessActions.map((action, index) => (
                  <div key={action.id} className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{action.title || action.generatedStatement}</p>
                      </div>
                      <button
                        onClick={() => deleteAction(action.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {!creatingBusinessAction && (
                  <button
                    onClick={() => setCreatingBusinessAction(true)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add another business action
                  </button>
                )}
              </div>
            ) : (
              <div className="text-gray-600 mb-4">
                Create at least one action to grow your business this week
              </div>
            )}

            {(creatingBusinessAction || !businessCompleted) && (
              <div className="space-y-3">
                <textarea
                  value={businessActionText}
                  onChange={(e) => setBusinessActionText(e.target.value)}
                  placeholder="What's one thing you can do this week to grow your business? (e.g., 'Call 3 new prospects')"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={createBusinessAction}
                    disabled={!businessActionText.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                  >
                    Add Business Action
                  </button>
                  {creatingBusinessAction && (
                    <button
                      onClick={() => {
                        setCreatingBusinessAction(false);
                        setBusinessActionText('');
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Part 2: Life & Faith Actions */}
          <div className={`border-2 rounded-lg p-5 transition-all ${
            spiritualCompleted 
              ? 'border-green-300 bg-green-50' 
              : 'border-purple-300 bg-purple-50 hover:bg-purple-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Heart className="w-6 h-6 text-purple-600" />
                <h3 className="font-bold text-gray-800 text-lg">🙏 Life & Faith Action</h3>
                {spiritualCompleted && <span className="text-green-600 text-sm font-medium">✅ Done!</span>}
              </div>
              <button 
                className="text-purple-600 hover:text-purple-800 transition-colors" 
                onClick={() => setShowHelp('spiritual')}
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            
            {spiritualCompleted ? (
              <div className="space-y-3">
                <div className="text-green-700 font-medium">
                  Wonderful! You've created {spiritualActions.length} life & faith action{spiritualActions.length > 1 ? 's' : ''}:
                </div>
                {spiritualActions.map((action, index) => (
                  <div key={action.id} className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{action.title || action.generatedStatement}</p>
                      </div>
                      <button
                        onClick={() => deleteAction(action.id)}
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {!creatingSpiritualAction && (
                  <button
                    onClick={() => setCreatingSpiritualAction(true)}
                    className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add another life & faith action
                  </button>
                )}
              </div>
            ) : (
              <div className="text-gray-600 mb-4">
                Create at least one action to bring faith into your work or relationships
              </div>
            )}

            {(creatingSpiritualAction || !spiritualCompleted) && (
              <div className="space-y-3">
                <textarea
                  value={spiritualActionText}
                  onChange={(e) => setSpiritualActionText(e.target.value)}
                  placeholder="How can you bring faith into your work or relationships? (e.g., 'Pray for my team before meetings')"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent resize-none"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={createSpiritualAction}
                    disabled={!spiritualActionText.trim()}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium"
                  >
                    Add Life & Faith Action
                  </button>
                  {creatingSpiritualAction && (
                    <button
                      onClick={() => {
                        setCreatingSpiritualAction(false);
                        setSpiritualActionText('');
                      }}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Part 3: Share with Someone */}
          <div className={`border-2 rounded-lg p-5 transition-all ${
            sharingCompleted 
              ? 'border-green-300 bg-green-50' 
              : 'border-orange-300 bg-orange-100 hover:bg-orange-100'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-orange-600" />
                <h3 className="font-bold text-gray-800 text-lg">👥 Share with Someone</h3>
                {sharingCompleted && <span className="text-green-600 text-sm font-medium">✅ Done!</span>}
              </div>
              <button 
                className="text-orange-600 hover:text-orange-800 transition-colors" 
                onClick={() => setShowHelp('sharing')}
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="text-gray-600 mb-3">
                Who will you tell about what you're learning and your action plans?
              </div>
              <input 
                type="text" 
                placeholder="Enter a name (e.g., John, Sarah, my spouse, my business partner...)"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                value={sharingCommitment}
                onChange={(e) => setSharingCommitment(e.target.value)}
              />
              {sharingCompleted && (
                <div className="text-green-700 font-medium">
                  Perfect! You'll share your progress with {sharingCommitment}
                </div>
              )}
              <p className="text-sm text-gray-600">
                💡 Teaching others what you learn helps you remember it twice as well!
              </p>
            </div>
          </div>

          {/* Progress Summary & Complete Button */}
          <div className="bg-white rounded-lg border-2 border-gray-200 p-5">
            <div className="text-center mb-4">
              <h4 className="font-bold text-lg text-gray-800 mb-2">Your Progress</h4>
              <div className="flex justify-center gap-6 mb-4">
                <div className={`text-center ${businessCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className="text-2xl mb-1">{businessCompleted ? '✅' : '⚪'}</div>
                  <div className="text-xs font-medium">Business</div>
                </div>
                <div className={`text-center ${spiritualCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className="text-2xl mb-1">{spiritualCompleted ? '✅' : '⚪'}</div>
                  <div className="text-xs font-medium">Life & Faith</div>
                </div>
                <div className={`text-center ${sharingCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className="text-2xl mb-1">{sharingCompleted ? '✅' : '⚪'}</div>
                  <div className="text-xs font-medium">Share</div>
                </div>
              </div>
              <div className="text-lg font-bold text-gray-800">
                {completedCount}/3 Complete
              </div>
            </div>

            {allThreeCompleted ? (
              <div className="text-center">
                <div className="text-green-700 font-medium mb-3">
                  🎉 Excellent! All three parts completed. You're ready to move forward!
                </div>
                <button 
                  onClick={() => onMarkComplete('lookforward')}
                  className="bg-green-600 text-white px-8 py-4 rounded-lg hover:bg-green-700 transition-colors font-bold text-lg"
                >
                  ✅ Complete Looking Forward
                </button>
              </div>
            ) : (
              <div className="text-center text-gray-600">
                Complete all 3 parts to finish this section:
                <div className="mt-2 space-y-1 text-sm">
                  {!businessCompleted && <div>• Create at least 1 business action</div>}
                  {!spiritualCompleted && <div>• Create at least 1 life & faith action</div>}
                  {!sharingCompleted && <div>• Name someone to share with</div>}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Help Popup Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-gray-800">
                {helpContent[showHelp].title}
              </h3>
              <button 
                onClick={() => setShowHelp(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="text-gray-700">
              {helpContent[showHelp].content}
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowHelp(null)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LookingForwardSection;