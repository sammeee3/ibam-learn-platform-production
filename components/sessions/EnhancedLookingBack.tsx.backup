'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SparklesIcon, 
  HeartIcon, 
  LightBulbIcon,
  BookOpenIcon,
  HandRaisedIcon,
  FireIcon,
  TrophyIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface Reflection {
  id: string;
  question: string;
  answer: string;
  category: 'gratitude' | 'learning' | 'growth' | 'challenge';
  scripture?: string;
  prayer?: string;
  points: number;
}

interface EnhancedLookingBackProps {
  sessionId: string;
  userId: string;
  onComplete: (reflections: Reflection[]) => void;
  spiritualLevel?: 'light' | 'moderate' | 'deep';
  gamificationEnabled?: boolean;
}

const REFLECTION_PROMPTS = {
  gratitude: {
    icon: HeartIcon,
    color: 'rose',
    questions: [
      "What moment from this session are you most grateful for?",
      "How did God show up in your learning today?",
      "What blessing emerged from this lesson?"
    ],
    scripture: "Give thanks in all circumstances; for this is God's will for you in Christ Jesus. - 1 Thessalonians 5:18",
    prayer: "Lord, thank You for the wisdom You've shared with me today. Help me to see Your hand in every lesson.",
    points: 10
  },
  learning: {
    icon: LightBulbIcon,
    color: 'amber',
    questions: [
      "What was your biggest 'aha' moment?",
      "Which concept challenged your previous thinking?",
      "What new understanding did you gain?"
    ],
    scripture: "The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding. - Proverbs 9:10",
    prayer: "Father, grant me wisdom to apply what I've learned for Your glory and the benefit of others.",
    points: 15
  },
  growth: {
    icon: SparklesIcon,
    color: 'emerald',
    questions: [
      "How have you grown from this session?",
      "What old pattern are you ready to release?",
      "What new strength did you discover?"
    ],
    scripture: "And we all, who with unveiled faces contemplate the Lord's glory, are being transformed into his image. - 2 Corinthians 3:18",
    prayer: "Transform me, Lord, through these lessons. Make me more like You each day.",
    points: 20
  },
  challenge: {
    icon: FireIcon,
    color: 'purple',
    questions: [
      "What challenged you most in this session?",
      "Where do you need God's help to overcome?",
      "What fear are you ready to face with faith?"
    ],
    scripture: "I can do all things through Christ who strengthens me. - Philippians 4:13",
    prayer: "Give me courage, Lord, to face my challenges with faith and determination.",
    points: 25
  }
};

export default function EnhancedLookingBack({ 
  sessionId, 
  userId, 
  onComplete,
  spiritualLevel = 'moderate',
  gamificationEnabled = true
}: EnhancedLookingBackProps) {
  const [currentCategory, setCurrentCategory] = useState<keyof typeof REFLECTION_PROMPTS>('gratitude');
  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showScripture, setShowScripture] = useState(false);
  const [showPrayer, setShowPrayer] = useState(false);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  
  const categories = Object.keys(REFLECTION_PROMPTS) as Array<keyof typeof REFLECTION_PROMPTS>;
  const currentCategoryData = REFLECTION_PROMPTS[currentCategory];
  const Icon = currentCategoryData.icon;

  useEffect(() => {
    // Load saved reflections and points
    const saved = localStorage.getItem(`reflections_${sessionId}_${userId}`);
    if (saved) {
      const data = JSON.parse(saved);
      setReflections(data.reflections || []);
      setTotalPoints(data.points || 0);
      setStreak(data.streak || 0);
    }
  }, [sessionId, userId]);

  const handleSubmitReflection = () => {
    if (!currentAnswer.trim()) return;

    const newReflection: Reflection = {
      id: `${Date.now()}`,
      question: currentCategoryData.questions[selectedQuestionIndex],
      answer: currentAnswer,
      category: currentCategory,
      scripture: spiritualLevel !== 'light' ? currentCategoryData.scripture : undefined,
      prayer: spiritualLevel === 'deep' ? currentCategoryData.prayer : undefined,
      points: currentCategoryData.points
    };

    const updatedReflections = [...reflections, newReflection];
    const newPoints = totalPoints + currentCategoryData.points;
    const newStreak = streak + 1;

    setReflections(updatedReflections);
    setTotalPoints(newPoints);
    setStreak(newStreak);
    setCurrentAnswer('');

    // Save to localStorage
    localStorage.setItem(`reflections_${sessionId}_${userId}`, JSON.stringify({
      reflections: updatedReflections,
      points: newPoints,
      streak: newStreak,
      timestamp: new Date().toISOString()
    }));

    // Move to next category or complete
    const currentIndex = categories.indexOf(currentCategory);
    if (currentIndex < categories.length - 1) {
      setCurrentCategory(categories[currentIndex + 1]);
      setSelectedQuestionIndex(0);
    } else {
      onComplete(updatedReflections);
    }
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      rose: 'from-rose-400 to-pink-600',
      amber: 'from-amber-400 to-orange-600',
      emerald: 'from-emerald-400 to-green-600',
      purple: 'from-purple-400 to-indigo-600'
    };
    return colors[color] || colors.purple;
  };

  const completedCategories = reflections.map(r => r.category);
  const progress = (completedCategories.length / categories.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Progress */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Looking Back with Gratitude
          </h1>
          <p className="text-gray-600 text-lg">
            Reflect on your journey and celebrate your growth
          </p>
          
          {/* Progress Bar */}
          <div className="mt-8 bg-white rounded-full shadow-lg p-2">
            <div className="relative h-6 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-600"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                {Math.round(progress)}% Complete
              </span>
            </div>
          </div>

          {/* Gamification Stats */}
          {gamificationEnabled && (
            <div className="flex justify-center gap-8 mt-6">
              <div className="flex items-center gap-2">
                <TrophyIcon className="w-6 h-6 text-yellow-500" />
                <span className="font-bold text-lg">{totalPoints} Points</span>
              </div>
              <div className="flex items-center gap-2">
                <FireIcon className="w-6 h-6 text-orange-500" />
                <span className="font-bold text-lg">{streak} Day Streak</span>
              </div>
              <div className="flex items-center gap-2">
                <StarIcon className="w-6 h-6 text-purple-500" />
                <span className="font-bold text-lg">{reflections.length}/{categories.length} Reflections</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Category Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {categories.map((cat) => {
            const CategoryIcon = REFLECTION_PROMPTS[cat].icon;
            const isCompleted = completedCategories.includes(cat);
            const isActive = cat === currentCategory;
            
            return (
              <motion.button
                key={cat}
                onClick={() => !isCompleted && setCurrentCategory(cat)}
                className={`
                  relative px-6 py-3 rounded-xl font-medium transition-all
                  ${isActive ? 'bg-white shadow-lg scale-105' : 'bg-white/60 hover:bg-white/80'}
                  ${isCompleted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
                whileHover={!isCompleted ? { scale: 1.05 } : {}}
                whileTap={!isCompleted ? { scale: 0.95 } : {}}
              >
                <div className="flex items-center gap-2">
                  <CategoryIcon className={`w-5 h-5 text-${REFLECTION_PROMPTS[cat].color}-500`} />
                  <span className="capitalize">{cat}</span>
                  {isCompleted && (
                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                  )}
                </div>
                {isActive && (
                  <motion.div
                    className={`absolute -inset-0.5 bg-gradient-to-r ${getColorClasses(REFLECTION_PROMPTS[cat].color)} rounded-xl opacity-20`}
                    layoutId="activeCategory"
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Main Reflection Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCategory}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Category Header */}
            <div className={`bg-gradient-to-r ${getColorClasses(currentCategoryData.color)} p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="w-8 h-8" />
                  <h2 className="text-2xl font-bold capitalize">{currentCategory} Reflection</h2>
                </div>
                {gamificationEnabled && (
                  <div className="bg-white/20 rounded-full px-4 py-2">
                    <span className="font-bold">+{currentCategoryData.points} pts</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8">
              {/* Scripture Display */}
              {spiritualLevel !== 'light' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6"
                >
                  <button
                    onClick={() => setShowScripture(!showScripture)}
                    className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    <BookOpenIcon className="w-5 h-5" />
                    <span>{showScripture ? 'Hide' : 'Show'} Scripture</span>
                  </button>
                  <AnimatePresence>
                    {showScripture && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400"
                      >
                        <p className="text-gray-700 italic">{currentCategoryData.scripture}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Question Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Choose a reflection question:
                </label>
                <div className="space-y-2">
                  {currentCategoryData.questions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedQuestionIndex(index)}
                      className={`
                        w-full text-left p-4 rounded-lg transition-all
                        ${selectedQuestionIndex === index 
                          ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-300' 
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'}
                      `}
                    >
                      <p className="text-gray-800">{question}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Answer Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reflection:
                </label>
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  rows={4}
                  placeholder="Take a moment to reflect and share your thoughts..."
                />
              </div>

              {/* Prayer Prompt */}
              {spiritualLevel === 'deep' && (
                <div className="mb-6">
                  <button
                    onClick={() => setShowPrayer(!showPrayer)}
                    className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    <HandRaisedIcon className="w-5 h-5" />
                    <span>{showPrayer ? 'Hide' : 'Show'} Prayer Prompt</span>
                  </button>
                  <AnimatePresence>
                    {showPrayer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400"
                      >
                        <p className="text-gray-700 italic">{currentCategoryData.prayer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleSubmitReflection}
                disabled={!currentAnswer.trim()}
                className={`
                  w-full py-4 rounded-lg font-bold text-white transition-all
                  ${currentAnswer.trim() 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg' 
                    : 'bg-gray-300 cursor-not-allowed'}
                `}
              >
                {reflections.length === categories.length - 1 ? 'Complete Reflection' : 'Continue to Next'}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Completed Reflections */}
        {reflections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-2xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800">Your Reflections</h3>
            <div className="space-y-3">
              {reflections.map((reflection) => {
                const RefIcon = REFLECTION_PROMPTS[reflection.category].icon;
                return (
                  <div
                    key={reflection.id}
                    className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <RefIcon className={`w-5 h-5 text-${REFLECTION_PROMPTS[reflection.category].color}-500 mt-1`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 mb-1">{reflection.question}</p>
                        <p className="text-gray-800">{reflection.answer}</p>
                      </div>
                      {gamificationEnabled && (
                        <span className="text-sm font-bold text-green-600">+{reflection.points}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}