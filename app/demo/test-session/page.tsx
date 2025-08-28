'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Heart,
  Users,
  Briefcase,
  Lightbulb,
  Clock,
  User,
  AlertCircle,
  Star,
  Send,
  Circle,
  FileText,
  ChevronDown,
  ChevronRight,
  Sparkles,
  HandHeart,
  BookOpen,
  Play,
  MessageCircle,
  Target,
  Download,
  HelpCircle,
  Book,
  Zap,
  Link2,
  Bot,
  ExternalLink,
  X,
  CheckCircle2
} from 'lucide-react';

// Mock session data structure matching your real sessions
const SESSION_DATA = {
  module_id: 1,
  session_number: 3,
  title: "Leadership Through Service",
  description: "Discovering how to lead by serving others first",
  video_url: "https://vimeo.com/123456789",
  reading_content: `
    <h2>The Power of Servant Leadership</h2>
    <p>In today's business world, the most effective leaders are those who prioritize serving their teams and customers above their own interests. This biblical principle, exemplified by Jesus washing his disciples' feet, transforms organizations from the inside out.</p>
    
    <h3>Key Principles</h3>
    <ul>
      <li>Humility creates trust</li>
      <li>Service inspires loyalty</li>
      <li>Empowerment multiplies impact</li>
    </ul>
    
    <p>When we lead with a servant's heart, we create environments where people flourish, innovation thrives, and Kingdom impact multiplies. This isn't just good theology—it's good business.</p>
  `,
  quiz_questions: [
    {
      question: "What is the foundation of servant leadership?",
      options: ["Power", "Humility", "Authority", "Control"],
      correct: 1
    },
    {
      question: "How does serving others impact your business?",
      options: ["Decreases profit", "Creates loyalty", "Reduces efficiency", "Limits growth"],
      correct: 1
    }
  ],
  scripture: {
    reference: "Mark 10:43-45",
    text: "Whoever wants to become great among you must be your servant, and whoever wants to be first must be slave of all."
  }
};

export default function TestSessionTemplate() {
  const [currentSection, setCurrentSection] = useState('overview');
  
  // Debug: Log section changes
  useEffect(() => {
    console.log('Current section changed to:', currentSection);
  }, [currentSection]);
  
  const [sectionProgress, setSectionProgress] = useState({
    lookback: false,
    lookup: false,
    reading: false,
    video: false,
    quiz: false,
    lookforward: false
  });
  
  // Grace-based enhancements state
  const [previousActions, setPreviousActions] = useState([
    {
      id: '1',
      type: 'business',
      description: 'Meet with team members individually to understand their goals',
      completed: false,
      deferrals: 0,
      kingdomPurpose: 'Serving others by listening first'
    },
    {
      id: '2',
      type: 'personal',
      description: 'Pray for wisdom in upcoming client negotiations',
      completed: false,
      deferrals: 1,
      kingdomPurpose: 'Seeking God\'s guidance in business'
    }
  ]);
  
  const [newActions, setNewActions] = useState([]);
  const [showKingdomFilter, setShowKingdomFilter] = useState(false);
  const [actionBalance, setActionBalance] = useState({ business: 0, personal: 0 });
  const [showGraceRelease, setShowGraceRelease] = useState(false);
  const [overallProgress, setOverallProgress] = useState(35);
  const [sessionStreak, setSessionStreak] = useState(3);
  const [showCelebration, setShowCelebration] = useState(false);

  // Calculate progress
  useEffect(() => {
    const completed = Object.values(sectionProgress).filter(Boolean).length;
    const total = Object.keys(sectionProgress).length;
    setOverallProgress(Math.round((completed / total) * 100));
  }, [sectionProgress]);

  const markSectionComplete = (section) => {
    setSectionProgress(prev => ({ ...prev, [section]: true }));
    if (!sectionProgress[section]) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  // OVERVIEW SECTION
  if (currentSection === 'overview') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => window.history.back()}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <p className="text-sm text-gray-500">Module 1 • Session 3</p>
                  <h1 className="text-2xl font-bold text-gray-800">Leadership Through Service</h1>
                </div>
              </div>
              <div className="flex items-center gap-6">
                {/* Grace Enhancement: Streak Indicator */}
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 rounded-full">
                  <Zap className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">{sessionStreak} day streak</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Progress</p>
                    <p className="text-lg font-bold text-gray-800">{overallProgress}%</p>
                  </div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                      style={{ width: `${overallProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                <h3 className="font-semibold text-gray-800 mb-4">Session Flow</h3>
                <div className="space-y-2">
                  {[
                    { id: 'lookback', icon: Clock, label: 'Looking Back', time: '10 min' },
                    { id: 'lookup', icon: BookOpen, label: 'Looking Up', time: '5 min' },
                    { id: 'reading', icon: FileText, label: 'Main Content', time: '15 min' },
                    { id: 'video', icon: Play, label: 'Video Teaching', time: '20 min' },
                    { id: 'quiz', icon: HelpCircle, label: 'Knowledge Check', time: '5 min' },
                    { id: 'lookforward', icon: Target, label: 'Looking Forward', time: '10 min' }
                  ].map(section => (
                    <button
                      key={section.id}
                      onClick={() => setCurrentSection(section.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        sectionProgress[section.id]
                          ? 'bg-green-50 border border-green-200'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        sectionProgress[section.id] ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <section.icon className={`w-4 h-4 ${
                          sectionProgress[section.id] ? 'text-green-600' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-gray-800">{section.label}</p>
                        <p className="text-xs text-gray-500">{section.time}</p>
                      </div>
                      {sectionProgress[section.id] && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Grace Enhancement: Session Type Indicator */}
                <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm font-medium text-purple-700">Session Focus</p>
                  <p className="text-xs text-purple-600 mt-1">
                    70% Business Excellence • 30% Kingdom Purpose
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Welcome Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-10 h-10 text-purple-600" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">
                    Welcome to Session 3
                  </h2>
                  <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    {SESSION_DATA.description}
                  </p>
                </div>

                {/* What You\'ll Learn */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">What You\'ll Learn</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">How servant leadership transforms organizations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">Biblical principles for business excellence</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-700">Practical steps to implement immediately</span>
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
                  onClick={() => setCurrentSection('lookback')}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors"
                >
                  Begin Session →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Celebration Animation */}
        {showCelebration && (
          <div className="fixed top-20 right-6 bg-green-100 border border-green-300 rounded-lg p-4 shadow-lg animate-bounce">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-700">Section Complete! Great progress!</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // LOOKING BACK SECTION
  if (currentSection === 'lookback') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCurrentSection('overview')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <p className="text-sm text-gray-500">Module 1 • Session 3</p>
                  <h1 className="text-2xl font-bold text-gray-800">Looking Back</h1>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Section 1 of 6
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Your Previous Commitments</h2>
              <p className="text-gray-600">
                Let\'s celebrate your progress and learn from your experiences.
              </p>
              
              {/* Grace Enhancement: Encouragement Message */}
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-700 text-sm">
                  ✨ Remember: Every attempt is growth. Progress over perfection!
                </p>
              </div>
            </div>

            {/* Previous Actions */}
            <div className="space-y-4">
              {previousActions.map(action => (
                <div key={action.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {action.type === 'business' ? (
                          <Briefcase className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Heart className="w-5 h-5 text-purple-600" />
                        )}
                        <span className="font-semibold capitalize">{action.type} Action</span>
                        {action.deferrals > 0 && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded">
                            Deferred {action.deferrals}x
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-2">{action.description}</p>
                      
                      {/* Grace Enhancement: Show Kingdom Purpose */}
                      {action.kingdomPurpose && (
                        <div className="flex items-start gap-2 mt-3 p-3 bg-purple-50 rounded">
                          <HandHeart className="w-4 h-4 text-purple-600 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-purple-700">Kingdom Purpose:</p>
                            <p className="text-sm text-purple-600">{action.kingdomPurpose}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Status Buttons */}
                  {!action.completed && (
                    <div>
                      {action.deferrals >= 2 ? (
                        // Grace Release after 2 deferrals
                        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg mb-4">
                          <div className="flex items-start gap-2 mb-3">
                            <HandHeart className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="font-medium text-purple-700">Time for Grace</p>
                              <p className="text-sm text-purple-600">
                                This has been deferred twice. It\'s okay to release it and move forward.
                              </p>
                              <p className="text-xs text-purple-500 mt-2 italic">
                                "My grace is sufficient for you" - 2 Corinthians 12:9
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setShowGraceRelease(true);
                              setTimeout(() => setShowGraceRelease(false), 3000);
                            }}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                          >
                            Release with Grace
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              action.completed = true;
                              setShowCelebration(true);
                              setTimeout(() => setShowCelebration(false), 3000);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
                            <Lightbulb className="w-4 h-4" />
                            Learned Something
                          </button>
                          <button 
                            onClick={() => {
                              action.deferrals += 1;
                              setPreviousActions([...previousActions]);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Clock className="w-4 h-4" />
                            Defer to Next Week
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Continue Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  markSectionComplete('lookback');
                  setCurrentSection('lookup');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
              >
                Continue to Looking Up
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Grace Release Notification */}
        {showGraceRelease && (
          <div className="fixed bottom-6 right-6 bg-purple-100 border border-purple-300 rounded-lg p-4 shadow-lg">
            <div className="flex items-center gap-2">
              <HandHeart className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-700">Released with grace. Fresh start ahead!</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // LOOKING UP SECTION
  if (currentSection === 'lookup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCurrentSection('overview')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <p className="text-sm text-gray-500">Module 1 • Session 3</p>
                  <h1 className="text-2xl font-bold text-gray-800">Looking Up</h1>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Section 2 of 6
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-10 h-10 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Scripture & Prayer</h2>
              
              {/* Scripture Display */}
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 mb-6 max-w-2xl mx-auto">
                <p className="text-lg text-gray-800 mb-3 italic">
                  "{SESSION_DATA.scripture.text}"
                </p>
                <p className="text-sm text-purple-600 font-medium">
                  — {SESSION_DATA.scripture.reference}
                </p>
              </div>

              {/* Grace Enhancement: Personal Reflection */}
              <div className="text-left max-w-2xl mx-auto">
                <h3 className="font-semibold text-gray-800 mb-3">Personal Reflection</h3>
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">How does this scripture apply to your business this week?</p>
                    <textarea 
                      className="w-full p-3 border border-gray-200 rounded-lg text-sm"
                      rows="3"
                      placeholder="Type your thoughts..."
                    />
                  </div>
                </div>
              </div>

              {/* Prayer */}
              <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Let\'s Pray</h3>
                <p className="text-gray-600 italic">
                  Lord, help us to lead as You led—with humility, service, and love. 
                  Show us how to apply these truths in our work this week. 
                  Give us courage to serve when it\'s easier to demand, 
                  and wisdom to see Your kingdom purposes in our daily tasks. 
                  In Jesus\' name, Amen.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  markSectionComplete('lookup');
                  setCurrentSection('reading');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
              >
                Continue to Reading
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LOOKING FORWARD SECTION  
  if (currentSection === 'lookforward') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCurrentSection('overview')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <p className="text-sm text-gray-500">Module 1 • Session 3</p>
                  <h1 className="text-2xl font-bold text-gray-800">Looking Forward</h1>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                Section 6 of 6
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Action Commitments</h2>
              <p className="text-gray-600">
                Based on what you\'ve learned, what specific actions will you take this week?
              </p>
              
              {/* Grace Enhancement: Balance Indicator */}
              <div className="mt-4 flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">Business Actions: {actionBalance.business}/2</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-purple-600" />
                    <span className="text-sm">Kingdom Actions: {actionBalance.personal}/2</span>
                  </div>
                </div>
                {actionBalance.business > actionBalance.personal && (
                  <p className="text-xs text-purple-600">Consider adding a Kingdom action for balance</p>
                )}
              </div>
            </div>

            {/* Grace Enhancement: Kingdom Filter (optional) */}
            {newActions.length >= 2 && !showKingdomFilter && (
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
                  {[
                    'Does this action honor God?',
                    'Will this serve others, not just myself?',
                    'Am I being led by faith or fear?',
                    'Does this align with my calling?'
                  ].map((question, index) => (
                    <label key={index} className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-purple-600" />
                      <span className="text-gray-700">{question}</span>
                    </label>
                  ))}
                </div>
                <p className="mt-4 text-sm text-purple-600 italic">
                  "Commit to the Lord whatever you do, and he will establish your plans." - Proverbs 16:3
                </p>
              </div>
            )}

            {/* Action Builder */}
            <div className="space-y-4 mb-6">
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setNewActions([...newActions, { type: 'business', description: '', kingdomPurpose: '' }]);
                    setActionBalance(prev => ({ ...prev, business: prev.business + 1 }));
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                  disabled={actionBalance.business >= 2}
                >
                  <Briefcase className="w-5 h-5" />
                  Add Business Action
                </button>
                <button
                  onClick={() => {
                    setNewActions([...newActions, { type: 'personal', description: '', kingdomPurpose: '' }]);
                    setActionBalance(prev => ({ ...prev, personal: prev.personal + 1 }));
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                  disabled={actionBalance.personal >= 2}
                >
                  <Heart className="w-5 h-5" />
                  Add Kingdom Action
                </button>
              </div>

              {/* Action Input Cards */}
              {newActions.map((action, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {action.type === 'business' ? (
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    ) : (
                      <Heart className="w-5 h-5 text-purple-600" />
                    )}
                    <span className="font-semibold">
                      {action.type === 'business' ? 'Business' : 'Kingdom'} Action {index + 1}
                    </span>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        What specific action will you take?
                      </label>
                      <textarea 
                        className="w-full p-3 border border-gray-200 rounded-lg"
                        rows="2"
                        placeholder="Be specific and measurable..."
                        onChange={(e) => {
                          newActions[index].description = e.target.value;
                          setNewActions([...newActions]);
                        }}
                      />
                    </div>
                    
                    {/* Grace Enhancement: Kingdom Purpose Field */}
                    <div>
                      <label className="block text-sm font-medium text-purple-700 mb-1">
                        How does this serve God\'s kingdom? (optional but encouraged)
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 border border-purple-200 rounded-lg bg-purple-50"
                        placeholder="Kingdom purpose..."
                        onChange={(e) => {
                          newActions[index].kingdomPurpose = e.target.value;
                          setNewActions([...newActions]);
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          When will you complete this?
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-200 rounded-lg"
                          placeholder="By Friday 5pm..."
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Who will you tell?
                        </label>
                        <input
                          type="text"
                          className="w-full p-2 border border-gray-200 rounded-lg"
                          placeholder="Accountability partner..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Grace Enhancement: Gentle Guidance */}
            {(actionBalance.business + actionBalance.personal) >= 4 && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700 text-sm">
                  💡 Consider focusing on 2-4 actions for better follow-through. Quality over quantity!
                </p>
              </div>
            )}

            {/* Submit Section */}
            <div className="border-t pt-6">
              <button
                onClick={() => {
                  markSectionComplete('lookforward');
                  setShowCelebration(true);
                  alert('Session Complete! Your actions have been saved.');
                }}
                className="w-full py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700"
              >
                Commit These Actions & Complete Session
              </button>
              
              {/* Grace Enhancement: Prayer Option */}
              <p className="text-center text-sm text-gray-500 mt-4">
                Your commitments will be saved and you\'ll review them next session
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // READING SECTION (simplified for demo)
  if (currentSection === 'reading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCurrentSection('overview')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <p className="text-sm text-gray-500">Module 1 • Session 3</p>
                  <h1 className="text-2xl font-bold text-gray-800">Main Content</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: SESSION_DATA.reading_content }}
            />
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  markSectionComplete('reading');
                  setCurrentSection('video');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
              >
                Continue to Video
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIDEO SECTION (simplified)
  if (currentSection === 'video') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCurrentSection('overview')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <p className="text-sm text-gray-500">Module 1 • Session 3</p>
                  <h1 className="text-2xl font-bold text-gray-800">Video Teaching</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center mb-6">
              <Play className="w-16 h-16 text-gray-400" />
            </div>
            
            <h3 className="font-bold text-gray-800 mb-4">Video Notes</h3>
            <textarea 
              className="w-full p-4 border border-gray-200 rounded-lg"
              rows="4"
              placeholder="Take notes as you watch..."
            />
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  markSectionComplete('video');
                  setCurrentSection('quiz');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
              >
                Continue to Quiz
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // QUIZ SECTION (simplified)
  if (currentSection === 'quiz') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setCurrentSection('overview')}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <p className="text-sm text-gray-500">Module 1 • Session 3</p>
                  <h1 className="text-2xl font-bold text-gray-800">Knowledge Check</h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {SESSION_DATA.quiz_questions.map((q, index) => (
              <div key={index} className="mb-6">
                <p className="font-medium text-gray-800 mb-3">{index + 1}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((option, optIndex) => (
                    <label key={optIndex} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input type="radio" name={`question-${index}`} className="w-4 h-4" />
                      <span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => {
                  markSectionComplete('quiz');
                  setCurrentSection('lookforward');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
              >
                Submit & Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}