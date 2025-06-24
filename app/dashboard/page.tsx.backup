'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Lock, BookOpen, Target, BarChart3, Users, ArrowRight } from 'lucide-react';

// Sample data - replace with your Supabase data
const moduleData = [
  {
    id: 1,
    title: "Foundational Principles",
    description: "Business as God's gift",
    sessions: 4,
    completed: 3,
    icon: "📖",
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 2,
    title: "Success & Failure Factors", 
    description: "Keys to thriving",
    sessions: 4,
    completed: 1,
    icon: "🎯",
    color: "from-teal-500 to-blue-600"
  },
  {
    id: 3,
    title: "Marketing Excellence",
    description: "Reaching your audience",
    sessions: 5,
    completed: 0,
    icon: "📈",
    color: "from-green-500 to-teal-600"
  },
  {
    id: 4,
    title: "Financial Management",
    description: "Stewardship & growth",
    sessions: 4,
    completed: 0,
    icon: "💰",
    color: "from-orange-500 to-red-600"
  },
  {
    id: 5,
    title: "Business Planning",
    description: "Your roadmap to success",
    sessions: 3,
    completed: 0,
    icon: "🗺️",
    color: "from-purple-500 to-pink-600"
  }
];

export default function Dashboard() {
  const router = useRouter();
  const [userName] = useState("Jeff"); // Replace with actual user data

  const totalSessions = moduleData.reduce((sum, module) => sum + module.sessions, 0);
  const completedSessions = moduleData.reduce((sum, module) => sum + module.completed, 0);
  const progressPercentage = Math.round((completedSessions / totalSessions) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* IBAM Header - Same as Session Template */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-4">
              <img 
                src="/images/branding/ibam-logo-copy.jpg" 
                alt="IBAM Logo"
                className="h-10 w-auto"
                onError={(e) => {
                  e.currentTarget.src = "/images/branding/mini-logo.png";
                }}
              />
              <span className="text-xl font-bold text-slate-800">IBAM Learning Platform</span>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center gap-4">
              <span className="text-slate-600">Welcome back, {userName}!</span>
              <div className="w-10 h-10 bg-gradient-to-r from-teal-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-400 to-blue-600 bg-clip-text text-transparent mb-4">
            Welcome to Your Learning Journey
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mb-8">
            Designed to help you thrive as a Christ-centered entrepreneur in the marketplace. 
            Build your business on biblical principles and multiply disciples through your calling.
          </p>
          
          {/* Progress Overview */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Progress</h2>
            <div className="mb-4">
              <div className="flex justify-between text-sm text-slate-600 mb-2">
                <span>Sessions Completed</span>
                <span>{completedSessions} of {totalSessions}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-teal-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
            <p className="text-lg font-semibold text-slate-700">{progressPercentage}% Complete</p>
          </div>
        </div>

        {/* Learning Modules Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Learning Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moduleData.map((module) => (
              <div 
                key={module.id}
                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer overflow-hidden"
                onClick={() => router.push(`/modules/${module.id}`)}
              >
                {/* Module Header */}
                <div className={`bg-gradient-to-r ${module.color} p-6 text-white`}>
                  <div className="text-4xl mb-3">{module.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{module.title}</h3>
                  <p className="text-blue-100">{module.description}</p>
                </div>
                
                {/* Module Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-600">{module.sessions} sessions</span>
                    <div className="flex items-center gap-2">
                      {module.completed > 0 ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-400" />
                      )}
                      <span className="text-sm text-slate-600">
                        {module.completed}/{module.sessions} complete
                      </span>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${module.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${(module.completed / module.sessions) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <button className="w-full bg-gradient-to-r from-teal-400 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    {module.completed > 0 ? 'Continue Learning' : 'Start Module'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access Tools */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Business Planner */}
          <div 
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={() => router.push('/business-planner')}
          >
            <div className="text-5xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Business Planner</h3>
            <p className="text-slate-600 mb-6">Build your God-honoring business plan step by step</p>
            <button className="w-full bg-gradient-to-r from-orange-400 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
              Open Planner
            </button>
          </div>

          {/* Assessment */}
          <div 
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={() => router.push('/assessment/post')}
          >
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Assessment</h3>
            <p className="text-slate-600 mb-6">Evaluate your entrepreneurial readiness and growth areas</p>
            <button className="w-full bg-gradient-to-r from-purple-400 to-pink-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
              Take Assessment
            </button>
          </div>

          {/* Community */}
          <div 
            className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
            onClick={() => router.push('/community')}
          >
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Community</h3>
            <p className="text-slate-600 mb-6">Connect with fellow entrepreneurs on the same journey</p>
            <button className="w-full bg-gradient-to-r from-green-400 to-teal-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
              Join Discussion
            </button>
          </div>
        </div>

        {/* Inspiration Section */}
        <div className="bg-gradient-to-r from-teal-400 to-blue-600 rounded-2xl shadow-xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Your Marketplace Ministry</h2>
          <p className="text-xl text-blue-100 mb-6 max-w-3xl mx-auto">
            "Therefore go and make disciples of all nations..." - Matthew 28:19
          </p>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Remember: You're not just building a business, you're building God's kingdom. 
            Every interaction, every decision, every relationship is an opportunity to reflect Christ's love.
          </p>
        </div>
      </main>

      {/* IBAM Footer - Same as Session Template */}
      <footer className="bg-slate-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img 
              src="/images/branding/mini-logo.png" 
              alt="IBAM Mini Logo"
              className="h-8 w-auto"
            />
            <span className="font-bold text-2xl tracking-wide">DESIGNED TO THRIVE</span>
          </div>
          <p className="text-slate-400 text-lg mb-4">
            Multiplying disciples through marketplace ministry - one entrepreneur at a time.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
            <span>© 2025 IBAM Learning Platform</span>
            <span>•</span>
            <span>Empowering entrepreneurs globally</span>
            <span>•</span>
            <span>Built for Kingdom impact</span>
          </div>
        </div>
      </footer>
    </div>
  );
}