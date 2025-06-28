'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Sample module data - replace with your actual data
const moduleData = {
  "1": {
    title: "Foundational Principles",
    description: "Understanding business as God's gift and calling",
    sessions: [
      {
        id: 1,
        title: "Business is a Good Gift from God",
        description: "Discover how business reflects God's creative nature",
        completed: true,
        locked: false
      },
      {
        id: 2,
        title: "Business Leaders Work Together with Church/Spiritual Leaders",
        description: "Partnership between marketplace and ministry",
        completed: true,
        locked: false
      },
      {
        id: 3,
        title: "The Role of Business in God's Kingdom",
        description: "Your business as kingdom ministry",
        completed: true,
        locked: false
      },
      {
        id: 4,
        title: "Biblical Principles for Business Excellence",
        description: "Operating with integrity and excellence",
        completed: false,
        locked: false
      }
    ]
  },
  "2": {
    title: "Success & Failure Factors",
    description: "Learning from both victories and setbacks",
    sessions: [
      {
        id: 1,
        title: "Reasons for Failure",
        description: "Understanding and avoiding common pitfalls",
        completed: true,
        locked: false
      },
      {
        id: 2,
        title: "Keys to Success",
        description: "Biblical principles for thriving in business",
        completed: false,
        locked: false
      },
      {
        id: 3,
        title: "Learning from Setbacks",
        description: "Turning failures into stepping stones",
        completed: false,
        locked: true
      },
      {
        id: 4,
        title: "Building Resilience",
        description: "Developing perseverance through faith",
        completed: false,
        locked: true
      }
    ]
  }
};

export default function ModuleOverview() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params?.moduleId as string;
  
  const module = (moduleData as any)[moduleId] || {
    title: "Module Not Found",
    description: "This module is not available",
    sessions: []
  };

  const completedSessions = module.sessions.filter(session => session.completed).length;
  const progressPercentage = Math.round((completedSessions / module.sessions.length) * 100);

  return (
    <div className="min-h-screen" style={{backgroundColor: '#f8fafc'}}>
      {/* IBAM Header - Same as session template */}
      <div style={{background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img 
                src="/images/branding/ibam-logo-copy.jpg" 
                alt="IBAM Logo"
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.src = "/images/branding/mini-logo.png";
                }}
              />
              <div>
                <div className="text-white/90 text-sm md:text-base mb-1">
                  Module {moduleId}
                </div>
                <h1 className="text-white text-xl md:text-3xl font-bold mb-2">
                  {module.title}
                </h1>
                <div className="flex flex-wrap gap-4 text-sm md:text-base text-white/90">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{backgroundColor: '#10b981'}}></span>
                    {progressPercentage}% complete
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/70">{completedSessions} of {module.sessions.length} sessions</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all"
              >
                🏠 <span className="hidden sm:inline">Dashboard</span>
              </button>
            </div>
          </div>
          
          {/* Progress Bar - Same as session template */}
          <div className="mt-6 bg-white/20 rounded-full h-3">
            <div 
              className="h-3 rounded-full transition-all duration-500"
              style={{
                width: `${progressPercentage}%`,
                background: 'linear-gradient(90deg, #4ECDC4 0%, #10b981 100%)'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        
        {/* Module Description */}
        <div className="bg-gradient-to-r from-[#4ECDC4]/10 to-[#10b981]/10 rounded-2xl border-2 border-[#4ECDC4]/20 p-6 md:p-8 mb-8">
          <h2 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-4 flex items-center gap-3">
            <span className="text-4xl md:text-5xl">📖</span>
            Module Overview
          </h2>
          <div className="bg-white rounded-xl p-4 md:p-6 border border-[#4ECDC4]/20">
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-4">
              {module.description}
            </p>
            <div className="flex items-center gap-4">
              <div className="text-3xl">🎯</div>
              <div>
                <div className="font-semibold text-[#2C3E50]">Learning Objectives</div>
                <div className="text-gray-600">Build a biblical foundation for marketplace ministry</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sessions Grid */}
        <div className="mb-8">
          <h2 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-6 flex items-center gap-3">
            <span className="text-4xl md:text-5xl">📚</span>
            Sessions ({completedSessions}/{module.sessions.length} Complete)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {module.sessions.map((session, index) => (
              <div 
                key={session.id}
                className={`bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8 transition-all duration-300 ${
                  session.locked 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'hover:shadow-xl hover:-translate-y-1 cursor-pointer'
                }`}
                onClick={() => !session.locked && router.push(`/modules/${moduleId}/sessions/${session.id}`)}
              >
                {/* Session Number and Status */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${
                      session.completed 
                        ? 'bg-[#10b981]' 
                        : session.locked 
                          ? 'bg-gray-400' 
                          : 'bg-[#4ECDC4]'
                    }`}>
                      {session.completed ? '✓' : session.locked ? '🔒' : session.id}
                    </div>
                    <div>
                      <div className="font-semibold text-[#2C3E50]">Session {session.id}</div>
                      <div className="text-sm text-gray-500">
                        {session.completed ? 'Completed' : session.locked ? 'Locked' : 'Available'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Session Icon */}
                  <div className="text-3xl">
                    {session.completed ? '🌟' : session.locked ? '🔒' : '▶️'}
                  </div>
                </div>
                
                {/* Session Content */}
                <h3 className="font-bold text-[#2C3E50] text-lg md:text-xl mb-3">
                  {session.title}
                </h3>
                <p className="text-gray-600 text-base md:text-lg mb-6 leading-relaxed">
                  {session.description}
                </p>
                
                {/* Action Button */}
                <button 
                  className={`w-full py-3 px-6 rounded-xl font-semibold text-lg transition-all duration-300 ${
                    session.locked
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : session.completed
                        ? 'bg-[#10b981] text-white hover:bg-[#059669]'
                        : 'text-white hover:-translate-y-1'
                  }`}
                  style={!session.locked && !session.completed ? {
                    background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)'
                  } : {}}
                  disabled={session.locked}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!session.locked) {
                      router.push(`/modules/${moduleId}/sessions/${session.id}`);
                    }
                  }}
                >
                  {session.completed ? 'Review Session' : session.locked ? 'Complete Previous Sessions' : 'Start Session'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Module Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Business Plan Integration */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8">
            <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-4 flex items-center gap-3">
              <span className="text-4xl md:text-5xl">💼</span>
              Business Plan
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Your session responses are building your personalized business plan.
            </p>
            <button 
              onClick={() => router.push('/business-planner')}
              className="w-full py-3 px-6 rounded-xl font-semibold text-lg text-white transition-all duration-300"
              style={{background: 'linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)'}}
            >
              View Business Plan
            </button>
          </div>

          {/* Module Assessment */}
          <div className="bg-white rounded-2xl shadow-lg border border-[#e2e8f0] p-6 md:p-8">
            <h3 className="font-bold text-[#2C3E50] text-xl md:text-2xl mb-4 flex items-center gap-3">
              <span className="text-4xl md:text-5xl">📊</span>
              Assessment
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Evaluate your understanding and application of module concepts.
            </p>
            <button 
              onClick={() => router.push('/assessment/post')}
              className="w-full py-3 px-6 rounded-xl font-semibold text-lg text-white transition-all duration-300"
              style={{background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)'}}
            >
              Take Assessment
            </button>
          </div>
        </div>
      </div>

      {/* IBAM Footer - Same as session template */}
      <footer style={{background: '#2C3E50'}} className="text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex justify-center items-center gap-3 mb-4">
              <img 
                src="/images/branding/mini-logo.png" 
                alt="IBAM Mini Logo"
                className="h-8 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-xl md:text-2xl font-bold">International Business as Mission</span>
            </div>
            <p className="text-gray-400 text-lg md:text-xl">
              © 2025 IBAM International Business as Mission. Equipping entrepreneurs to transform communities through faith-driven business.
            </p>
            <p style={{color: '#4ECDC4'}} className="text-base md:text-lg mt-2 font-semibold">
              DESIGNED TO THRIVE
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}