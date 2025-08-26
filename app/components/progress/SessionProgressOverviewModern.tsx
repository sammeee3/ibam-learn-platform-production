'use client';

import React from 'react';
import { CheckCircle2, Circle, Clock, BookOpen, Heart, Target, MessageSquare } from 'lucide-react';

interface SessionProgressOverviewModernProps {
  completedSections: {
    lookback: boolean;
    lookup: boolean;
    content: boolean;
    quiz: boolean;
    lookforward: boolean;
  };
  sectionProgress: {
    lookback: number;
    lookup: number;
    content: number;
    quiz: number;
    lookforward: number;
  };
  sessionProgressPercent: number;
  currentSection?: string;
}

const SessionProgressOverviewModern: React.FC<SessionProgressOverviewModernProps> = ({
  completedSections,
  sectionProgress,
  sessionProgressPercent,
  currentSection
}) => {
  const sections = [
    { id: 'lookback', name: 'Looking Back', icon: '⏮️', time: 5 },
    { id: 'lookup', name: 'Looking Up', icon: '🙏', time: 10 },
    { id: 'content', name: 'Main Content', icon: '📖', time: 15 },
    { id: 'quiz', name: 'Knowledge Check', icon: '✅', time: 5 },
    { id: 'lookforward', name: 'Looking Forward', icon: '🎯', time: 10 }
  ];

  const totalTime = 45;
  const completedTime = sections
    .filter(s => completedSections[s.id as keyof typeof completedSections])
    .reduce((acc, s) => acc + s.time, 0);
  const remainingTime = totalTime - completedTime;

  // Calculate circle progress
  const radius = 60;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (sessionProgressPercent / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
      <div className="flex items-start justify-between">
        {/* Circular Progress */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <svg
              height={radius * 2}
              width={radius * 2}
              className="transform -rotate-90"
            >
              {/* Background circle */}
              <circle
                stroke="#E5E7EB"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              {/* Progress circle */}
              <circle
                stroke="url(#gradient)"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="transition-all duration-500 ease-out"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-gray-800">{sessionProgressPercent}%</span>
              <span className="text-xs text-gray-500">Complete</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Session Progress</h3>
            {remainingTime > 0 ? (
              <p className="text-sm text-gray-600 flex items-center">
                <Clock className="w-4 h-4 mr-1 text-blue-500" />
                About {remainingTime} minutes remaining
              </p>
            ) : (
              <p className="text-sm text-green-600 font-medium">
                🎉 Session Complete!
              </p>
            )}
          </div>
        </div>

        {/* Section Pills */}
        <div className="flex flex-wrap gap-2 max-w-md">
          {sections.map((section) => {
            const isCompleted = completedSections[section.id as keyof typeof completedSections];
            const isCurrent = currentSection === section.id;
            
            return (
              <div
                key={section.id}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-all
                  ${isCompleted 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : isCurrent
                    ? 'bg-blue-100 text-blue-700 border border-blue-300 shadow-sm'
                    : 'bg-gray-50 text-gray-500 border border-gray-200'
                  }
                `}
              >
                <span className="mr-1">{section.icon}</span>
                <span className="hidden sm:inline">{section.name}</span>
                {isCompleted && <span className="ml-1">✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Steps - Mobile Friendly */}
      <div className="mt-6 sm:hidden">
        <div className="flex justify-between items-center">
          {sections.map((section, index) => {
            const isCompleted = completedSections[section.id as keyof typeof completedSections];
            const isCurrent = currentSection === section.id;
            
            return (
              <React.Fragment key={section.id}>
                <div className="flex flex-col items-center">
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-lg
                    ${isCompleted 
                      ? 'bg-green-500 text-white' 
                      : isCurrent
                      ? 'bg-blue-500 text-white animate-pulse'
                      : 'bg-gray-200'
                    }
                  `}>
                    {section.icon}
                  </div>
                  <span className="text-xs mt-1 text-gray-600">{section.time}m</span>
                </div>
                {index < sections.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${
                    completedSections[sections[index + 1].id as keyof typeof completedSections]
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Motivational Message */}
      {sessionProgressPercent > 0 && sessionProgressPercent < 100 && (
        <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <p className="text-sm text-center text-gray-700">
            {sessionProgressPercent < 25 && "🚀 Great start! Keep going!"}
            {sessionProgressPercent >= 25 && sessionProgressPercent < 50 && "💪 You're making excellent progress!"}
            {sessionProgressPercent >= 50 && sessionProgressPercent < 75 && "🔥 Over halfway there! Don't stop now!"}
            {sessionProgressPercent >= 75 && sessionProgressPercent < 100 && "⭐ Almost done! Final stretch!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionProgressOverviewModern;