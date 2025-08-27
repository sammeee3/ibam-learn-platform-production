'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RocketLaunchIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ChartBarIcon,
  BoltIcon,
  HeartIcon,
  BookOpenIcon,
  HandRaisedIcon,
  CheckCircleIcon,
  ClockIcon,
  FlagIcon,
  MapIcon,
  SparklesIcon,
  TrophyIcon,
  FireIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import confetti from 'canvas-confetti';

interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: 'immediate' | 'weekly' | 'monthly' | 'community';
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  completed: boolean;
  dueDate?: string;
  scripture?: string;
  prayer?: string;
  resources?: string[];
  milestones?: string[];
}

interface Pathway {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  actions: ActionItem[];
  badge?: string;
  level: number;
}

interface EnhancedLookingForwardProps {
  sessionId: string;
  userId: string;
  sessionTitle: string;
  onComplete: (selectedPathway: Pathway, completedActions: ActionItem[]) => void;
  spiritualLevel?: 'light' | 'moderate' | 'deep';
  gamificationEnabled?: boolean;
}

const PATHWAYS: Pathway[] = [
  {
    id: 'accelerator',
    name: 'The Accelerator',
    description: 'Fast-track implementation for immediate results',
    icon: RocketLaunchIcon,
    color: 'orange',
    level: 1,
    badge: '🚀 Speed Demon',
    actions: [
      {
        id: 'a1',
        title: 'Quick Win Implementation',
        description: 'Apply one key concept from today\'s lesson immediately',
        category: 'immediate',
        difficulty: 'easy',
        points: 50,
        completed: false,
        scripture: 'Whatever you do, work at it with all your heart. - Colossians 3:23',
        prayer: 'Lord, help me to act swiftly on what You\'ve shown me.',
        resources: ['Action template', 'Quick start guide'],
        milestones: ['Started within 24 hours', 'First result achieved']
      },
      {
        id: 'a2',
        title: 'Accountability Partner',
        description: 'Share your commitment with someone who will hold you accountable',
        category: 'immediate',
        difficulty: 'easy',
        points: 30,
        completed: false,
        scripture: 'Two are better than one, because they have a good return for their labor. - Ecclesiastes 4:9'
      },
      {
        id: 'a3',
        title: '7-Day Sprint',
        description: 'Complete a focused sprint applying all session concepts',
        category: 'weekly',
        difficulty: 'medium',
        points: 100,
        completed: false,
        dueDate: '7 days',
        milestones: ['Day 1: Setup', 'Day 3: Progress check', 'Day 7: Results review']
      }
    ]
  },
  {
    id: 'builder',
    name: 'The Builder',
    description: 'Systematic approach for sustainable growth',
    icon: ChartBarIcon,
    color: 'blue',
    level: 2,
    badge: '🏗️ Master Builder',
    actions: [
      {
        id: 'b1',
        title: 'Foundation Setting',
        description: 'Create a solid plan for implementing this lesson over 30 days',
        category: 'monthly',
        difficulty: 'medium',
        points: 75,
        completed: false,
        scripture: 'The plans of the diligent lead to profit. - Proverbs 21:5',
        prayer: 'Guide my planning, Lord, that I might build wisely.',
        resources: ['30-day template', 'Planning worksheet']
      },
      {
        id: 'b2',
        title: 'Weekly Milestones',
        description: 'Set and track weekly implementation milestones',
        category: 'weekly',
        difficulty: 'medium',
        points: 60,
        completed: false,
        milestones: ['Week 1: Foundation', 'Week 2: Development', 'Week 3: Testing', 'Week 4: Launch']
      },
      {
        id: 'b3',
        title: 'System Creation',
        description: 'Build a repeatable system based on this lesson',
        category: 'monthly',
        difficulty: 'hard',
        points: 150,
        completed: false,
        resources: ['System design template', 'Automation tools']
      }
    ]
  },
  {
    id: 'connector',
    name: 'The Connector',
    description: 'Community-focused implementation through collaboration',
    icon: UserGroupIcon,
    color: 'purple',
    level: 2,
    badge: '🤝 Community Champion',
    actions: [
      {
        id: 'c1',
        title: 'Teaching Moment',
        description: 'Share this lesson with your team or community',
        category: 'community',
        difficulty: 'medium',
        points: 80,
        completed: false,
        scripture: 'Each of you should use whatever gift you have received to serve others. - 1 Peter 4:10',
        prayer: 'Use me, Lord, to bless others with this knowledge.'
      },
      {
        id: 'c2',
        title: 'Group Challenge',
        description: 'Start a group challenge implementing this lesson together',
        category: 'community',
        difficulty: 'hard',
        points: 120,
        completed: false,
        resources: ['Challenge template', 'Group coordination guide'],
        milestones: ['5 people joined', '10 people joined', 'First group success']
      },
      {
        id: 'c3',
        title: 'Mentorship Circle',
        description: 'Form a mentorship circle for ongoing support',
        category: 'community',
        difficulty: 'medium',
        points: 90,
        completed: false
      }
    ]
  },
  {
    id: 'innovator',
    name: 'The Innovator',
    description: 'Creative application for breakthrough results',
    icon: SparklesIcon,
    color: 'emerald',
    level: 3,
    badge: '💡 Innovation Master',
    actions: [
      {
        id: 'i1',
        title: 'Creative Adaptation',
        description: 'Find a unique way to apply this lesson in your context',
        category: 'immediate',
        difficulty: 'hard',
        points: 100,
        completed: false,
        scripture: 'See, I am doing a new thing! - Isaiah 43:19',
        prayer: 'Open my mind to creative possibilities, Lord.'
      },
      {
        id: 'i2',
        title: 'Innovation Project',
        description: 'Start a project that combines this lesson with your unique gifts',
        category: 'monthly',
        difficulty: 'hard',
        points: 200,
        completed: false,
        resources: ['Innovation framework', 'Project planning tools'],
        milestones: ['Idea validated', 'Prototype created', 'First test completed']
      },
      {
        id: 'i3',
        title: 'Share Your Innovation',
        description: 'Document and share your creative application',
        category: 'community',
        difficulty: 'medium',
        points: 75,
        completed: false
      }
    ]
  }
];

export default function EnhancedLookingForward({
  sessionId,
  userId,
  sessionTitle,
  onComplete,
  spiritualLevel = 'moderate',
  gamificationEnabled = true
}: EnhancedLookingForwardProps) {
  const [selectedPathway, setSelectedPathway] = useState<Pathway | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [showScripture, setShowScripture] = useState<string | null>(null);
  const [showPrayer, setShowPrayer] = useState<string | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load saved progress
    const saved = localStorage.getItem(`lookforward_${sessionId}_${userId}`);
    if (saved) {
      const data = JSON.parse(saved);
      setCompletedActions(new Set(data.completedActions || []));
      setTotalPoints(data.points || 0);
      setCurrentStreak(data.streak || 0);
      setUnlockedBadges(data.badges || []);
    }
  }, [sessionId, userId]);

  const handleSelectPathway = (pathway: Pathway) => {
    setSelectedPathway(pathway);
    // Auto-expand first action
    if (pathway.actions.length > 0) {
      setExpandedActions(new Set([pathway.actions[0].id]));
    }
  };

  const handleToggleAction = (actionId: string, points: number) => {
    const newCompleted = new Set(completedActions);
    let newPoints = totalPoints;
    
    if (newCompleted.has(actionId)) {
      newCompleted.delete(actionId);
      newPoints -= points;
    } else {
      newCompleted.add(actionId);
      newPoints += points;
      
      // Celebration effect for completion
      if (gamificationEnabled) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      }
    }
    
    setCompletedActions(newCompleted);
    setTotalPoints(newPoints);
    
    // Check for pathway completion
    if (selectedPathway) {
      const pathwayComplete = selectedPathway.actions.every(a => newCompleted.has(a.id));
      if (pathwayComplete && selectedPathway.badge && !unlockedBadges.includes(selectedPathway.badge)) {
        setUnlockedBadges([...unlockedBadges, selectedPathway.badge]);
        // Big celebration for pathway completion
        confetti({
          particleCount: 200,
          spread: 120,
          origin: { y: 0.5 }
        });
      }
    }
    
    // Save progress
    localStorage.setItem(`lookforward_${sessionId}_${userId}`, JSON.stringify({
      completedActions: Array.from(newCompleted),
      points: newPoints,
      streak: currentStreak,
      badges: unlockedBadges,
      timestamp: new Date().toISOString()
    }));
  };

  const toggleActionExpansion = (actionId: string) => {
    const newExpanded = new Set(expandedActions);
    if (newExpanded.has(actionId)) {
      newExpanded.delete(actionId);
    } else {
      newExpanded.add(actionId);
    }
    setExpandedActions(newExpanded);
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string, text: string, gradient: string }> = {
      orange: {
        bg: 'bg-orange-500',
        text: 'text-orange-600',
        gradient: 'from-orange-400 to-red-600'
      },
      blue: {
        bg: 'bg-blue-500',
        text: 'text-blue-600',
        gradient: 'from-blue-400 to-indigo-600'
      },
      purple: {
        bg: 'bg-purple-500',
        text: 'text-purple-600',
        gradient: 'from-purple-400 to-pink-600'
      },
      emerald: {
        bg: 'bg-emerald-500',
        text: 'text-emerald-600',
        gradient: 'from-emerald-400 to-teal-600'
      }
    };
    return colors[color] || colors.blue;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'text-green-600 bg-green-100',
      medium: 'text-yellow-600 bg-yellow-100',
      hard: 'text-red-600 bg-red-100'
    };
    return colors[difficulty as keyof typeof colors] || colors.medium;
  };

  const handleCompletePathway = () => {
    if (selectedPathway) {
      const actionsToComplete = selectedPathway.actions.filter(a => completedActions.has(a.id));
      onComplete(selectedPathway, actionsToComplete);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Looking Forward with Purpose
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Transform {sessionTitle} into action
          </p>
          <p className="text-sm text-gray-500">
            Choose your implementation pathway and commit to specific actions
          </p>

          {/* Gamification Stats */}
          {gamificationEnabled && (
            <div className="flex justify-center gap-8 mt-6">
              <motion.div 
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md"
                whileHover={{ scale: 1.05 }}
              >
                <TrophyIcon className="w-6 h-6 text-yellow-500" />
                <span className="font-bold text-lg">{totalPoints} XP</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md"
                whileHover={{ scale: 1.05 }}
              >
                <FireIcon className="w-6 h-6 text-orange-500" />
                <span className="font-bold text-lg">{currentStreak} Day Streak</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md"
                whileHover={{ scale: 1.05 }}
              >
                <StarIcon className="w-6 h-6 text-purple-500" />
                <span className="font-bold text-lg">{unlockedBadges.length} Badges</span>
              </motion.div>
            </div>
          )}

          {/* Unlocked Badges Display */}
          {unlockedBadges.length > 0 && (
            <div className="flex justify-center gap-3 mt-4">
              {unlockedBadges.map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-3xl"
                  title={badge}
                >
                  {badge.split(' ')[0]}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {!selectedPathway ? (
          /* Pathway Selection */
          <div className="grid md:grid-cols-2 gap-6">
            {PATHWAYS.map((pathway, index) => {
              const Icon = pathway.icon;
              const colorClasses = getColorClasses(pathway.color);
              
              return (
                <motion.div
                  key={pathway.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleSelectPathway(pathway)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                >
                  <div className={`bg-gradient-to-r ${colorClasses.gradient} p-6 text-white`}>
                    <div className="flex items-center justify-between mb-3">
                      <Icon className="w-10 h-10" />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
                          Level {pathway.level}
                        </span>
                        {gamificationEnabled && pathway.badge && (
                          <span className="text-2xl" title={pathway.badge}>
                            {pathway.badge.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{pathway.name}</h3>
                    <p className="text-white/90">{pathway.description}</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-3">
                      {pathway.actions.map((action) => (
                        <div key={action.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${colorClasses.bg}`} />
                            <span className="text-sm text-gray-700">{action.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(action.difficulty)}`}>
                              {action.difficulty}
                            </span>
                            {gamificationEnabled && (
                              <span className="text-xs font-bold text-gray-500">
                                +{action.points} XP
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {pathway.actions.length} actions
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 bg-gradient-to-r ${colorClasses.gradient} text-white rounded-lg font-medium`}
                      >
                        Choose This Path →
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Selected Pathway Details */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Pathway Header */}
            <div className={`bg-gradient-to-r ${getColorClasses(selectedPathway.color).gradient} p-8 text-white`}>
              <button
                onClick={() => setSelectedPathway(null)}
                className="mb-4 text-white/80 hover:text-white flex items-center gap-2"
              >
                ← Back to pathways
              </button>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <selectedPathway.icon className="w-12 h-12" />
                    <h2 className="text-3xl font-bold">{selectedPathway.name}</h2>
                  </div>
                  <p className="text-white/90 text-lg">{selectedPathway.description}</p>
                </div>
                {gamificationEnabled && selectedPathway.badge && (
                  <div className="text-center">
                    <div className="text-5xl mb-2">{selectedPathway.badge.split(' ')[0]}</div>
                    <p className="text-sm text-white/80">{selectedPathway.badge.split(' ').slice(1).join(' ')}</p>
                  </div>
                )}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6 bg-white/20 rounded-full p-1">
                <div className="relative h-8 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-white/40"
                    initial={{ width: 0 }}
                    animate={{ 
                      width: `${(Array.from(completedActions).filter(id => 
                        selectedPathway.actions.some(a => a.id === id)
                      ).length / selectedPathway.actions.length) * 100}%` 
                    }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center font-medium">
                    {Array.from(completedActions).filter(id => 
                      selectedPathway.actions.some(a => a.id === id)
                    ).length} / {selectedPathway.actions.length} Actions Complete
                  </span>
                </div>
              </div>
            </div>

            {/* Actions List */}
            <div className="p-8">
              <h3 className="text-xl font-bold mb-6 text-gray-800">Your Action Items</h3>
              
              <div className="space-y-4">
                {selectedPathway.actions.map((action, index) => {
                  const isCompleted = completedActions.has(action.id);
                  const isExpanded = expandedActions.has(action.id);
                  
                  return (
                    <motion.div
                      key={action.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`
                        border-2 rounded-xl overflow-hidden transition-all
                        ${isCompleted ? 'border-green-400 bg-green-50' : 'border-gray-200 bg-white'}
                      `}
                    >
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-4">
                            <button
                              onClick={() => handleToggleAction(action.id, action.points)}
                              className={`
                                mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all
                                ${isCompleted 
                                  ? 'bg-green-500 border-green-500' 
                                  : 'bg-white border-gray-300 hover:border-indigo-500'}
                              `}
                            >
                              {isCompleted && <CheckCircleIcon className="w-4 h-4 text-white" />}
                            </button>
                            
                            <div className="flex-1">
                              <h4 className={`text-lg font-semibold ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                {action.title}
                              </h4>
                              <p className="text-gray-600 mt-1">{action.description}</p>
                              
                              <div className="flex flex-wrap items-center gap-3 mt-3">
                                <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(action.difficulty)}`}>
                                  {action.difficulty}
                                </span>
                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                  {action.category}
                                </span>
                                {action.dueDate && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 flex items-center gap-1">
                                    <ClockIcon className="w-3 h-3" />
                                    {action.dueDate}
                                  </span>
                                )}
                                {gamificationEnabled && (
                                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-600 font-bold">
                                    +{action.points} XP
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => toggleActionExpansion(action.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <motion.svg
                              className="w-5 h-5"
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </motion.svg>
                          </button>
                        </div>
                        
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-gray-200"
                            >
                              {/* Scripture */}
                              {spiritualLevel !== 'light' && action.scripture && (
                                <div className="mb-4">
                                  <button
                                    onClick={() => setShowScripture(showScripture === action.id ? null : action.id)}
                                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                                  >
                                    <BookOpenIcon className="w-4 h-4" />
                                    Scripture Inspiration
                                  </button>
                                  {showScripture === action.id && (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="mt-2 p-3 bg-indigo-50 rounded-lg border-l-4 border-indigo-400"
                                    >
                                      <p className="text-sm text-gray-700 italic">{action.scripture}</p>
                                    </motion.div>
                                  )}
                                </div>
                              )}
                              
                              {/* Prayer */}
                              {spiritualLevel === 'deep' && action.prayer && (
                                <div className="mb-4">
                                  <button
                                    onClick={() => setShowPrayer(showPrayer === action.id ? null : action.id)}
                                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium text-sm"
                                  >
                                    <HandRaisedIcon className="w-4 h-4" />
                                    Prayer Focus
                                  </button>
                                  {showPrayer === action.id && (
                                    <motion.div
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      className="mt-2 p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400"
                                    >
                                      <p className="text-sm text-gray-700 italic">{action.prayer}</p>
                                    </motion.div>
                                  )}
                                </div>
                              )}
                              
                              {/* Resources */}
                              {action.resources && action.resources.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-sm font-medium text-gray-700 mb-2">📚 Resources:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {action.resources.map((resource, idx) => (
                                      <span key={idx} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                        {resource}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Milestones */}
                              {action.milestones && action.milestones.length > 0 && (
                                <div>
                                  <p className="text-sm font-medium text-gray-700 mb-2">🎯 Milestones:</p>
                                  <div className="space-y-1">
                                    {action.milestones.map((milestone, idx) => (
                                      <div key={idx} className="flex items-center gap-2">
                                        <FlagIcon className="w-3 h-3 text-gray-400" />
                                        <span className="text-sm text-gray-600">{milestone}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Complete Button */}
              <motion.button
                onClick={handleCompletePathway}
                className={`
                  w-full mt-8 py-4 rounded-xl font-bold text-white transition-all
                  ${completedActions.size > 0
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg'
                    : 'bg-gray-300 cursor-not-allowed'}
                `}
                disabled={completedActions.size === 0}
                whileHover={completedActions.size > 0 ? { scale: 1.02 } : {}}
                whileTap={completedActions.size > 0 ? { scale: 0.98 } : {}}
              >
                {completedActions.size === 0
                  ? 'Complete at least one action to continue'
                  : `Complete Pathway with ${completedActions.size} Actions`}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Motivational Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-600 italic">
            "The path to success is to take massive, determined action."
          </p>
          <p className="text-sm text-gray-500 mt-2">- Tony Robbins</p>
        </motion.div>
      </div>
    </div>
  );
}