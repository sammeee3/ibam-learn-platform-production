// app/components/sections/LookingForward/LookingForwardSection.tsx
'use client';

import { useState, useEffect } from 'react';
import { Lightbulb, ChevronDown, ChevronRight } from 'lucide-react';
import type { ActionCommitment, PathwayMode } from '../../../lib/types';
import ActionBuilderComponent from '../../actions/ActionBuilderComponent';

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
  const [sharingCommitmentSaved, setSharingCommitmentSaved] = useState(false);
  const [sharingCommitmentSaving, setSharingCommitmentSaving] = useState(false);

  // Auto-save sharing commitment
  useEffect(() => {
    if (sharingCommitment.trim().length > 0) {
      const saveTimeout = setTimeout(() => {
        try {
          localStorage.setItem('ibam_sharing_commitment_draft', sharingCommitment);
          console.log('💾 Sharing commitment auto-saved');
          setSharingCommitmentSaved(true);
          setTimeout(() => setSharingCommitmentSaved(false), 2000);
        } catch (error) {
          console.warn('Failed to save sharing commitment:', error);
        }
      }, 2000);

      return () => clearTimeout(saveTimeout);
    }
  }, [sharingCommitment]);

  // Manual save function for sharing commitment
  const handleManualSaveSharing = () => {
    if (!sharingCommitment.trim()) return;
    
    setSharingCommitmentSaving(true);
    try {
      localStorage.setItem('ibam_sharing_commitment_draft', sharingCommitment);
      localStorage.setItem('ibam_sharing_commitment_manual_save', Date.now().toString());
      console.log('💾 Sharing commitment manually saved');
      setSharingCommitmentSaved(true);
      setTimeout(() => {
        setSharingCommitmentSaved(false);
        setSharingCommitmentSaving(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to save sharing commitment:', error);
      setSharingCommitmentSaving(false);
    }
  };

  // Delete action handler
  const handleDeleteAction = (actionId: string) => {
    setSavedActions(prev => prev.filter(a => a.id !== actionId));
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
              <p className="text-orange-100">Action Planning + Commitments + Feedback</p>
            </div>
          </div>
          {isExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-6 bg-orange-50 space-y-8">
          {/* Action Builder Component - Now handles display of saved actions too */}
          <ActionBuilderComponent 
            savedActions={savedActions} 
            onSaveAction={onSaveAction}
            onDeleteAction={handleDeleteAction}
            pathwayMode={pathwayMode}
            maxActions={4}
          />

          {/* Sharing Commitment with Enhanced Save UI */}
          <div className="bg-indigo-50 rounded-lg p-6 border-l-4 border-indigo-400">
            <h4 className="font-bold text-indigo-800 mb-3">🤝 Multiplication Through Sharing</h4>
            <p className="text-gray-700 mb-4">
              One of the best ways to reinforce your learning is to share it with others. When you teach, you learn twice!
            </p>
            <div className="bg-white p-4 rounded border">
              <label className="block font-medium text-gray-700 mb-2">
                Who will you share today's key insights with this week? (Enter one name)
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={sharingCommitment}
                  onChange={(e) => setSharingCommitment(e.target.value)}
                  placeholder="e.g., John, Sarah, my spouse, my business partner..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
                <button
                  onClick={handleManualSaveSharing}
                  disabled={!sharingCommitment.trim() || sharingCommitmentSaving}
                  className={`px-4 py-3 rounded-lg font-medium transition-all ${
                    sharingCommitmentSaved
                      ? 'bg-green-600 text-white'
                      : sharingCommitmentSaving
                      ? 'bg-indigo-300 text-white cursor-wait'
                      : sharingCommitment.trim()
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {sharingCommitmentSaving ? (
                    <>⏳ Saving...</>
                  ) : sharingCommitmentSaved ? (
                    <>✅ Saved!</>
                  ) : (
                    <>💾 Save</>
                  )}
                </button>
              </div>
              <div className="flex justify-between items-center mt-3">
                <p className="text-sm text-gray-500">
                  💡 This person will appear in your next session's accountability check. Feel free to share with as many people as you want, 
                  but commit to at least this one conversation.
                </p>
                {sharingCommitment.trim() && !sharingCommitmentSaving && !sharingCommitmentSaved && (
                  <p className="text-xs text-indigo-600 ml-4">
                    Auto-saves in 2 seconds...
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Complete Button - Only show when there's at least one action */}
          {savedActions.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-green-700 mb-3">
                ✅ Great job! You've created {savedActions.length} action{savedActions.length > 1 ? 's' : ''}. 
                Ready to complete this section?
              </p>
              <button 
                onClick={() => onMarkComplete('lookforward')}
                className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors font-semibold"
              >
                ✅ Complete Looking Forward
              </button>
            </div>
          )}
          
          {/* Show reminder if no actions yet */}
          {savedActions.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
              <p className="text-yellow-800">
                ⚠️ Please create at least one action commitment before completing this section.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LookingForwardSection;