'use client';

import React, { useState, useEffect } from 'react';

export default function DebugDashboard() {
  const [loading, setLoading] = useState(false);

  const handleContinueLearning = () => {
    console.log('Continue Learning clicked - navigating to Module 1');
    setLoading(true);
    window.location.href = '/modules/1/sessions/1';
  };

  const handleModuleClick = (moduleId: number) => {
    console.log(`Module ${moduleId} clicked - navigating`);
    setLoading(true);
    window.location.href = `/modules/${moduleId}/sessions/1`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Debug Header */}
        <div className="bg-yellow-100 border border-yellow-400 rounded-lg p-4 mb-8">
          <h1 className="text-2xl font-bold text-yellow-800">🔧 Debug Dashboard</h1>
          <p className="text-yellow-700">Testing navigation only - assessments bypassed</p>
          <p className="text-sm text-gray-600 mt-2">Check browser console for navigation logs</p>
        </div>

        {/* Simple Navigation Buttons */}
        <div className="space-y-4">
          
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Navigation Test</h2>
            
            <button
              onClick={handleContinueLearning}
              disabled={loading}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors mr-4 disabled:opacity-50"
            >
              {loading ? 'Navigating...' : 'Continue Learning (→ Module 1)'}
            </button>

            <button
              onClick={() => handleModuleClick(1)}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Navigating...' : 'Go to Module 1'}
            </button>
          </div>

          {/* Manual Navigation Links */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Manual Links</h2>
            
            <div className="space-y-2">
              <a 
                href="/modules/1/sessions/1" 
                className="block text-blue-600 hover:text-blue-800 underline"
                onClick={() => console.log('Manual link clicked: Module 1 Session 1')}
              >
                Direct Link: /modules/1/sessions/1
              </a>
              
              <a 
                href="/modules/3/sessions/1" 
                className="block text-blue-600 hover:text-blue-800 underline"
                onClick={() => console.log('Manual link clicked: Module 3 Session 1')}
              >
                Direct Link: /modules/3/sessions/1 (Marketing Triangle)
              </a>
              
              <a 
                href="/modules/5/sessions/3" 
                className="block text-blue-600 hover:text-blue-800 underline"
                onClick={() => console.log('Manual link clicked: Module 5 Session 3')}
              >
                Direct Link: /modules/5/sessions/3 (Final Session)
              </a>
            </div>
          </div>

          {/* Test Session Loading */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Expected Session Titles</h2>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>Module 1, Session 1: "Business is a Good Gift from God"</li>
              <li>Module 3, Session 1: "Marketing Triangle"</li>
              <li>Module 4, Session 1: "Funding Your Business"</li>
              <li>Module 5, Session 3: "Sample Implementation and Launch Strategy"</li>
            </ul>
            <p className="text-xs text-gray-500 mt-2">
              If sessions show these titles, database integration is working!
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}