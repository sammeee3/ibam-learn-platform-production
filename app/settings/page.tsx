'use client';
import { useState, useEffect } from 'react';
import { Settings, BookOpen, Save, Check } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type LearningPath = 'depth' | 'overview';
type LearningMode = 'individual' | 'group';

export default function SettingsPage() {
  const [learningPath, setLearningPath] = useState<LearningPath>('depth');
  const [learningMode, setLearningMode] = useState<LearningMode>('individual');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('');

  // Load user email and current preference
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // Get user email from localStorage/cookies
        let email = localStorage.getItem('ibam-auth-email');
        
        if (!email) {
          const cookies = document.cookie.split(';');
          const authCookie = cookies.find(c => c.trim().startsWith('ibam_auth_server='));
          if (authCookie) {
            email = decodeURIComponent(authCookie.split('=')[1]);
            localStorage.setItem('ibam-auth-email', email);
          }
        }

        if (!email) {
          console.log('No user email found - showing settings anyway for demo');
          setUserEmail('demo@example.com'); // Demo mode
          setLoading(false);
          return;
        }

        setUserEmail(email);

        // Load current learning preferences
        const response = await fetch(`/api/user/profile?email=${encodeURIComponent(email)}`);
        if (response.ok) {
          const profile = await response.json();
          if (profile.learning_path) {
            setLearningPath(profile.learning_path);
          }
          if (profile.learning_mode) {
            setLearningMode(profile.learning_mode);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const saveLearningPath = async () => {
    if (!userEmail) return;

    setSaving(true);
    setSaved(false);

    try {
      const response = await fetch('/api/user/learning-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          learning_path: learningPath,
          learning_mode: learningMode,
        }),
      });

      if (response.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        console.error('Failed to save learning path');
      }
    } catch (error) {
      console.error('Error saving learning path:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Settings...</p>
          <p className="text-xs text-gray-500 mt-2">Debug: User email: {userEmail || 'Not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'%3E%3C/circle%3E%3Ccircle cx='53' cy='7' r='1'%3E%3C/circle%3E%3Ccircle cx='30' cy='30' r='1'%3E%3C/circle%3E%3Ccircle cx='7' cy='53' r='1'%3E%3C/circle%3E%3Ccircle cx='53' cy='53' r='1'%3E%3C/circle%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30 shadow-xl">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Learning Preferences</h1>
              <p className="text-indigo-100 text-lg">Craft your perfect learning journey</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Learning Path Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 mb-8 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Learning Path Preference</h2>
                <p className="text-gray-600 mt-1">Choose your ideal learning experience</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-200/50">
              <p className="text-gray-700 leading-relaxed">
                🎯 <strong>Personalize your journey:</strong> Select the learning style that matches your pace and preferences. 
                You can switch between modes anytime to find what works best for you.
              </p>
            </div>

            <div className="space-y-6">
              {/* Depth Learning Option */}
              <div 
                className={`group relative border-2 rounded-2xl p-8 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                  learningPath === 'depth' 
                    ? 'border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-xl shadow-emerald-200/50' 
                    : 'border-gray-200 hover:border-emerald-300 hover:shadow-lg bg-white'
                }`}
                onClick={() => setLearningPath('depth')}
              >
                {/* Selection Indicator */}
                <div className="absolute top-6 right-6">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    learningPath === 'depth' 
                      ? 'border-emerald-500 bg-emerald-500 shadow-lg' 
                      : 'border-gray-300 group-hover:border-emerald-400'
                  }`}>
                    {learningPath === 'depth' && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                    learningPath === 'depth'
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-emerald-100 group-hover:to-teal-100'
                  }`}>
                    <BookOpen className={`w-8 h-8 ${
                      learningPath === 'depth' ? 'text-white' : 'text-gray-600 group-hover:text-emerald-600'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        Deep Learning Journey
                      </h3>
                      <span className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-semibold rounded-full shadow-sm">
                        RECOMMENDED
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Immerse yourself in comprehensive content with detailed reflection, scripture integration, 
                      and practical application. Perfect for building unshakeable foundations in faith-driven business.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-emerald-100 text-emerald-800 rounded-xl text-sm font-semibold border border-emerald-200">
                        🎯 Complete Content
                      </span>
                      <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl text-sm font-semibold border border-blue-200">
                        📖 Scripture Integration
                      </span>
                      <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-xl text-sm font-semibold border border-purple-200">
                        🚀 Action Planning
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overview Learning Option */}
              <div 
                className={`group relative border-2 rounded-2xl p-8 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                  learningPath === 'overview' 
                    ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-amber-50 shadow-xl shadow-orange-200/50' 
                    : 'border-gray-200 hover:border-orange-300 hover:shadow-lg bg-white'
                }`}
                onClick={() => setLearningPath('overview')}
              >
                {/* Selection Indicator */}
                <div className="absolute top-6 right-6">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    learningPath === 'overview' 
                      ? 'border-orange-500 bg-orange-500 shadow-lg' 
                      : 'border-gray-300 group-hover:border-orange-400'
                  }`}>
                    {learningPath === 'overview' && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                    learningPath === 'overview'
                      ? 'bg-gradient-to-br from-orange-500 to-amber-600 shadow-lg'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-orange-100 group-hover:to-amber-100'
                  }`}>
                    <div className={`w-8 h-8 flex items-center justify-center text-2xl ${
                      learningPath === 'overview' ? 'text-white' : 'text-gray-600 group-hover:text-orange-600'
                    }`}>
                      ⚡
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        Express Learning Track
                      </h3>
                      <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-semibold rounded-full shadow-sm">
                        TIME-EFFICIENT
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Streamlined content delivering essential concepts and immediate applications. 
                      Perfect for busy entrepreneurs who need maximum impact in minimum time.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-orange-100 text-orange-800 rounded-xl text-sm font-semibold border border-orange-200">
                        🎯 Key Insights
                      </span>
                      <span className="px-4 py-2 bg-amber-100 text-amber-800 rounded-xl text-sm font-semibold border border-amber-200">
                        ⚡ Quick Actions
                      </span>
                      <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-xl text-sm font-semibold border border-yellow-200">
                        ⏱️ Time Optimized
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {saved && (
                  <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-xl border border-green-200">
                    <Check className="w-5 h-5" />
                    <span className="font-semibold">Preferences saved successfully!</span>
                  </div>
                )}
              </div>
              <button
                onClick={saveLearningPath}
                disabled={saving}
                className="group relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-3 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-5 h-5" />
                )}
                <span>{saving ? 'Saving Preferences...' : 'Save Changes'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Learning Mode Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 mb-8 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-28 h-28 bg-gradient-to-br from-cyan-400/20 to-blue-400/20 rounded-full -translate-y-14 -translate-x-14"></div>
          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-violet-400/20 to-purple-400/20 rounded-full translate-y-10 translate-x-10"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <div className="w-6 h-6 flex items-center justify-center text-white text-lg">👥</div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Learning Environment</h2>
                <p className="text-gray-600 mt-1">Choose your preferred learning setup</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 mb-8 border border-cyan-200/50">
              <p className="text-gray-700 leading-relaxed">
                🤝 <strong>Community vs Solo:</strong> Select whether you prefer individual reflection or collaborative group discussions. 
                Both approaches offer unique benefits for your learning journey.
              </p>
            </div>

            <div className="space-y-6">
              {/* Individual Learning Option */}
              <div 
                className={`group relative border-2 rounded-2xl p-8 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                  learningMode === 'individual' 
                    ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl shadow-blue-200/50' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-lg bg-white'
                }`}
                onClick={() => setLearningMode('individual')}
              >
                {/* Selection Indicator */}
                <div className="absolute top-6 right-6">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    learningMode === 'individual' 
                      ? 'border-blue-500 bg-blue-500 shadow-lg' 
                      : 'border-gray-300 group-hover:border-blue-400'
                  }`}>
                    {learningMode === 'individual' && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                    learningMode === 'individual'
                      ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-blue-100 group-hover:to-indigo-100'
                  }`}>
                    <div className={`w-8 h-8 flex items-center justify-center text-2xl ${
                      learningMode === 'individual' ? 'text-white' : 'text-gray-600 group-hover:text-blue-600'
                    }`}>
                      🧘‍♂️
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        Individual Focus
                      </h3>
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold rounded-full shadow-sm">
                        SELF-PACED
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Learn at your own pace with personal reflection and individual application. 
                      Perfect for deep contemplation and customized learning schedules.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-xl text-sm font-semibold border border-blue-200">
                        🎯 Personal Reflection
                      </span>
                      <span className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-xl text-sm font-semibold border border-indigo-200">
                        ⏰ Flexible Schedule
                      </span>
                      <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-xl text-sm font-semibold border border-purple-200">
                        🔍 Deep Focus
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Small Group Learning Option */}
              <div 
                className={`group relative border-2 rounded-2xl p-8 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                  learningMode === 'group' 
                    ? 'border-violet-400 bg-gradient-to-br from-violet-50 to-purple-50 shadow-xl shadow-violet-200/50' 
                    : 'border-gray-200 hover:border-violet-300 hover:shadow-lg bg-white'
                }`}
                onClick={() => setLearningMode('group')}
              >
                {/* Selection Indicator */}
                <div className="absolute top-6 right-6">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    learningMode === 'group' 
                      ? 'border-violet-500 bg-violet-500 shadow-lg' 
                      : 'border-gray-300 group-hover:border-violet-400'
                  }`}>
                    {learningMode === 'group' && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start space-x-6">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${
                    learningMode === 'group'
                      ? 'bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg'
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-violet-100 group-hover:to-purple-100'
                  }`}>
                    <div className={`w-8 h-8 flex items-center justify-center text-2xl ${
                      learningMode === 'group' ? 'text-white' : 'text-gray-600 group-hover:text-violet-600'
                    }`}>
                      👥
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        Small Group Collaboration
                      </h3>
                      <span className="px-3 py-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-semibold rounded-full shadow-sm">
                        COMMUNITY
                      </span>
                    </div>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      Learn with others through discussions, shared insights, and collaborative problem-solving. 
                      Ideal for building relationships and gaining diverse perspectives.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-4 py-2 bg-violet-100 text-violet-800 rounded-xl text-sm font-semibold border border-violet-200">
                        🤝 Group Discussions
                      </span>
                      <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-xl text-sm font-semibold border border-purple-200">
                        💡 Shared Insights
                      </span>
                      <span className="px-4 py-2 bg-pink-100 text-pink-800 rounded-xl text-sm font-semibold border border-pink-200">
                        🌟 Accountability
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Settings Preview */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-10 -translate-x-10"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-gray-600 rounded-xl flex items-center justify-center shadow-lg">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">More Settings</h2>
                <p className="text-gray-600">Additional customization options</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">🔔</span>
                  </div>
                  <h3 className="font-semibold text-gray-700">Notifications</h3>
                </div>
                <p className="text-gray-600 text-sm">Coming soon...</p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm">🎨</span>
                  </div>
                  <h3 className="font-semibold text-gray-700">Appearance</h3>
                </div>
                <p className="text-gray-600 text-sm">Coming soon...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}