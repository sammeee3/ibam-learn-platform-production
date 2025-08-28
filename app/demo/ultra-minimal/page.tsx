'use client';

import { useState } from 'react';
import { Heart, Zap, Check, ArrowRight, Sparkles } from 'lucide-react';

export default function UltraMinimalGrace() {
  const [view, setView] = useState<'review' | 'commit'>('review');
  const [streak, setStreak] = useState(3);
  const [completed, setCompleted] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleComplete = () => {
    setCompleted(completed + 1);
    setStreak(streak + 1);
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  };

  if (view === 'review') {
    return (
      <div className="min-h-screen bg-white p-4 max-w-md mx-auto">
        {/* Minimal Header - Just essentials */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold">Session 3</h1>
            <p className="text-sm text-gray-500">Looking Back</p>
          </div>
          {/* Single visual reward indicator */}
          <div className="flex items-center gap-1 px-3 py-1 bg-orange-50 rounded-full">
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium">{streak}</span>
          </div>
        </div>

        {/* Previous Action - Simplified */}
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-medium mb-1">Your commitment:</p>
            <p className="text-gray-700 mb-4">
              Meet with team members individually
            </p>
            
            {/* Just 2 big buttons - mobile friendly */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleComplete}
                className="py-3 bg-green-500 text-white rounded-lg font-medium active:scale-95 transition-transform"
              >
                Done ✓
              </button>
              <button
                className="py-3 bg-gray-200 text-gray-700 rounded-lg font-medium active:scale-95 transition-transform"
              >
                Not Yet
              </button>
            </div>
          </div>

          {/* Micro-encouragement - 1 line only */}
          <p className="text-center text-sm text-gray-500">
            Every attempt counts 💪
          </p>
        </div>

        {/* Single CTA */}
        <button
          onClick={() => setView('commit')}
          className="w-full mt-8 py-4 bg-blue-500 text-white rounded-xl font-medium active:scale-95 transition-transform"
        >
          Continue →
        </button>

        {/* Celebration - Minimal */}
        {showCelebration && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg animate-pulse">
            Great job! 🎉
          </div>
        )}
      </div>
    );
  }

  if (view === 'commit') {
    return (
      <div className="min-h-screen bg-white p-4 max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold">This Week</h1>
          <p className="text-sm text-gray-500">What will you do?</p>
        </div>

        {/* Ultra Simple Action Input */}
        <div className="space-y-4">
          {/* Business Action */}
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">💼</span>
              </div>
              <span className="font-medium">Business Action</span>
            </div>
            <textarea
              className="w-full p-3 bg-white rounded-lg border-0 resize-none"
              rows={2}
              placeholder="One specific thing..."
            />
          </div>

          {/* Kingdom Action - Visual Differentiation */}
          <div className="bg-purple-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🙏</span>
              </div>
              <span className="font-medium">Kingdom Action</span>
            </div>
            <textarea
              className="w-full p-3 bg-white rounded-lg border-0 resize-none"
              rows={2}
              placeholder="How will you serve?"
            />
          </div>

          {/* Gentle Wisdom - Not intrusive */}
          <div className="text-center py-4">
            <p className="text-xs text-gray-400">
              "Seek first His kingdom" - Matt 6:33
            </p>
          </div>
        </div>

        {/* Single Commit Button */}
        <button
          onClick={() => alert('Saved! See you next week 🙏')}
          className="w-full mt-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium active:scale-95 transition-transform"
        >
          Commit These Actions
        </button>
      </div>
    );
  }

  return null;
}