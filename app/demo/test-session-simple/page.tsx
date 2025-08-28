'use client';

import { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function TestSessionSimple() {
  const [currentSection, setCurrentSection] = useState('overview');

  console.log('Rendering section:', currentSection);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Debug Info */}
        <div className="mb-4 p-4 bg-yellow-100 rounded">
          <p className="text-sm font-mono">Current Section: {currentSection}</p>
        </div>

        {/* Navigation Buttons */}
        <div className="mb-8 flex gap-2 flex-wrap">
          <button
            onClick={() => {
              console.log('Clicking overview');
              setCurrentSection('overview');
            }}
            className={`px-4 py-2 rounded ${
              currentSection === 'overview' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => {
              console.log('Clicking lookback');
              setCurrentSection('lookback');
            }}
            className={`px-4 py-2 rounded ${
              currentSection === 'lookback' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            Looking Back
          </button>
          <button
            onClick={() => {
              console.log('Clicking lookup');
              setCurrentSection('lookup');
            }}
            className={`px-4 py-2 rounded ${
              currentSection === 'lookup' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            Looking Up
          </button>
          <button
            onClick={() => {
              console.log('Clicking lookforward');
              setCurrentSection('lookforward');
            }}
            className={`px-4 py-2 rounded ${
              currentSection === 'lookforward' ? 'bg-blue-600 text-white' : 'bg-white'
            }`}
          >
            Looking Forward
          </button>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {currentSection === 'overview' && (
            <div>
              <h1 className="text-3xl font-bold mb-4">Session Overview</h1>
              <p className="text-gray-600 mb-6">
                Welcome to Module 1, Session 3: Leadership Through Service
              </p>
              <button
                onClick={() => {
                  console.log('Begin button clicked');
                  setCurrentSection('lookback');
                }}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Begin Session →
              </button>
            </div>
          )}

          {currentSection === 'lookback' && (
            <div>
              <h1 className="text-3xl font-bold mb-4">Looking Back</h1>
              <p className="text-gray-600 mb-6">
                Review your commitments from the previous session.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="p-4 border rounded-lg">
                  <p className="font-semibold">Previous Action 1</p>
                  <p className="text-gray-600">Meet with team members individually</p>
                  <div className="mt-3 flex gap-2">
                    <button className="px-3 py-1 bg-green-600 text-white rounded">Complete</button>
                    <button className="px-3 py-1 bg-yellow-600 text-white rounded">Learning</button>
                    <button className="px-3 py-1 bg-blue-600 text-white rounded">Defer</button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setCurrentSection('lookup')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue to Looking Up →
              </button>
            </div>
          )}

          {currentSection === 'lookup' && (
            <div>
              <h1 className="text-3xl font-bold mb-4">Looking Up</h1>
              <div className="p-6 bg-purple-50 rounded-lg mb-6">
                <p className="text-lg italic mb-2">
                  "Whoever wants to become great among you must be your servant"
                </p>
                <p className="text-sm text-purple-600">— Mark 10:43</p>
              </div>
              <button
                onClick={() => setCurrentSection('lookforward')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Continue to Looking Forward →
              </button>
            </div>
          )}

          {currentSection === 'lookforward' && (
            <div>
              <h1 className="text-3xl font-bold mb-4">Looking Forward</h1>
              <p className="text-gray-600 mb-6">
                What actions will you take this week?
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="p-4 border rounded-lg">
                  <label className="block mb-2 font-semibold">Business Action</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded"
                    placeholder="What specific action will you take?"
                  />
                  <input 
                    type="text" 
                    className="w-full p-2 border rounded mt-2 bg-purple-50"
                    placeholder="Kingdom purpose? (optional)"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  alert('Session complete! Actions saved.');
                  setCurrentSection('overview');
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Complete Session
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}