'use client';

import React, { useState } from 'react';
import SmartActionCoachingInterface from '../../components/coaching/SmartActionCoachingInterface';
import UnifiedLookingForward from '../../components/sections/LookingForward/UnifiedLookingForward';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';

// Mock session data for testing
const mockSessionData = {
  id: 'demo-session',
  module_id: 1,
  session_number: 5,
  title: 'Demo Session: SMART Action Coaching',
  subtitle: 'Testing Progressive Action Quality System',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
};

const SmartActionCoachingDemo = () => {
  const [sessionNumber, setSessionNumber] = useState(5);
  const [testAction, setTestAction] = useState('');
  const [demoStage, setDemoStage] = useState<'coaching' | 'unified'>('coaching');
  const [userStats, setUserStats] = useState({
    totalCompleted: 3,
    completionStreak: 2,
    lastQualityScore: 6
  });

  const sampleActions = [
    "I will pray more",
    "I will call 3 potential clients by Friday at 2pm and share results with John",
    "I will create a morning routine that includes prayer and business planning from 6-7am daily this week",
    "I will teach my assistant the client onboarding process by Wednesday and have them practice with 2 mock scenarios"
  ];

  const handleActionApproved = () => {
    alert('Demo Action Approved! In real app, this would save to database.');
  };

  const handleDemoComplete = () => {
    alert('Demo Complete! In real app, this would mark the section as complete.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <Link 
              href="/demo" 
              className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Demos
            </Link>
            <button
              onClick={() => setTestAction('')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-700"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Demo
            </button>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎯 SMART Action Coaching Demo
          </h1>
          <p className="text-gray-600 mb-6">
            Test the progressive action quality system across different session levels (1-22)
          </p>

          {/* Demo Controls */}
          <div className="grid md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Number (affects coaching level):
              </label>
              <select
                value={sessionNumber}
                onChange={(e) => setSessionNumber(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
              >
                <optgroup label="Foundation (1-4)">
                  <option value={1}>Session 1 - First Time</option>
                  <option value={4}>Session 4 - Foundation Complete</option>
                </optgroup>
                <optgroup label="Refinement (5-10)">
                  <option value={5}>Session 5 - Quality Focus</option>
                  <option value={10}>Session 10 - Refinement Master</option>
                </optgroup>
                <optgroup label="Integration (11-16)">
                  <option value={11}>Session 11 - Building Patterns</option>
                  <option value={16}>Session 16 - Integration Expert</option>
                </optgroup>
                <optgroup label="Mastery (17-22)">
                  <option value={17}>Session 17 - Teaching Others</option>
                  <option value={22}>Session 22 - Full Mastery</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Demo Component:
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setDemoStage('coaching')}
                  className={`px-4 py-2 rounded font-medium ${
                    demoStage === 'coaching' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Coaching Only
                </button>
                <button
                  onClick={() => setDemoStage('unified')}
                  className={`px-4 py-2 rounded font-medium ${
                    demoStage === 'unified' 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  Full Interface
                </button>
              </div>
            </div>
          </div>

          {/* Sample Actions */}
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Quick Test Actions (click to use):
            </h3>
            <div className="grid md:grid-cols-2 gap-2">
              {sampleActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => setTestAction(action)}
                  className="text-left p-3 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
                >
                  <div className="text-sm font-medium text-blue-800">
                    {index === 0 ? 'Beginner' : index === 1 ? 'Good' : index === 2 ? 'Better' : 'Excellent'}
                  </div>
                  <div className="text-xs text-blue-600 truncate">{action}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Demo Component */}
        {demoStage === 'coaching' ? (
          <SmartActionCoachingInterface
            sessionNumber={sessionNumber}
            currentAction={testAction}
            onActionUpdate={setTestAction}
            onActionApproved={handleActionApproved}
            userPatterns={{
              previousScore: userStats.lastQualityScore,
              completionStreak: userStats.completionStreak,
              totalActionsCompleted: userStats.totalCompleted
            }}
          />
        ) : (
          <UnifiedLookingForward
            sessionData={mockSessionData}
            pathwayMode="individual"
            onComplete={handleDemoComplete}
            isExpanded={true}
            onToggleExpanded={() => {}}
          />
        )}

        {/* Feature Highlights */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">🚀 New Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Progressive Coaching</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Sessions 1-4: Learn basics (specific + timed)</li>
                <li>• Sessions 5-10: Add quality (measurable + accountability)</li>
                <li>• Sessions 11-16: Build patterns (compound actions)</li>
                <li>• Sessions 17-22: Multiply impact (teach others)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Real-time Feedback</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Instant action quality scoring (0-10)</li>
                <li>• Contextual improvement suggestions</li>
                <li>• Celebration for high-quality actions</li>
                <li>• Progressive difficulty adjustment</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Success Metrics */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
          <h2 className="text-xl font-bold text-green-800 mb-4">📈 Expected Outcomes</h2>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">70%+</div>
              <div className="text-sm text-gray-600">Action Completion Rate</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">8/10</div>
              <div className="text-sm text-gray-600">Average Action Quality</div>
            </div>
            <div className="bg-white rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">22</div>
              <div className="text-sm text-gray-600">Sessions to Mastery</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartActionCoachingDemo;