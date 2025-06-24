'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface SessionPageProps {
  // Props from your existing platform
}

interface CompletedSection {
  lookback: boolean;
  lookup: boolean;
  lookforward: boolean;
}

interface SessionData {
  weeklyCommitment?: string;
  multiplicationTarget?: string;
  businessPlanAnswer?: string;
  feedback?: string;
}

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  
  const [currentMode, setCurrentMode] = useState<'quick' | 'standard' | 'deep'>('standard');
  const [completedSections, setCompletedSections] = useState<CompletedSection>({
    lookback: false,
    lookup: false,
    lookforward: false
  });
  const [sessionData, setSessionData] = useState<SessionData>({});
  const [showMethodologyPopup, setShowMethodologyPopup] = useState<string | null>(null);
  const [showResources, setShowResources] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [sessionProgress, setSessionProgress] = useState(0);

  // Initialize user and load session data
  useEffect(() => {
    const initializeSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Load existing session progress from Supabase
        const { data: progress } = await supabase
          .from('session_progress')
          .select('*')
          .eq('user_id', user.id)
          .eq('module_id', params?.moduleId || 'unknown')
          .eq('session_id', params?.sessionId || 'unknown')
          .single();
          
        if (progress) {
          setCompletedSections(progress.completed_sections || {
            lookback: false,
            lookup: false,
            lookforward: false
          });
          setSessionData(progress.session_data || {});
        }
      }
    };

    initializeSession();
  }, [params?.moduleId, params?.sessionId]);

  // Auto-save functionality
  useEffect(() => {
    const saveProgress = async () => {
      if (!user) return;

      await supabase
        .from('session_progress')
        .upsert({
          user_id: user.id,
          module_id: params?.moduleId || 'unknown',
          session_id: params?.sessionId || 'unknown',
          completed_sections: completedSections,
          session_data: sessionData,
          progress_percentage: calculateProgress(),
          updated_at: new Date().toISOString()
        });
    };

    const timeoutId = setTimeout(saveProgress, 1000);
    return () => clearTimeout(timeoutId);
  }, [completedSections, sessionData, user]);

  const calculateProgress = (): number => {
    const completed = Object.values(completedSections).filter(Boolean).length;
    return (completed / 3) * 100;
  };

  const selectMode = (mode: 'quick' | 'standard' | 'deep') => {
    setCurrentMode(mode);
  };

  const toggleSection = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const completeSection = async (sectionId: keyof CompletedSection) => {
    const newCompleted = { ...completedSections, [sectionId]: true };
    setCompletedSections(newCompleted);
    setActiveSection(null);

    // Update user XP in database
    if (user) {
      await supabase.rpc('add_user_xp', {
        user_id: user.id,
        xp_amount: 10
      });
    }

    // Check if all sections completed
    if (Object.values(newCompleted).every(Boolean)) {
      // Award completion XP
      if (user) {
        await supabase.rpc('add_user_xp', {
          user_id: user.id,
          xp_amount: 50
        });
        
        // Mark session as completed
        await supabase
          .from('user_progress')
          .upsert({
            user_id: user.id,
            module_id: params?.moduleId || 'unknown',
            session_id: params?.sessionId || 'unknown',
            completed: true,
            completed_at: new Date().toISOString()
          });
      }
    }
  };

  const updateSessionData = (key: keyof SessionData, value: string) => {
    setSessionData(prev => ({ ...prev, [key]: value }));
  };

  const methodologyContent = {
    lookback: {
      title: "LOOK BACK - Business Applications",
      content: (
        <div className="space-y-4">
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
            <h4 className="text-emerald-800 font-semibold mb-3 flex items-center gap-2">
              💼 How to Use "Look Back" in Business:
            </h4>
            <ul className="space-y-2 text-emerald-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">→</span>
                <strong>Team Meetings:</strong> "What wins can we celebrate from last week? What commitments did we make and how did they go?"
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">→</span>
                <strong>One-on-One Mentoring:</strong> "Tell me about your progress since our last conversation. What worked? What didn't?"
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600">→</span>
                <strong>Personal Planning:</strong> "What did I accomplish? Where did I see God's faithfulness? What do I need to learn?"
              </li>
            </ul>
          </div>
          <p className="font-semibold">Key Principle: Always start with celebration and accountability before moving to new content.</p>
        </div>
      )
    },
    lookup: {
      title: "LOOK UP - Business Applications",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <h4 className="text-blue-800 font-semibold mb-3 flex items-center gap-2">
              💼 How to Use "Look Up" in Business:
            </h4>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600">→</span>
                <strong>Team Training:</strong> "What does Scripture/research/best practices teach us about this challenge?"
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">→</span>
                <strong>Strategic Planning:</strong> "What wisdom from God's Word applies to our business decisions?"
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600">→</span>
                <strong>Problem Solving:</strong> "Let's look up from our immediate problem to see God's perspective."
              </li>
            </ul>
          </div>
          <p className="font-semibold">Key Principle: Always ground decisions in truth from above - Scripture, proven principles, or wise counsel.</p>
        </div>
      )
    },
    lookforward: {
      title: "LOOK FORWARD - Business Applications",
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
            <h4 className="text-purple-800 font-semibold mb-3 flex items-center gap-2">
              💼 How to Use "Look Forward" in Business:
            </h4>
            <ul className="space-y-2 text-purple-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600">→</span>
                <strong>Team Meetings:</strong> "Based on what we learned, what specific actions will each of us take this week?"
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">→</span>
                <strong>Mentoring Sessions:</strong> "What's one specific thing you'll do differently? How will you share this?"
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600">→</span>
                <strong>Personal Planning:</strong> "What's my specific commitment? Who will I teach this to?"
              </li>
            </ul>
          </div>
          <p className="font-semibold">Key Principle: Always end with specific commitments and multiplication - teaching others what you've learned.</p>
        </div>
      )
    }
  };

  const isAllCompleted = Object.values(completedSections).every(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Modules
            </button>
            <div className="text-center">
              <div className="text-blue-900 font-semibold">Faith-Driven Business Training</div>
              <div className="text-sm text-gray-600">Marketplace Discipleship</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              ⚡ 350 XP
            </div>
            <div className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium">
              🏆 Methodology Master
            </div>
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              🔥 7 Day Streak
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 mb-8 shadow-xl border border-white/20">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-bold text-blue-900 mb-2">Business is God's Gift</h1>
            <p className="text-xl text-gray-600 mb-6">Master the 3/3 methodology while building your faith-driven business</p>
            
            {/* Methodology Introduction */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-amber-300 rounded-xl p-6 mb-6 text-left">
              <h3 className="text-amber-800 font-bold mb-4 flex items-center gap-2">
                🎯 Learning a Transferable Method
              </h3>
              <p className="text-amber-700 mb-3">
                You're not just learning content today - you're mastering the <strong>"Look Back, Look Up, Look Forward"</strong> methodology that you can use to:
              </p>
              <ul className="list-disc list-inside text-amber-700 space-y-1 mb-3">
                <li>Run more effective team meetings</li>
                <li>Mentor other entrepreneurs one-on-one</li>
                <li>Facilitate small group discussions</li>
                <li>Structure your personal planning time</li>
              </ul>
              <p className="text-amber-600 italic text-sm">
                Click the "?" buttons next to each section to see specific business applications!
              </p>
            </div>
            
            {/* Mode Selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                { mode: 'quick', icon: '⚡', title: 'Quick Method', desc: 'Learn the basics fast', time: '5 min' },
                { mode: 'standard', icon: '🎯', title: 'Complete Learning', desc: 'Full methodology training', time: '15 min' },
                { mode: 'deep', icon: '🔍', title: 'Master Teacher', desc: 'Ready to teach others', time: '30 min' }
              ].map(({ mode, icon, title, desc, time }) => (
                <div
                  key={mode}
                  onClick={() => selectMode(mode as any)}
                  className={`relative cursor-pointer border-2 rounded-xl p-6 transition-all duration-300 hover:scale-105 ${
                    currentMode === mode
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-blue-300'
                  }`}
                >
                  <div className="absolute -top-2 -right-2 bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                    {time}
                  </div>
                  <div className="text-3xl mb-2">{icon}</div>
                  <h3 className="font-bold text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 h-2 rounded-full mb-8 overflow-hidden">
          <div 
            className="bg-gradient-to-r from-blue-600 to-green-500 h-full transition-all duration-500"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>

        {/* Sections */}
        {[
          {
            id: 'lookback',
            emoji: '👈',
            title: 'LOOK BACK',
            desc: 'Celebration, accountability & vision reminder',
            time: currentMode === 'quick' ? '1 min' : currentMode === 'standard' ? '3 min' : '8 min',
            content: (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-6">
                  <h4 className="text-red-800 font-bold mb-3 flex items-center gap-2">
                    🎯 This Week's Vision
                  </h4>
                  <p className="text-red-700 font-medium">
                    "Love God and love your community through good business and multiply disciples in your local community marketplace."
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-800 mb-4">Last Week's Commitment Check:</h4>
                  <div className="flex gap-4 flex-wrap mb-4">
                    <button className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform">
                      ✅ I did it!
                    </button>
                    <button className="bg-gradient-to-r from-amber-600 to-orange-600 text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform">
                      📝 Learned something
                    </button>
                  </div>
                  
                  <textarea
                    className="w-full p-4 border-2 border-gray-200 rounded-lg resize-none focus:border-blue-500 focus:outline-none"
                    placeholder="What happened? How did God work through this experience?"
                    rows={3}
                  />
                </div>

                <button
                  onClick={() => completeSection('lookback')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-bold hover:scale-105 transition-transform"
                >
                  ✅ Complete Look Back
                </button>
              </div>
            )
          },
          {
            id: 'lookup',
            emoji: '☝️',
            title: 'LOOK UP',
            desc: 'Learn from God\'s truth & biblical wisdom',
            time: currentMode === 'quick' ? '3 min' : currentMode === 'standard' ? '8 min' : '15 min',
            content: (
              <div className="space-y-6">
                {/* Video Section */}
                <div className="bg-gray-900 rounded-xl p-8 text-white text-center">
                  <h3 className="text-xl font-bold mb-4">📹 Core Training: Business as God's Gift</h3>
                  <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg p-8 mb-4">
                    <button className="bg-red-600 hover:bg-red-700 text-white w-16 h-16 rounded-full text-2xl mb-4 hover:scale-110 transition-transform">
                      ▶
                    </button>
                    <p>15-minute biblical foundation for entrepreneurship</p>
                  </div>
                  <a 
                    href="https://biztools33.com/vimeo/trainer/jpbgUHMfeo/en" 
                    target="_blank"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold hover:scale-105 transition-transform"
                  >
                    🎥 Watch Now
                  </a>
                </div>

                {/* Key Insights */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="text-blue-800 font-bold mb-4 flex items-center gap-2">
                    💡 Key Biblical Business Truths:
                  </h4>
                  <ul className="space-y-2 text-blue-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <strong>Business was part of God's original design</strong> - before the fall
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <strong>Business provides for families</strong> - God's chosen means
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <strong>Business funds ministry</strong> - supporting kingdom work
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600">•</span>
                      <strong>Business multiplies disciples</strong> - platform for influence
                    </li>
                  </ul>
                </div>

                {/* Scripture */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div 
                    className="p-4 cursor-pointer flex items-center justify-between hover:bg-gray-50"
                    onClick={() => setShowResources(!showResources)}
                  >
                    <span className="text-blue-600 font-semibold">📖 Genesis 1:26 - God's Original Business Plan</span>
                    <span className="text-blue-600">{showResources ? '▲' : '▼'}</span>
                  </div>
                  {showResources && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <p className="italic text-gray-700">
                        "Then God said, 'Let us make man in our image, after our likeness. And let them have dominion over the fish of the sea and over the birds of the heavens and over the livestock and over all the earth.'"
                      </p>
                      <p className="text-sm text-gray-500 mt-2">English Standard Version (ESV)</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => completeSection('lookup')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-bold hover:scale-105 transition-transform"
                >
                  ✅ Got the Truth
                </button>
              </div>
            )
          },
          {
            id: 'lookforward',
            emoji: '👉',
            title: 'LOOK FORWARD',
            desc: 'Commit to specific actions & multiplication',
            time: currentMode === 'quick' ? '1 min' : currentMode === 'standard' ? '4 min' : '7 min',
            content: (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                  <h4 className="text-green-800 font-bold mb-4 flex items-center gap-2">
                    🎯 This Week's Commitment
                  </h4>
                  <p className="text-green-700 mb-4">
                    Make one specific commitment that demonstrates biblical character in your business:
                  </p>
                  
                  <textarea
                    className="w-full p-4 border-2 border-green-200 rounded-lg resize-none focus:border-green-500 focus:outline-none"
                    placeholder="Example: 'I will pray for my top 3 customers by name every morning this week, then reach out to check on their business needs.'"
                    rows={3}
                    value={sessionData.weeklyCommitment || ''}
                    onChange={(e) => updateSessionData('weeklyCommitment', e.target.value)}
                  />

                  <div className="bg-white border-l-4 border-blue-500 rounded p-4 mt-4">
                    <h5 className="font-bold text-blue-800 mb-2">💡 SMART Goal Tip:</h5>
                    <p className="text-blue-700 text-sm">
                      Make it <strong>Specific, Measurable, Achievable, Relevant, Time-bound</strong>. Include WHO, WHAT, WHEN for maximum success.
                    </p>
                  </div>
                </div>

                {/* Multiplication Challenge */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-300 rounded-xl p-6">
                  <h4 className="text-amber-800 font-bold mb-4">🔄 Multiplication Challenge</h4>
                  <p className="text-amber-700 mb-3">
                    <strong>Who will you teach the "Look Back, Look Up, Look Forward" method to this week?</strong>
                  </p>
                  <input
                    type="text"
                    className="w-full p-3 border-2 border-amber-200 rounded-lg focus:border-amber-500 focus:outline-none"
                    placeholder="e.g., My team during our Monday meeting, or my accountability partner"
                    value={sessionData.multiplicationTarget || ''}
                    onChange={(e) => updateSessionData('multiplicationTarget', e.target.value)}
                  />
                </div>

                <button
                  onClick={() => completeSection('lookforward')}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-lg font-bold hover:scale-105 transition-transform"
                >
                  🚀 Lock in My Commitment
                </button>
              </div>
            )
          }
        ].map((section) => (
          <div key={section.id} className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-6 overflow-hidden ${completedSections[section.id as keyof CompletedSection] ? 'border-l-4 border-l-green-500' : ''}`}>
            {/* Section Header */}
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50/50 transition-colors border-b border-gray-100"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-4xl bg-white rounded-xl p-3 shadow-md">
                    {section.emoji}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                      {section.title}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMethodologyPopup(section.id);
                        }}
                        className="bg-blue-600 text-white w-8 h-8 rounded-full text-sm hover:bg-blue-700 transition-colors"
                      >
                        ?
                      </button>
                    </h3>
                    <p className="text-gray-600">{section.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {section.time}
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    completedSections[section.id as keyof CompletedSection]
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {completedSections[section.id as keyof CompletedSection] ? '✓' : '○'}
                  </div>
                </div>
              </div>
            </div>

            {/* Section Content */}
            {activeSection === section.id && (
              <div className="p-6 border-t border-gray-100">
                {section.content}
              </div>
            )}
          </div>
        ))}

        {/* Completion Celebration */}
        {isAllCompleted && (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <h2 className="text-3xl font-bold text-blue-900 mb-4">3/3 Method Mastered!</h2>
            <p className="text-xl mb-6">You've earned <strong>+50 XP</strong> and the <strong>"Methodology Master"</strong> badge!</p>
            <p className="text-lg text-gray-600 mb-8 italic">
              You can now teach this method to others and multiply disciples in your marketplace!
            </p>
            
            {/* Quick Feedback */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
              <h4 className="text-green-800 font-bold mb-4">Quick feedback to help us improve:</h4>
              <p className="text-green-700 mb-4">How was this session?</p>
              <div className="flex justify-center gap-4">
                {['😍', '😊', '😐', '😕'].map((emoji, index) => (
                  <button
                    key={emoji}
                    onClick={() => updateSessionData('feedback', emoji)}
                    className={`text-4xl p-3 rounded-full border-2 transition-all hover:scale-110 ${
                      sessionData.feedback === emoji
                        ? 'border-green-500 bg-green-100'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => router.push('/modules')}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-bold hover:scale-105 transition-transform"
            >
              ➡️ Next Session
            </button>
          </div>
        )}
      </div>

      {/* Methodology Popup */}
      {showMethodologyPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  {methodologyContent[showMethodologyPopup as keyof typeof methodologyContent]?.title}
                </h2>
                <button
                  onClick={() => setShowMethodologyPopup(null)}
                  className="text-white hover:text-gray-200 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              {methodologyContent[showMethodologyPopup as keyof typeof methodologyContent]?.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}