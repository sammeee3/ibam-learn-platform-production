// app/components/actions/ActionBuilderComponent.tsx
'use client';

import { useState } from 'react';
import { Target, Heart, X, HelpCircle } from 'lucide-react';
import type { ActionCommitment, PathwayMode } from '../../lib/types';

interface ActionBuilderComponentProps {
  savedActions: ActionCommitment[];
  onSaveAction: (action: ActionCommitment) => void;
  pathwayMode: PathwayMode;
}

const ActionBuilderComponent: React.FC<ActionBuilderComponentProps> = ({ 
  savedActions, 
  onSaveAction, 
  pathwayMode 
}) => {
  const [actionType, setActionType] = useState<'business' | 'discipleship' | ''>('');
  const [helpPopup, setHelpPopup] = useState({
    isOpen: false,
    title: '',
    content: ''
  });
  const [accountabilityPartner, setAccountabilityPartner] = useState('');
    
  const [businessForm, setBusinessForm] = useState({
    specific: '',
    measurable: '',
    achievable: '',
    relevant: '',
    timed: ''
  });
    
  const [discipleshipForm, setDiscipleshipForm] = useState({
    specific: '',
    ministryMinded: '',
    achievable: '',
    relational: '',
    timed: ''
  });

  const helpContent = {
    'business-specific': {
      title: 'Making Business Actions Specific',
      content: `
        <p><strong>✅ Good Example:</strong> "Call 5 potential customers to discuss their biggest business challenges and document responses in CRM"</p>
        <p><strong>❌ Poor Example:</strong> "Do some marketing"</p>
        <p><strong>Tips:</strong></p>
        <ul>
          <li>Include numbers when possible (how many, how much)</li>
          <li>Name specific people or types of people</li>
          <li>Describe the exact action you'll take</li>
          <li>Include where you'll document or track results</li>
        </ul>
      `
    },
    'disciple-specific': {
      title: 'Specific Discipleship Actions',
      content: `
        <p><strong>✅ Good Example:</strong> "Have coffee with Sarah from accounting and ask about her family and work stress"</p>
        <p><strong>❌ Poor Example:</strong> "Be more spiritual at work"</p>
        <p><strong>Tips:</strong></p>
        <ul>
          <li>Name the specific person you'll connect with</li>
          <li>Plan specific conversation topics or questions</li>
          <li>Focus on building the relationship first</li>
          <li>Look for natural opportunities to share your faith journey</li>
        </ul>
      `
    }
  };

  const showHelp = (type: string) => {
    const help = helpContent[type as keyof typeof helpContent];
    if (help) {
      setHelpPopup({ isOpen: true, title: help.title, content: help.content });
    }
  };

  const handleSave = () => {
    if (!actionType) return;

    const newAction: ActionCommitment = {
      id: `action_${Date.now()}`,
      type: actionType,
      smartData: actionType === 'business' ? businessForm : discipleshipForm,
      generatedStatement: generateActionStatement(),
      completed: false
    };

    onSaveAction(newAction);
    
    if (actionType === 'business') {
      setBusinessForm({ specific: '', measurable: '', achievable: '', relevant: '', timed: '' });
    } else {
      setDiscipleshipForm({ specific: '', ministryMinded: '', achievable: '', relational: '', timed: '' });
    }
    setActionType('');
  };

  const generateActionStatement = (): string => {
    if (actionType === 'business') {
      return `I will ${businessForm.specific} ${businessForm.timed ? '| When: ' + businessForm.timed : ''}`;
    } else {
      return `I will ${discipleshipForm.specific} ${discipleshipForm.timed ? '| When: ' + discipleshipForm.timed : ''}`;
    }
  };

  const HelpPopup = ({ isOpen, onClose, title, content }: {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    content: string;
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
          <div className="mt-4 text-center">
            <button 
              onClick={onClose}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              💡 Got it!
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6">
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">
          {pathwayMode === 'individual' ? 'Create Your Action Commitments' : 'Create Group Action Commitments'}
        </h4>
        <p className="text-gray-600">
          {pathwayMode === 'individual' 
            ? 'Transform today\'s learning into specific, achievable actions. Choose at least 1 action, up to 4 total.'
            : 'Work with your group to create action commitments with built-in accountability. Each person should have at least 1 action.'
          }
        </p>
      </div>

      {/* Accountability Section - Different for Individual vs Group */}
      {pathwayMode === 'small_group' && (
        <div className="mb-6 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h5 className="font-semibold text-purple-800 mb-3">👥 Group Accountability Setup</h5>
          <div className="space-y-3">
            <div>
              <label className="block font-medium text-gray-700 mb-1">Your Accountability Partner from Today's Group:</label>
              <input
                type="text"
                value={accountabilityPartner}
                onChange={(e) => setAccountabilityPartner(e.target.value)}
                placeholder="Name and contact info of your partner..."
                className="w-full p-3 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="text-sm text-gray-600">
              💡 <strong>Group Rule:</strong> Your accountability partner will check in with you mid-week about your action commitments. 
              Be specific so they know exactly how to help you succeed!
            </div>
          </div>
        </div>
      )}

      {/* Action Type Selector */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={() => setActionType('business')}
          className={`p-4 rounded-xl border-2 transition-all ${
            actionType === 'business'
              ? 'border-teal-400 bg-teal-50 text-teal-800'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
        >
          <Target className="w-8 h-8 mx-auto mb-2" />
          <div className="font-semibold">Business Action</div>
          <div className="text-xs">Classic SMART format</div>
        </button>
        
        <button
          onClick={() => setActionType('discipleship')}
          className={`p-4 rounded-xl border-2 transition-all ${
            actionType === 'discipleship'
              ? 'border-teal-400 bg-teal-50 text-teal-800'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
          }`}
        >
          <Heart className="w-8 h-8 mx-auto mb-2" />
          <div className="font-semibold">Discipleship Action</div>
          <div className="text-xs">Faith-driven SMART format</div>
        </button>
      </div>

      {/* Business SMART Form */}
      {actionType === 'business' && (
        <div className="bg-white rounded-lg p-6 border">
          <h5 className="font-semibold text-gray-800 mb-4">💼 Business Action Builder</h5>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                📝 <strong>S</strong>pecific: What exactly will you do?
                <button 
                  onClick={() => showHelp('business-specific')}
                  className="w-5 h-5 bg-teal-400 text-white rounded-full flex items-center justify-center text-xs hover:bg-teal-500"
                >
                  ?
                </button>
              </label>
              <input
                type="text"
                value={businessForm.specific}
                onChange={(e) => setBusinessForm(prev => ({ ...prev, specific: e.target.value }))}
                placeholder="e.g., Call 5 potential customers to discuss their biggest business challenges"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                📊 <strong>M</strong>easurable: How will you know it's done?
              </label>
              <input
                type="text"
                value={businessForm.measurable}
                onChange={(e) => setBusinessForm(prev => ({ ...prev, measurable: e.target.value }))}
                placeholder="e.g., Complete all 5 calls and document their responses in CRM"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                ⏰ <strong>T</strong>ime-bound: When will you do this?
              </label>
              <input
                type="text"
                value={businessForm.timed}
                onChange={(e) => setBusinessForm(prev => ({ ...prev, timed: e.target.value }))}
                placeholder="e.g., Wednesday and Thursday between 2-4 PM from my office"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>

            {/* Action Preview */}
            {(businessForm.specific || businessForm.timed) && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <h6 className="font-semibold text-green-800 mb-2">📋 Your Action Preview:</h6>
                <p className="text-green-700">
                  💼 <strong>Business Action:</strong> {businessForm.specific} 
                  {businessForm.timed && (
                    <span> | <strong>When:</strong> {businessForm.timed}</span>
                  )}
                </p>
                {pathwayMode === 'small_group' && accountabilityPartner && (
                  <p className="text-green-600 text-sm mt-2">
                    👥 <strong>Accountability Partner:</strong> {accountabilityPartner}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Discipleship SMART Form */}
      {actionType === 'discipleship' && (
        <div className="bg-white rounded-lg p-6 border">
          <h5 className="font-semibold text-gray-800 mb-4">❤️ Discipleship Action Builder</h5>
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                👥 <strong>S</strong>pecific: What exactly will you do, with whom?
                <button 
                  onClick={() => showHelp('disciple-specific')}
                  className="w-5 h-5 bg-teal-400 text-white rounded-full flex items-center justify-center text-xs hover:bg-teal-500"
                >
                  ?
                </button>
              </label>
              <input
                type="text"
                value={discipleshipForm.specific}
                onChange={(e) => setDiscipleshipForm(prev => ({ ...prev, specific: e.target.value }))}
                placeholder="e.g., Have coffee with Sarah from accounting and ask about her family and work stress"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                💒 <strong>M</strong>inistry-minded: How might this open spiritual conversations?
              </label>
              <input
                type="text"
                value={discipleshipForm.ministryMinded}
                onChange={(e) => setDiscipleshipForm(prev => ({ ...prev, ministryMinded: e.target.value }))}
                placeholder="e.g., Listen for opportunities to share how prayer helps me handle work stress"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 font-medium text-gray-700 mb-2">
                ⏰ <strong>T</strong>imed: When and where will this happen?
              </label>
              <input
                type="text"
                value={discipleshipForm.timed}
                onChange={(e) => setDiscipleshipForm(prev => ({ ...prev, timed: e.target.value }))}
                placeholder="e.g., Friday at 3 PM at the coffee shop near our office"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-400 focus:border-transparent"
              />
            </div>

            {/* Action Preview */}
            {(discipleshipForm.specific || discipleshipForm.timed) && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <h6 className="font-semibold text-green-800 mb-2">📋 Your Action Preview:</h6>
                <p className="text-green-700">
                  ❤️ <strong>Discipleship Action:</strong> {discipleshipForm.specific} 
                  {discipleshipForm.timed && (
                    <span> | <strong>When:</strong> {discipleshipForm.timed}</span>
                  )}
                </p>
                {pathwayMode === 'small_group' && accountabilityPartner && (
                  <p className="text-green-600 text-sm mt-2">
                    👥 <strong>Accountability Partner:</strong> {accountabilityPartner}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Button */}
      {actionType && (
        <div className="flex gap-4 mt-6">
          <button
            onClick={handleSave}
            disabled={!actionType || (actionType === 'business' && !businessForm.specific) || (actionType === 'discipleship' && !discipleshipForm.specific)}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✅ Save This Action
          </button>
          
          {savedActions.length < 4 && savedActions.length > 0 && (
            <button 
              onClick={() => setActionType('')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              ➕ Add Another Action
            </button>
          )}
        </div>
      )}

      <HelpPopup 
        isOpen={helpPopup.isOpen}
        onClose={() => setHelpPopup(prev => ({ ...prev, isOpen: false }))}
        title={helpPopup.title}
        content={helpPopup.content}
      />
    </div>
  );
};

export default ActionBuilderComponent;