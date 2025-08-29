'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  Trophy,
  Flame,
  Users
} from 'lucide-react';
import { 
  scoreActionQuality, 
  getCoachingLevel, 
  getCoachingPrompts,
  getCelebrationMessage,
  MICRO_CELEBRATIONS,
  type ActionQualityScore 
} from '../../lib/smart-action-coach';

interface SmartActionCoachingInterfaceProps {
  sessionNumber: number;
  currentAction: string;
  onActionUpdate: (action: string) => void;
  onActionApproved: () => void;
  userPatterns?: {
    previousScore?: number;
    completionStreak?: number;
    totalActionsCompleted?: number;
  };
}

const SmartActionCoachingInterface: React.FC<SmartActionCoachingInterfaceProps> = ({
  sessionNumber,
  currentAction,
  onActionUpdate,
  onActionApproved,
  userPatterns = {}
}) => {
  const [qualityScore, setQualityScore] = useState<ActionQualityScore | null>(null);
  const [showPrompts, setShowPrompts] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [coachingPrompts, setCoachingPrompts] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Analyze action quality when action changes
  useEffect(() => {
    if (currentAction.length > 10) {
      setIsAnalyzing(true);
      // Simulate brief analysis delay for better UX
      const timer = setTimeout(() => {
        const score = scoreActionQuality(currentAction, sessionNumber);
        setQualityScore(score);
        setCoachingPrompts(getCoachingPrompts(currentAction, sessionNumber, score));
        setIsAnalyzing(false);
        
        // Show celebration if high quality
        if (score.overall >= 8) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 4000);
        }
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [currentAction, sessionNumber]);

  const coachingLevel = getCoachingLevel(sessionNumber);
  
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100'; 
    return 'text-red-600 bg-red-100';
  };

  const getOverallScoreColor = (score: number) => {
    if (score >= 8) return 'from-green-500 to-emerald-600';
    if (score >= 6) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  // Determine appropriate micro-celebration
  const getMicroCelebration = () => {
    if (userPatterns.totalActionsCompleted === 0) {
      return MICRO_CELEBRATIONS.first_action;
    }
    if (qualityScore && qualityScore.overall > (userPatterns.previousScore || 0)) {
      return MICRO_CELEBRATIONS.quality_improvement;
    }
    if (userPatterns.completionStreak === 3) {
      return MICRO_CELEBRATIONS.three_day_streak;
    }
    if (currentAction.toLowerCase().includes('tell') || currentAction.toLowerCase().includes('share')) {
      return MICRO_CELEBRATIONS.accountability_used;
    }
    if (sessionNumber >= 17 && (currentAction.toLowerCase().includes('teach') || currentAction.toLowerCase().includes('train'))) {
      return MICRO_CELEBRATIONS.taught_someone;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${
            coachingLevel.level === 'foundation' ? 'bg-blue-100' :
            coachingLevel.level === 'refinement' ? 'bg-purple-100' :
            coachingLevel.level === 'integration' ? 'bg-green-100' : 'bg-gold-100'
          }`}>
            <Target className={`w-6 h-6 ${
              coachingLevel.level === 'foundation' ? 'text-blue-600' :
              coachingLevel.level === 'refinement' ? 'text-purple-600' :
              coachingLevel.level === 'integration' ? 'text-green-600' : 'text-yellow-600'
            }`} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">Action Quality Coach</h3>
            <p className="text-sm text-gray-600 capitalize">
              {coachingLevel.level} Level • Session {sessionNumber}
            </p>
          </div>
        </div>
        
        {qualityScore && (
          <div className={`px-4 py-2 rounded-full ${getScoreColor(qualityScore.overall)}`}>
            <span className="font-bold">Score: {qualityScore.overall}/10</span>
          </div>
        )}
      </div>

      {/* Action Input */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Create Your Action Commitment:
        </label>
        <textarea
          value={currentAction}
          onChange={(e) => onActionUpdate(e.target.value)}
          placeholder={`Example for ${coachingLevel.level} level: "I will call 3 potential clients by Friday at 2pm and share results with my accountability partner."`}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
          rows={3}
        />
      </div>

      {/* Real-time Analysis */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 text-indigo-600"
          >
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
            <span className="text-sm">Analyzing your action quality...</span>
          </motion.div>
        )}

        {qualityScore && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            {/* Overall Score Display */}
            <div className={`p-4 rounded-lg bg-gradient-to-r ${getOverallScoreColor(qualityScore.overall)} text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-lg">Overall Quality: {qualityScore.overall}/10</h4>
                  <p className="text-white/90">
                    {qualityScore.overall >= 8 ? '🏆 Excellent Action!' :
                     qualityScore.overall >= 6 ? '👍 Good Action!' :
                     '💪 Let\'s improve this!'}
                  </p>
                </div>
                {qualityScore.overall >= 8 && (
                  <Trophy className="w-8 h-8 text-yellow-200" />
                )}
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${qualityScore.specific >= 6 ? 'text-green-600' : 'text-red-600'}`}>
                  {qualityScore.specific}
                </div>
                <div className="text-xs text-gray-600">Specific</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${qualityScore.measurable >= 6 ? 'text-green-600' : 'text-red-600'}`}>
                  {qualityScore.measurable}
                </div>
                <div className="text-xs text-gray-600">Measurable</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${qualityScore.timebound >= 6 ? 'text-green-600' : 'text-red-600'}`}>
                  {qualityScore.timebound}
                </div>
                <div className="text-xs text-gray-600">Time-bound</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className={`text-2xl font-bold ${qualityScore.accountability >= 6 ? 'text-green-600' : 'text-red-600'}`}>
                  {qualityScore.accountability}
                </div>
                <div className="text-xs text-gray-600">Accountability</div>
              </div>
            </div>

            {/* Coaching Suggestions */}
            {qualityScore.improvement_suggestions.length > 0 && (
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                <div className="flex items-start">
                  <Lightbulb className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800 mb-2">Coaching Suggestions:</h4>
                    <ul className="space-y-1">
                      {qualityScore.improvement_suggestions.map((suggestion, index) => (
                        <li key={index} className="text-sm text-blue-700">• {suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Progressive Coaching Prompts */}
            {coachingPrompts.length > 0 && (
              <div>
                <button
                  onClick={() => setShowPrompts(!showPrompts)}
                  className="flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  <Users className="w-4 h-4" />
                  {showPrompts ? 'Hide' : 'Show'} Coaching Questions ({coachingPrompts.length})
                </button>
                
                <AnimatePresence>
                  {showPrompts && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 space-y-2"
                    >
                      {coachingPrompts.map((prompt, index) => (
                        <div key={index} className="p-3 bg-indigo-50 rounded-lg border-l-4 border-indigo-400">
                          <p className="text-sm text-indigo-800">{prompt}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Micro-Celebration */}
      <AnimatePresence>
        {showCelebration && qualityScore && qualityScore.overall >= 8 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-4 rounded-lg text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-6 h-6" />
              <Flame className="w-6 h-6" />
            </div>
            <p className="font-bold">
              {getCelebrationMessage(sessionNumber, qualityScore, userPatterns.previousScore)}
            </p>
            {getMicroCelebration() && (
              <p className="text-sm text-green-100 mt-1">
                {getMicroCelebration()}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Approval Button */}
      <div className="flex justify-end">
        <button
          onClick={onActionApproved}
          disabled={!qualityScore || qualityScore.overall < 5}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            qualityScore && qualityScore.overall >= 5
              ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {qualityScore && qualityScore.overall >= 8 ? '🚀 Approve Excellent Action' :
           qualityScore && qualityScore.overall >= 5 ? '✅ Approve Action' :
           '📝 Improve Action First'}
        </button>
      </div>

      {/* Level Progress Indicator */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {coachingLevel.level.toUpperCase()} Level Progress
          </span>
          <span className="text-sm text-gray-600">
            Sessions {coachingLevel.sessionRange[0]}-{coachingLevel.sessionRange[1]}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${
              coachingLevel.level === 'foundation' ? 'bg-blue-500' :
              coachingLevel.level === 'refinement' ? 'bg-purple-500' :
              coachingLevel.level === 'integration' ? 'bg-green-500' : 'bg-yellow-500'
            }`}
            style={{ 
              width: `${((sessionNumber - coachingLevel.sessionRange[0]) / 
                        (coachingLevel.sessionRange[1] - coachingLevel.sessionRange[0])) * 100}%` 
            }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Next level at Session {coachingLevel.sessionRange[1] + 1}
        </p>
      </div>
    </div>
  );
};

export default SmartActionCoachingInterface;