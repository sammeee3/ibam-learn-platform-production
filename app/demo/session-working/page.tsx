'use client';

import { useState } from 'react';
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Heart,
  Briefcase,
  Lightbulb,
  Clock,
  BookOpen,
  Play,
  Target,
  HelpCircle,
  FileText,
  Sparkles,
  HandHeart
} from 'lucide-react';

export default function SessionWorking() {
  const [currentSection, setCurrentSection] = useState('overview');
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [actionBalance, setActionBalance] = useState({ business: 0, personal: 0 });
  const [showKingdomFilter, setShowKingdomFilter] = useState(false);
  const [newActions, setNewActions] = useState<any[]>([]);

  const handleSectionChange = (section: string) => {
    console.log('Changing to section:', section);
    setCurrentSection(section);
  };

  const markComplete = (section: string) => {
    if (!completedSections.includes(section)) {
      setCompletedSections([...completedSections, section]);
    }
  };

  const renderSection = () => {
    switch(currentSection) {
      case 'overview':
        return (
          <div>
            {/* Session Overview */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 mb-4">
                Module 1, Session 3
              </h1>
              <h2 className="text-xl text-gray-600 mb-6">
                Leadership Through Service
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mb-8">
                Discover how servant leadership transforms organizations and learn practical steps 
                to implement these biblical principles in your business.
              </p>
            </div>

            {/* What You\'ll Learn */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">What You\'ll Learn</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>How servant leadership transforms organizations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>Biblical principles for business excellence</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span>Practical steps to implement immediately</span>
                </li>
              </ul>
            </div>

            {/* Grace Enhancement: Kingdom Connection */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <HandHeart className="w-6 h-6 text-purple-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Kingdom Connection</h3>
                  <p className="text-gray-600 text-sm">
                    This session connects your business calling with God\'s kingdom purposes. 
                    As you learn, consider how each principle can serve both excellence and eternal impact.
                  </p>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={() => handleSectionChange('lookback')}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700"
            >
              Begin Session →
            </button>
          </div>
        );

      case 'lookback':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Looking Back</h2>
            <p className="text-gray-600 mb-6">
              Review your commitments from the previous session.
            </p>
            
            {/* Grace Enhancement: Encouragement */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-6">
              <p className="text-green-700 text-sm">
                ✨ Remember: Every attempt is growth. Progress over perfection!
              </p>
            </div>

            {/* Previous Actions */}
            <div className="space-y-4 mb-8">
              <div className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold">Business Action</span>
                </div>
                <p className="text-gray-700 mb-3">
                  Meet with team members individually to understand their goals
                </p>
                
                {/* Kingdom Purpose (Grace Enhancement) */}
                <div className="p-3 bg-purple-50 rounded mb-4">
                  <p className="text-xs font-medium text-purple-700">Kingdom Purpose:</p>
                  <p className="text-sm text-purple-600">Serving others by listening first</p>
                </div>

                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                    ✓ Complete
                  </button>
                  <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">
                    💡 Learning
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    → Defer
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                markComplete('lookback');
                handleSectionChange('lookup');
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
            >
              Continue to Looking Up →
            </button>
          </div>
        );

      case 'lookup':
        return (
          <div>
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Looking Up</h2>
              
              {/* Scripture */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6 max-w-2xl mx-auto">
                <p className="text-lg text-gray-800 mb-3 italic">
                  "Whoever wants to become great among you must be your servant, 
                  and whoever wants to be first must be slave of all."
                </p>
                <p className="text-sm text-purple-600 font-medium">
                  — Mark 10:43-45
                </p>
              </div>

              {/* Prayer */}
              <div className="bg-blue-50 rounded-lg p-6 max-w-2xl mx-auto">
                <h3 className="font-semibold text-gray-800 mb-3">Let\'s Pray</h3>
                <p className="text-gray-600 italic">
                  Lord, help us to lead as You led—with humility, service, and love. 
                  Show us how to apply these truths in our work this week. 
                  In Jesus\' name, Amen.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => {
                  markComplete('lookup');
                  handleSectionChange('lookforward');
                }}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
              >
                Continue to Looking Forward →
              </button>
            </div>
          </div>
        );

      case 'lookforward':
        return (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Looking Forward</h2>
            <p className="text-gray-600 mb-6">
              What specific actions will you take this week?
            </p>
            
            {/* Grace Enhancement: Balance Indicator */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Business: {actionBalance.business}/2</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-purple-600" />
                  <span className="text-sm">Kingdom: {actionBalance.personal}/2</span>
                </div>
              </div>
              {actionBalance.business > actionBalance.personal && (
                <p className="text-xs text-purple-600">Consider Kingdom balance</p>
              )}
            </div>

            {/* Kingdom Filter (Grace Enhancement) */}
            {!showKingdomFilter && newActions.length >= 2 && (
              <button
                onClick={() => setShowKingdomFilter(true)}
                className="w-full mb-6 p-4 border-2 border-dashed border-purple-300 rounded-lg text-purple-600 hover:bg-purple-50"
              >
                🙏 Open Kingdom Purpose Check (Recommended)
              </button>
            )}

            {showKingdomFilter && (
              <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
                <h3 className="font-bold text-gray-800 mb-4">Before Committing, Check Your Heart:</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Does this honor God?</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Will this serve others?</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>Am I being led by faith not fear?</span>
                  </label>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => {
                  setNewActions([...newActions, { type: 'business' }]);
                  setActionBalance(prev => ({ ...prev, business: prev.business + 1 }));
                }}
                className="flex-1 px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
              >
                + Business Action
              </button>
              <button
                onClick={() => {
                  setNewActions([...newActions, { type: 'personal' }]);
                  setActionBalance(prev => ({ ...prev, personal: prev.personal + 1 }));
                }}
                className="flex-1 px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
              >
                + Kingdom Action
              </button>
            </div>

            {/* Action Forms */}
            {newActions.map((action, index) => (
              <div key={index} className="border rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  {action.type === 'business' ? 
                    <Briefcase className="w-5 h-5 text-blue-600" /> : 
                    <Heart className="w-5 h-5 text-purple-600" />
                  }
                  <span className="font-semibold">
                    {action.type === 'business' ? 'Business' : 'Kingdom'} Action
                  </span>
                </div>
                <textarea 
                  className="w-full p-3 border rounded mb-3"
                  placeholder="What specific action will you take?"
                  rows={2}
                />
                <input
                  type="text"
                  className="w-full p-3 border border-purple-200 rounded bg-purple-50"
                  placeholder="Kingdom purpose? (optional but encouraged)"
                />
              </div>
            ))}

            {/* Complete Button */}
            <button
              onClick={() => {
                alert('Session Complete! Your actions have been saved with grace and purpose.');
                markComplete('lookforward');
                handleSectionChange('overview');
              }}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700"
            >
              Commit These Actions & Complete Session
            </button>
          </div>
        );

      default:
        return <div>Unknown section</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-800">Session Template Demo</h1>
            </div>
            <div className="text-sm text-gray-500">
              Current: {currentSection}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-6">
              <h3 className="font-semibold mb-4">Session Flow</h3>
              <div className="space-y-2">
                {['overview', 'lookback', 'lookup', 'lookforward'].map(section => (
                  <button
                    key={section}
                    onClick={() => handleSectionChange(section)}
                    className={`w-full text-left px-3 py-2 rounded capitalize ${
                      currentSection === section 
                        ? 'bg-blue-600 text-white' 
                        : completedSections.includes(section)
                        ? 'bg-green-100 text-green-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{section === 'lookback' ? 'Looking Back' : 
                             section === 'lookup' ? 'Looking Up' :
                             section === 'lookforward' ? 'Looking Forward' :
                             'Overview'}</span>
                      {completedSections.includes(section) && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              {/* Grace Enhancement */}
              <div className="mt-6 p-3 bg-purple-50 rounded">
                <p className="text-xs text-purple-700">
                  <Sparkles className="w-3 h-3 inline mr-1" />
                  Grace-enhanced session
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-8">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}