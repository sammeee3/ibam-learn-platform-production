'use client';

import { useState } from 'react';
import EnhancedLookingBack from '@/components/sessions/EnhancedLookingBack';
import EnhancedLookingForward from '@/components/sessions/EnhancedLookingForward';
import { motion } from 'framer-motion';
import { 
  SparklesIcon,
  AdjustmentsHorizontalIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

export default function EnhancedSectionsDemo() {
  const [currentView, setCurrentView] = useState<'back' | 'forward' | 'menu'>('menu');
  const [spiritualLevel, setSpiritualLevel] = useState<'light' | 'moderate' | 'deep'>('moderate');
  const [gamificationEnabled, setGamificationEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  // Demo data
  const sessionId = 'demo-session-1';
  const userId = 'demo-user-1';
  const sessionTitle = 'Leadership Through Service';

  const handleLookingBackComplete = (reflections: any[]) => {
    console.log('Looking Back completed with reflections:', reflections);
    alert(`✅ Looking Back Complete!\n\nYou submitted ${reflections.length} reflections.\nTotal points earned: ${reflections.reduce((sum, r) => sum + r.points, 0)}`);
    setCurrentView('menu');
  };

  const handleLookingForwardComplete = (pathway: any, actions: any[]) => {
    console.log('Looking Forward completed:', { pathway, actions });
    alert(`✅ Looking Forward Complete!\n\nPathway: ${pathway.name}\nActions committed: ${actions.length}\nTotal XP potential: ${actions.reduce((sum, a) => sum + a.points, 0)}`);
    setCurrentView('menu');
  };

  const settings = (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-20 right-4 bg-white rounded-2xl shadow-2xl p-6 z-50 w-80"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">Customization Settings</h3>
        <button
          onClick={() => setShowSettings(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        {/* Spiritual Integration Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Spiritual Integration Level
          </label>
          <div className="space-y-2">
            {(['light', 'moderate', 'deep'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSpiritualLevel(level)}
                className={`
                  w-full text-left px-4 py-3 rounded-lg transition-all
                  ${spiritualLevel === level
                    ? 'bg-indigo-100 border-2 border-indigo-400'
                    : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'}
                `}
              >
                <div className="font-medium capitalize">{level}</div>
                <div className="text-xs text-gray-600 mt-1">
                  {level === 'light' && 'Basic scripture references only'}
                  {level === 'moderate' && 'Scripture with context'}
                  {level === 'deep' && 'Full scripture, prayer prompts, devotionals'}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Gamification Toggle */}
        <div>
          <label className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Gamification Elements
            </span>
            <button
              onClick={() => setGamificationEnabled(!gamificationEnabled)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${gamificationEnabled ? 'bg-indigo-600' : 'bg-gray-200'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${gamificationEnabled ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </label>
          <p className="text-xs text-gray-600 mt-2">
            {gamificationEnabled 
              ? 'Points, badges, streaks, and leaderboards enabled'
              : 'Focus mode - no gamification elements'}
          </p>
        </div>

        {/* Visual Style Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visual Style
          </label>
          <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
            <p className="text-xs text-gray-700">
              Currently using: <strong>Modern Gradient Style</strong>
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Vibrant colors with smooth transitions and animations
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-xs text-yellow-800">
          <strong>💡 Tip:</strong> These settings are saved per session and user for a personalized experience.
        </p>
      </div>
    </motion.div>
  );

  if (currentView === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl w-full"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 mb-6"
            >
              <SparklesIcon className="w-6 h-6 text-white" />
              <span className="text-white font-medium">Enhanced Session Experience</span>
            </motion.div>
            
            <h1 className="text-5xl font-bold text-white mb-4">
              Looking Back & Looking Forward
            </h1>
            <p className="text-xl text-white/90">
              Transform your learning journey with spiritual depth and actionable pathways
            </p>
          </div>

          {/* Settings Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 bg-white/20 backdrop-blur-lg text-white px-6 py-3 rounded-full hover:bg-white/30 transition-all"
            >
              <AdjustmentsHorizontalIcon className="w-5 h-5" />
              <span>Customize Experience</span>
            </button>
          </div>

          {/* Section Cards */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Looking Back Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setCurrentView('back')}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-rose-400 to-pink-600 p-8 text-white">
                <ArrowLeftIcon className="w-12 h-12 mb-4" />
                <h2 className="text-3xl font-bold mb-2">Looking Back</h2>
                <p className="text-white/90">Reflect with gratitude on your journey</p>
              </div>
              
              <div className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-400" />
                    <span className="text-gray-700">Gratitude reflection prompts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-gray-700">Learning & growth insights</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-gray-700">Scripture-based guidance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="text-gray-700">Challenge acknowledgment</span>
                  </div>
                </div>
                
                <button className="mt-6 w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-xl font-bold group-hover:shadow-lg transition-all">
                  Start Reflection →
                </button>
              </div>
            </motion.div>

            {/* Looking Forward Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setCurrentView('forward')}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden cursor-pointer group"
            >
              <div className="bg-gradient-to-r from-blue-400 to-indigo-600 p-8 text-white">
                <ArrowRightIcon className="w-12 h-12 mb-4" />
                <h2 className="text-3xl font-bold mb-2">Looking Forward</h2>
                <p className="text-white/90">Create your action pathway</p>
              </div>
              
              <div className="p-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-orange-400" />
                    <span className="text-gray-700">Accelerator pathway</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-gray-700">Builder pathway</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-400" />
                    <span className="text-gray-700">Connector pathway</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-gray-700">Innovator pathway</span>
                  </div>
                </div>
                
                <button className="mt-6 w-full py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-bold group-hover:shadow-lg transition-all">
                  Choose Your Path →
                </button>
              </div>
            </motion.div>
          </div>

          {/* Current Settings Display */}
          <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-3">Current Settings:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/70">Spiritual Level:</span>
                <span className="ml-2 font-medium capitalize">{spiritualLevel}</span>
              </div>
              <div>
                <span className="text-white/70">Gamification:</span>
                <span className="ml-2 font-medium">{gamificationEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Settings Panel */}
        {showSettings && settings}
      </div>
    );
  }

  if (currentView === 'back') {
    return (
      <div className="relative">
        <button
          onClick={() => setCurrentView('menu')}
          className="fixed top-4 left-4 z-50 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 hover:shadow-xl transition-all"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Menu
        </button>
        
        <EnhancedLookingBack
          sessionId={sessionId}
          userId={userId}
          onComplete={handleLookingBackComplete}
          spiritualLevel={spiritualLevel}
          gamificationEnabled={gamificationEnabled}
        />
      </div>
    );
  }

  if (currentView === 'forward') {
    return (
      <div className="relative">
        <button
          onClick={() => setCurrentView('menu')}
          className="fixed top-4 left-4 z-50 bg-white shadow-lg rounded-full px-4 py-2 flex items-center gap-2 hover:shadow-xl transition-all"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back to Menu
        </button>
        
        <EnhancedLookingForward
          sessionId={sessionId}
          userId={userId}
          sessionTitle={sessionTitle}
          onComplete={handleLookingForwardComplete}
          spiritualLevel={spiritualLevel}
          gamificationEnabled={gamificationEnabled}
        />
      </div>
    );
  }

  return null;
}