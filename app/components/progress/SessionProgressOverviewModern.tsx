'use client';

import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, BookOpen, Heart, Target, MessageSquare, Info, X } from 'lucide-react';

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
  lookingUpProgress?: {
    wealth: boolean;
    people: boolean;
    reading: boolean;
    case: boolean;
    integrate: boolean;
    practice: boolean;
  };
}

const SessionProgressOverviewModern: React.FC<SessionProgressOverviewModernProps> = ({
  completedSections,
  sectionProgress,
  sessionProgressPercent,
  currentSection,
  lookingUpProgress
}) => {
  const [showWhatsLeftPopup, setShowWhatsLeftPopup] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const sections = [
    { id: 'lookback', name: 'Looking Back', icon: '⏮️', time: 15 },
    { id: 'lookup', name: 'Looking Up', icon: '🙏', time: 15 },
    { id: 'lookforward', name: 'Looking Forward', icon: '🎯', time: 15 }
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
              <span className="text-2xl font-bold text-gray-800">{sessionProgressPercent}%</span>
              <span className="text-xs text-gray-500">Complete</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">Session Progress</h3>
              {sessionProgressPercent < 100 && (
                <button
                  onClick={() => setShowWhatsLeftPopup(true)}
                  className="flex items-center space-x-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full text-sm font-medium transition-colors"
                >
                  <Info className="w-4 h-4" />
                  <span>What's Left?</span>
                </button>
              )}
            </div>
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
        <div className="flex flex-wrap gap-2 max-w-md relative">
          {sections.map((section) => {
            const isCompleted = completedSections[section.id as keyof typeof completedSections];
            const isCurrent = currentSection === section.id;
            
            return (
              <div key={section.id} className="relative">
                <div
                  className={`
                    px-3 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer
                    ${isCompleted 
                      ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200' 
                      : isCurrent
                      ? 'bg-blue-100 text-blue-700 border border-blue-300 shadow-sm hover:bg-blue-200'
                      : 'bg-gray-50 text-gray-500 border border-gray-200 hover:bg-gray-100'
                    }
                  `}
                  onMouseEnter={() => setHoveredSection(section.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <span className="mr-1">{section.icon}</span>
                  <span className="hidden sm:inline">{section.name}</span>
                  {isCompleted && <span className="ml-1">✓</span>}
                </div>

                {/* Hover Popup */}
                {hoveredSection === section.id && (
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 z-50 w-80 bg-white rounded-xl shadow-xl border border-gray-200 p-4">
                    <div className="text-center mb-3">
                      <div className="text-lg mb-1">{section.icon}</div>
                      <h4 className="font-semibold text-gray-800">{section.name}</h4>
                    </div>
                    
                    {section.id === 'lookback' && (
                      <div className="space-y-2">
                        <div className={`flex items-center space-x-2 text-sm ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                          <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span>Review previous commitments and accountability</span>
                        </div>
                        {isCompleted ? (
                          <div className="text-center p-2 bg-green-50 rounded-lg">
                            <span className="text-green-600 text-sm font-medium">✅ Complete!</span>
                          </div>
                        ) : (
                          <div className="text-center p-2 bg-blue-50 rounded-lg">
                            <span className="text-blue-600 text-sm">← Start here</span>
                          </div>
                        )}
                      </div>
                    )}

                    {section.id === 'lookup' && (
                      <div className="space-y-2">
                        {lookingUpProgress && (
                          <>
                            {[
                              { key: 'wealth', name: '💰 GROW Business', completed: lookingUpProgress.wealth },
                              { key: 'reading', name: '📖 Reading', completed: lookingUpProgress.reading },
                              { key: 'people', name: '👥 GROW Impact', completed: lookingUpProgress.people },
                              { key: 'case', name: '📋 Case Study', completed: lookingUpProgress.case },
                              { key: 'integrate', name: '🔗 Integrating Both', completed: lookingUpProgress.integrate },
                              { key: 'practice', name: '🧠 Memory Practice', completed: lookingUpProgress.practice }
                            ].map(sub => (
                              <div key={sub.key} className="flex items-center space-x-2 text-sm">
                                <div className={`w-2 h-2 rounded-full ${sub.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <span className={sub.completed ? 'text-green-700 line-through' : 'text-gray-700'}>
                                  {sub.name}
                                </span>
                                {!sub.completed && <span className="text-blue-500 text-xs">← Next</span>}
                              </div>
                            ))}
                          </>
                        )}
                        {isCompleted ? (
                          <div className="text-center p-2 bg-green-50 rounded-lg">
                            <span className="text-green-600 text-sm font-medium">✅ All Complete!</span>
                          </div>
                        ) : (
                          <div className="text-center p-2 bg-orange-50 rounded-lg">
                            <span className="text-orange-600 text-sm">In Progress...</span>
                          </div>
                        )}
                      </div>
                    )}

                    {section.id === 'lookforward' && (
                      <div className="space-y-2">
                        <div className={`flex items-center space-x-2 text-sm ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                          <div className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <span>Set goals and plan next actions</span>
                        </div>
                        {isCompleted ? (
                          <div className="text-center p-2 bg-green-50 rounded-lg">
                            <span className="text-green-600 text-sm font-medium">✅ Complete!</span>
                          </div>
                        ) : (
                          <div className="text-center p-2 bg-gray-50 rounded-lg">
                            <span className="text-gray-600 text-sm">Complete other sections first</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Arrow pointer */}
                    <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-l border-t border-gray-200 rotate-45"></div>
                  </div>
                )}
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
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
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

      {/* What's Left Popup */}
      {showWhatsLeftPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">What's Left to Complete?</h3>
              <button
                onClick={() => setShowWhatsLeftPopup(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Progress Overview */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-800 mb-1">{sessionProgressPercent}%</div>
                  <div className="text-sm text-gray-600">Session Complete</div>
                </div>
              </div>

              {/* Remaining Sections */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-800 mb-3">📋 Remaining Tasks:</h4>
                
                {sections.map((section) => {
                  const isCompleted = completedSections[section.id as keyof typeof completedSections];
                  const progress = sectionProgress[section.id as keyof typeof sectionProgress];
                  
                  if (isCompleted) return null; // Skip completed sections
                  
                  return (
                    <div key={section.id} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">{section.icon}</span>
                          <span className="font-medium text-gray-800">{section.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">{section.time} min</span>
                      </div>
                      
                      {section.id === 'lookup' && lookingUpProgress && (
                        <div className="mt-2 space-y-1">
                          <div className="text-xs text-gray-600 mb-1">Subsections:</div>
                          {[
                            { key: 'wealth', name: '💰 GROW Business', completed: lookingUpProgress.wealth },
                            { key: 'reading', name: '📖 Reading', completed: lookingUpProgress.reading },
                            { key: 'people', name: '👥 GROW Impact', completed: lookingUpProgress.people },
                            { key: 'case', name: '📋 Case Study', completed: lookingUpProgress.case },
                            { key: 'integrate', name: '🔗 Integrating Both', completed: lookingUpProgress.integrate },
                            { key: 'practice', name: '🧠 Memory Practice', completed: lookingUpProgress.practice }
                          ].map(sub => (
                            <div key={sub.key} className="flex items-center space-x-2 text-sm">
                              <div className={`w-2 h-2 rounded-full ${sub.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
                              <span className={sub.completed ? 'text-green-700 line-through' : 'text-gray-700'}>
                                {sub.name}
                              </span>
                              {!sub.completed && <span className="text-red-500">← Next</span>}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {section.id === 'lookback' && (
                        <div className="mt-2 text-sm text-gray-600">
                          Review previous commitments and accountability
                        </div>
                      )}
                      
                      {section.id === 'lookforward' && (
                        <div className="mt-2 text-sm text-gray-600">
                          Set goals and plan next actions
                        </div>
                      )}
                      
                      {progress > 0 && progress < 100 && (
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-600 mt-1">{progress}% complete</div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Next Steps */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">🎯 Next Steps:</h4>
                <p className="text-sm text-green-700">
                  {sessionProgressPercent === 0 && "Start with Looking Back to review your previous commitments."}
                  {sessionProgressPercent > 0 && sessionProgressPercent < 33 && "Continue with Looking Up for today's spiritual reflection."}
                  {sessionProgressPercent >= 33 && sessionProgressPercent < 66 && "Complete the remaining Looking Up subsections above."}
                  {sessionProgressPercent >= 66 && sessionProgressPercent < 100 && "Finish with Looking Forward to plan your next actions."}
                  {sessionProgressPercent === 100 && "🎉 Session complete! Great work on your progress."}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={() => setShowWhatsLeftPopup(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Got it! Let's continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionProgressOverviewModern;