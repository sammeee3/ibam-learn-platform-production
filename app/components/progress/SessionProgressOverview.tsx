'use client';

import React from 'react';
import { CheckCircle2, Circle, Clock, BookOpen, Heart, Target, MessageSquare, ChevronRight } from 'lucide-react';

interface SessionProgressOverviewProps {
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

const SessionProgressOverview: React.FC<SessionProgressOverviewProps> = ({
  completedSections,
  sectionProgress,
  sessionProgressPercent,
  currentSection
}) => {
  const sections = [
    { 
      id: 'lookback', 
      name: 'Looking Back', 
      icon: Clock, 
      description: 'Review previous commitments',
      estimatedTime: '5 min'
    },
    { 
      id: 'lookup', 
      name: 'Looking Up', 
      icon: Heart, 
      description: 'Scripture and reflection',
      estimatedTime: '10 min'
    },
    { 
      id: 'content', 
      name: 'Main Content', 
      icon: BookOpen, 
      description: 'Core learning material',
      estimatedTime: '15 min'
    },
    { 
      id: 'quiz', 
      name: 'Knowledge Check', 
      icon: MessageSquare, 
      description: 'Test your understanding',
      estimatedTime: '5 min'
    },
    { 
      id: 'lookforward', 
      name: 'Looking Forward', 
      icon: Target, 
      description: 'Plan your next actions',
      estimatedTime: '10 min'
    }
  ];

  const totalTimeRemaining = sections
    .filter(s => !completedSections[s.id as keyof typeof completedSections])
    .reduce((acc, s) => acc + parseInt(s.estimatedTime), 0);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800">Session Progress</h3>
          <span className="text-2xl font-bold text-blue-600">{sessionProgressPercent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${sessionProgressPercent}%` }}
          />
        </div>
        {totalTimeRemaining > 0 && (
          <p className="text-sm text-gray-600 mt-2">
            ⏱️ Approximately {totalTimeRemaining} minutes remaining
          </p>
        )}
      </div>

      {/* Section Checklist */}
      <div className="space-y-3">
        {sections.map((section, index) => {
          const isCompleted = completedSections[section.id as keyof typeof completedSections];
          const isCurrent = currentSection === section.id;
          const progress = sectionProgress[section.id as keyof typeof sectionProgress];
          const Icon = section.icon;

          return (
            <div 
              key={section.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                isCompleted ? 'bg-green-50 border border-green-200' :
                isCurrent ? 'bg-blue-50 border border-blue-300' :
                'bg-gray-50 border border-gray-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`relative ${isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-400'}`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                  {!isCompleted && progress > 0 && progress < 100 && (
                    <div 
                      className="absolute inset-0 rounded-full border-2 border-blue-500"
                      style={{
                        clipPath: `polygon(0 0, ${progress}% 0, ${progress}% 100%, 0% 100%)`,
                      }}
                    />
                  )}
                </div>
                
                <Icon className={`w-5 h-5 ${
                  isCompleted ? 'text-green-600' : 
                  isCurrent ? 'text-blue-600' : 
                  'text-gray-400'
                }`} />
                
                <div>
                  <p className={`font-semibold ${
                    isCompleted ? 'text-green-700' : 
                    isCurrent ? 'text-blue-700' : 
                    'text-gray-700'
                  }`}>
                    {section.name}
                    {isCurrent && <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Current</span>}
                  </p>
                  <p className={`text-xs ${
                    isCompleted ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {section.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!isCompleted && (
                  <span className="text-xs text-gray-500">
                    {section.estimatedTime}
                  </span>
                )}
                {isCompleted && (
                  <span className="text-xs text-green-600 font-semibold">
                    Complete
                  </span>
                )}
                {isCurrent && !isCompleted && (
                  <ChevronRight className="w-4 h-4 text-blue-500 animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational Message */}
      {sessionProgressPercent === 100 && (
        <div className="mt-6 bg-gradient-to-r from-green-400 to-blue-500 text-white p-4 rounded-lg text-center">
          <p className="font-bold text-lg">🎉 Congratulations!</p>
          <p className="text-sm mt-1">You've completed this session! Ready for the next one?</p>
        </div>
      )}
      
      {sessionProgressPercent > 0 && sessionProgressPercent < 100 && (
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <p className="text-blue-700 text-sm text-center">
            💪 Keep going! You're making great progress.
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionProgressOverview;