'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, PlayCircle, BookOpen, Users, Zap, Download, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function GettingStartedPage() {
  const router = useRouter();
  const [selectedPath, setSelectedPath] = useState<'individual' | 'group' | null>(null);
  const [selectedPace, setSelectedPace] = useState<'fast' | 'slow' | null>(null);
  const [showFAQ, setShowFAQ] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Get user's first name from localStorage
    const firstName = localStorage.getItem('user_first_name') || 'Friend';
    setUserName(firstName);
  }, []);

  const handleStartJourney = () => {
    // Save preferences
    if (selectedPath) localStorage.setItem('study_path', selectedPath);
    if (selectedPace) localStorage.setItem('study_pace', selectedPace);
    
    // Navigate to first module
    router.push('/modules/1');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img src="/favicon.ico" alt="IBAM" className="h-8 w-8 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Getting Started</h1>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-center mb-4">
            Welcome to Your IBAM Journey, {userName}! 🎯
          </h2>
          <p className="text-lg text-center text-gray-600 mb-6">
            You're about to discover how to build a thriving business while deepening your faith.
            This 5-minute guide will show you exactly how to succeed.
          </p>

          {/* Video Placeholder */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-8 mb-8 text-center">
            <PlayCircle className="w-16 h-16 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Welcome Video Coming Soon!</h3>
            <p className="text-gray-600">
              Jeffrey will walk you through everything in a 2-minute video
            </p>
            <div className="mt-4 p-4 bg-white/50 rounded text-sm text-gray-500">
              Video placeholder - Will be embedded here
            </div>
          </div>
        </div>

        {/* The IBAM Method */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            ✨ The IBAM Method: Look Back → Look Up → Look Forward
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Look Back - Using session blue color */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
              <div className="text-3xl mb-3">⏮️</div>
              <h4 className="font-bold text-xl mb-2">Look Back</h4>
              <p className="text-sm text-blue-50">
                Review your actions and progress. What worked? What didn't? 
                Just like Jesus asked His disciples "What happened?" after they returned.
              </p>
            </div>

            {/* Look Up - Using session green color */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
              <div className="text-3xl mb-3">🙏</div>
              <h4 className="font-bold text-xl mb-2">Look Up</h4>
              <p className="text-sm text-green-50">
                Connect with God's Word and wisdom. Every business decision is grounded 
                in Scripture and prayer, seeking His guidance first.
              </p>
            </div>

            {/* Look Forward - Using session orange color */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white shadow-lg transform hover:scale-105 transition-transform">
              <div className="text-3xl mb-3">🎯</div>
              <h4 className="font-bold text-xl mb-2">Look Forward</h4>
              <p className="text-sm text-orange-50">
                Plan concrete actions based on what you've learned. 
                Faith without works is dead - we learn by doing!
              </p>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <p className="text-lg font-medium text-purple-900">
              "This is how Jesus trained His disciples - and how you'll build your business!"
            </p>
            <p className="text-sm text-purple-700 mt-2">
              Each session follows this biblical pattern of reflection, revelation, and response.
            </p>
          </div>
        </div>

        {/* Choose Your Path */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            🛤️ Step 1: Choose Your Learning Path
          </h3>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Individual Path - Purple/Blue gradient */}
            <button
              onClick={() => setSelectedPath('individual')}
              className={`p-6 rounded-lg border-2 transition-all transform hover:scale-105 ${
                selectedPath === 'individual' 
                  ? 'border-purple-500 bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg' 
                  : 'border-gray-200 hover:border-purple-300 hover:shadow-md bg-white'
              }`}
            >
              <div className="text-3xl mb-3">👤</div>
              <h4 className={`font-bold text-lg mb-2 ${selectedPath === 'individual' ? 'text-white' : 'text-gray-800'}`}>Individual Study</h4>
              <p className={`text-sm ${selectedPath === 'individual' ? 'text-purple-50' : 'text-gray-600'}`}>
                Learn at your own pace, on your own schedule. 
                Perfect for busy entrepreneurs.
              </p>
              {selectedPath === 'individual' && (
                <CheckCircle className="w-6 h-6 text-white mt-3 mx-auto" />
              )}
            </button>

            {/* Group Path - Green gradient */}
            <button
              onClick={() => setSelectedPath('group')}
              className={`p-6 rounded-lg border-2 transition-all transform hover:scale-105 ${
                selectedPath === 'group' 
                  ? 'border-green-500 bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg' 
                  : 'border-gray-200 hover:border-green-300 hover:shadow-md bg-white'
              }`}
            >
              <div className="text-3xl mb-3">👥</div>
              <h4 className={`font-bold text-lg mb-2 ${selectedPath === 'group' ? 'text-white' : 'text-gray-800'}`}>Group Study</h4>
              <p className={`text-sm ${selectedPath === 'group' ? 'text-green-50' : 'text-gray-600'}`}>
                Learn with others, share insights, and build accountability. 
                Iron sharpens iron!
              </p>
              {selectedPath === 'group' && (
                <CheckCircle className="w-6 h-6 text-white mt-3 mx-auto" />
              )}
            </button>
          </div>
        </div>

        {/* Choose Your Pace */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            ⏱️ Step 2: Choose Your Learning Pace
          </h3>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Fast Track - Orange theme */}
            <button
              onClick={() => setSelectedPace('fast')}
              className={`p-6 rounded-lg border-2 transition-all transform hover:scale-105 ${
                selectedPace === 'fast' 
                  ? 'border-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg' 
                  : 'border-gray-200 hover:border-orange-300 hover:shadow-md bg-white'
              }`}
            >
              <Zap className={`w-12 h-12 mx-auto mb-3 ${selectedPace === 'fast' ? 'text-white' : 'text-orange-500'}`} />
              <h4 className={`font-bold text-lg mb-2 ${selectedPace === 'fast' ? 'text-white' : 'text-gray-800'}`}>Fast Track (5 weeks)</h4>
              <p className={`text-sm ${selectedPace === 'fast' ? 'text-orange-50' : 'text-gray-600'}`}>
                Complete 1 module per week. For motivated self-starters 
                ready to transform quickly.
              </p>
              <ul className={`text-xs mt-3 space-y-1 ${selectedPace === 'fast' ? 'text-orange-100' : 'text-gray-500'}`}>
                <li>• 1 hour daily commitment</li>
                <li>• Intensive learning</li>
                <li>• Quick implementation</li>
              </ul>
              {selectedPace === 'fast' && (
                <CheckCircle className="w-6 h-6 text-white mt-3 mx-auto" />
              )}
            </button>

            {/* Steady Pace - Blue theme */}
            <button
              onClick={() => setSelectedPace('slow')}
              className={`p-6 rounded-lg border-2 transition-all transform hover:scale-105 ${
                selectedPace === 'slow' 
                  ? 'border-blue-500 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg' 
                  : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'
              }`}
            >
              <BookOpen className={`w-12 h-12 mx-auto mb-3 ${selectedPace === 'slow' ? 'text-white' : 'text-blue-500'}`} />
              <h4 className={`font-bold text-lg mb-2 ${selectedPace === 'slow' ? 'text-white' : 'text-gray-800'}`}>Steady Pace (10 weeks)</h4>
              <p className={`text-sm ${selectedPace === 'slow' ? 'text-blue-50' : 'text-gray-600'}`}>
                Complete 1 module every 2 weeks. Time to reflect, apply, 
                and integrate deeply.
              </p>
              <ul className={`text-xs mt-3 space-y-1 ${selectedPace === 'slow' ? 'text-blue-100' : 'text-gray-500'}`}>
                <li>• 30 minutes daily</li>
                <li>• Deep reflection</li>
                <li>• Thorough application</li>
              </ul>
              {selectedPace === 'slow' && (
                <CheckCircle className="w-6 h-6 text-white mt-3 mx-auto" />
              )}
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            📚 Step 3: Understand the Journey
          </h3>

          <div className="space-y-6">
            {/* Module Structure - Purple gradient */}
            <div className="flex items-start p-4 rounded-lg hover:bg-purple-50 transition-colors">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-full p-4 mr-4 shadow-md">
                <span className="text-2xl font-bold text-white">5</span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1 text-gray-800">Modules</h4>
                <p className="text-gray-600">
                  From foundational principles to advanced business planning. 
                  Each module builds on the previous one.
                </p>
              </div>
            </div>

            {/* Session Structure - Blue gradient */}
            <div className="flex items-start p-4 rounded-lg hover:bg-blue-50 transition-colors">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-4 mr-4 shadow-md">
                <span className="text-xl font-bold text-white">4-5</span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1 text-gray-800">Sessions per Module</h4>
                <p className="text-gray-600">
                  Each session takes 20-30 minutes. Watch videos, read content, 
                  apply Scripture, and create action plans.
                </p>
              </div>
            </div>

            {/* Time Commitment - Orange gradient */}
            <div className="flex items-start p-4 rounded-lg hover:bg-orange-50 transition-colors">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-full p-4 mr-4 shadow-md">
                <span className="text-2xl font-bold text-white">20</span>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1 text-gray-800">Minutes per Session</h4>
                <p className="text-gray-600">
                  Short enough to fit in your day, deep enough to transform your business. 
                  Plus time for prayer and action planning.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-center">
            ⚡ Platform Features You'll Love
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Auto-Save Progress</h4>
                <p className="text-sm text-gray-600">
                  Never lose your work. Everything saves automatically.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Continue Where You Left Off</h4>
                <p className="text-sm text-gray-600">
                  The "Continue Session" button takes you right back.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Download Your Work</h4>
                <p className="text-sm text-gray-600">
                  Export action plans, notes, and your business plan as PDF.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Mobile Friendly</h4>
                <p className="text-sm text-gray-600">
                  Learn on your phone, tablet, or computer. Anywhere, anytime.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">Business Planner Tool</h4>
                <p className="text-sm text-gray-600">
                  Build your complete business plan as you learn.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1" />
              <div>
                <h4 className="font-semibold mb-1">AI Coach Support</h4>
                <p className="text-sm text-gray-600">
                  Get personalized guidance when you need it.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <button
            onClick={() => setShowFAQ(!showFAQ)}
            className="w-full flex items-center justify-between mb-4"
          >
            <h3 className="text-2xl font-bold">❓ Frequently Asked Questions</h3>
            {showFAQ ? (
              <ChevronUp className="w-6 h-6 text-gray-500" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-500" />
            )}
          </button>

          {showFAQ && (
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Can I switch between individual and group study?</h4>
                <p className="text-gray-600">
                  Yes! You can change your preference anytime in Settings.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">What if I fall behind?</h4>
                <p className="text-gray-600">
                  No problem! This is self-paced. Take as long as you need. 
                  The platform saves your progress forever.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Can I review completed sessions?</h4>
                <p className="text-gray-600">
                  Absolutely! You can revisit any session anytime. 
                  Your notes and actions are always available.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">How do I get help if I'm stuck?</h4>
                <p className="text-gray-600">
                  Use the purple BETA button for feedback, join our WhatsApp group, 
                  or use the AI Coach for instant help.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Transform Your Business & Faith? 
          </h3>
          <p className="text-lg mb-6">
            Join hundreds of entrepreneurs building Kingdom businesses!
          </p>

          {(!selectedPath || !selectedPace) && (
            <p className="text-yellow-300 mb-4 font-medium">
              ⚠️ Please choose your path and pace above first
            </p>
          )}

          <button
            onClick={handleStartJourney}
            disabled={!selectedPath || !selectedPace}
            className={`px-8 py-4 rounded-lg font-bold text-lg transition-all ${
              selectedPath && selectedPace
                ? 'bg-white text-purple-600 hover:bg-gray-100 transform hover:scale-105'
                : 'bg-white/30 text-white/70 cursor-not-allowed'
            }`}
          >
            Start Module 1 Now
            <ArrowRight className="inline-block ml-2 w-5 h-5" />
          </button>

          <p className="text-sm mt-4 text-purple-100">
            Your first session takes just 20 minutes
          </p>
        </div>

        {/* Beta Reminder */}
        <div className="bg-yellow-50 rounded-xl p-6 mt-8 text-center border-2 border-yellow-200">
          <p className="text-lg font-semibold text-yellow-900 mb-2">
            🎯 You're a Founding Beta Member!
          </p>
          <p className="text-yellow-700">
            Your feedback shapes this platform. Use the purple BETA button anytime to share thoughts!
          </p>
        </div>
      </div>
    </div>
  );
}