// Progressive SMART Action Coaching System
// Guides students from Session 1-22 to create increasingly sophisticated actions

export interface SMARTActionCoach {
  sessionRange: [number, number];
  level: 'foundation' | 'refinement' | 'integration' | 'mastery';
  requiredElements: string[];
  coachPrompts: string[];
  successCriteria: string[];
  celebrationMessage: string;
}

export interface ActionQualityScore {
  overall: number;
  specific: number;
  measurable: number;
  timebound: number;
  accountability: number;
  improvement_suggestions: string[];
}

export interface UserActionPattern {
  user_id: string;
  best_completion_days: string[];
  preferred_timeframes: string[];
  successful_action_types: string[];
  accountability_effectiveness: number;
  quality_progression: number[];
  last_updated: Date;
}

// Progressive coaching levels based on session ranges
export const COACHING_LEVELS: Record<string, SMARTActionCoach> = {
  foundation: {
    sessionRange: [1, 4],
    level: 'foundation',
    requiredElements: ['specific_outcome', 'timeframe'],
    coachPrompts: [
      "Let's make this more specific. What exactly will you do?",
      "When exactly will you do this? Be specific about the day and time.",
      "How will you know if you completed this action?"
    ],
    successCriteria: [
      'Action includes specific outcome',
      'Action includes exact timeframe',
      'Action is achievable in given timeframe'
    ],
    celebrationMessage: "Great! You're learning to create clear, specific actions. This is the foundation of achievement!"
  },
  
  refinement: {
    sessionRange: [5, 10], 
    level: 'refinement',
    requiredElements: ['specific_outcome', 'timeframe', 'measurable_result', 'accountability_person'],
    coachPrompts: [
      "How will you measure the success of this action?",
      "What specific result do you expect to see?",
      "Who will help hold you accountable for this commitment?",
      "Is this action challenging enough to create growth?"
    ],
    successCriteria: [
      'Action includes measurable outcome',
      'Action specifies accountability person',
      'Action describes expected result',
      'Action demonstrates growth mindset'
    ],
    celebrationMessage: "Excellent! You're developing quality over quantity. Your actions now have clear success measures!"
  },

  integration: {
    sessionRange: [11, 16],
    level: 'integration', 
    requiredElements: ['specific_outcome', 'timeframe', 'measurable_result', 'accountability_person', 'builds_on_previous'],
    coachPrompts: [
      "How does this action build on your previous successes?",
      "What pattern are you noticing in your most successful actions?", 
      "How can this action create momentum for your next session?",
      "What would the extraordinary version of this action look like?"
    ],
    successCriteria: [
      'Action connects to previous wins',
      'Action demonstrates pattern recognition',
      'Action creates compound momentum',
      'Action shows strategic thinking'
    ],
    celebrationMessage: "Outstanding! You're now creating actions that build on each other. This is compound growth!"
  },

  mastery: {
    sessionRange: [17, 22],
    level: 'mastery',
    requiredElements: ['specific_outcome', 'timeframe', 'measurable_result', 'accountability_person', 'builds_on_previous', 'multiplication_element'],
    coachPrompts: [
      "Who can you teach this skill to?",
      "How can you make this action repeatable for others?",
      "What system could you create from this action?",
      "How does this action serve something bigger than yourself?"
    ],
    successCriteria: [
      'Action includes teaching/sharing element',
      'Action demonstrates systems thinking',
      'Action serves larger purpose',
      'Action shows leadership development'
    ],
    celebrationMessage: "Masterful! You're not just achieving - you're multiplying impact through others. This is true leadership!"
  }
};

// Dan Sullivan inspired reflection questions based on action outcomes
export const DAN_SULLIVAN_REFLECTION = {
  completed: [
    "What did you discover from completing this action?",
    "How was the result different than you expected?",
    "What capability did you develop through this action?",
    "How can this win help you achieve bigger goals?",
    "What would you do even better next time?",
    "Who else could benefit from learning about this success?"
  ],
  incomplete: [
    "What did you learn from this experience?", 
    "How is this different than you expected?",
    "What would you do differently next time?",
    "What capability do you need to develop?",
    "What support do you need to win next time?",
    "How can this learning help you with future actions?"
  ]
};

// Action quality scoring algorithm
export function scoreActionQuality(action: string, sessionNumber: number, userPatterns?: UserActionPattern): ActionQualityScore {
  let specificScore = 0;
  let measurableScore = 0;
  let timeboundScore = 0;
  let accountabilityScore = 0;
  const suggestions: string[] = [];

  // Check for specificity
  const specificKeywords = ['will', 'by', 'complete', 'finish', 'create', 'call', 'meet', 'write'];
  const hasSpecific = specificKeywords.some(keyword => action.toLowerCase().includes(keyword));
  specificScore = hasSpecific ? 8 : 3;
  
  if (!hasSpecific) {
    suggestions.push("Make your action more specific. Use words like 'will complete', 'will call', or 'will create'.");
  }

  // Check for measurable elements
  const numbers = action.match(/\d+/g);
  const measurableWords = ['complete', 'finish', 'reach', 'achieve', 'deliver'];
  const hasMeasurable = numbers !== null || measurableWords.some(word => action.toLowerCase().includes(word));
  measurableScore = hasMeasurable ? 8 : 4;
  
  if (!hasMeasurable) {
    suggestions.push("Add a measurable element. How many? How much? What specific outcome?");
  }

  // Check for time elements  
  const timeWords = ['today', 'tomorrow', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'week', 'day', 'by', 'before', 'am', 'pm'];
  const hasTime = timeWords.some(word => action.toLowerCase().includes(word));
  timeboundScore = hasTime ? 9 : 2;
  
  if (!hasTime) {
    suggestions.push("When exactly will you do this? Add a specific day and time.");
  }

  // Basic accountability check (more sophisticated logic could be added)
  const accountabilityWords = ['tell', 'share', 'report', 'update', 'accountability'];
  const hasAccountability = accountabilityWords.some(word => action.toLowerCase().includes(word));
  accountabilityScore = hasAccountability ? 7 : 5;

  // Adjust expectations based on session number
  const expectedLevel = getCoachingLevel(sessionNumber);
  let overall = (specificScore + measurableScore + timeboundScore + accountabilityScore) / 4;
  
  // Add session-appropriate suggestions
  if (sessionNumber >= 5 && !hasMeasurable) {
    suggestions.push("At this stage, focus on measurable outcomes. What specific result will you achieve?");
  }
  
  if (sessionNumber >= 11 && suggestions.length > 2) {
    suggestions.push("You've created great actions before. What patterns made those successful?");
  }
  
  if (sessionNumber >= 17) {
    if (!action.toLowerCase().includes('teach') && !action.toLowerCase().includes('share')) {
      suggestions.push("Consider adding a multiplication element: Who can you teach or share this with?");
    }
  }

  return {
    overall: Math.round(overall),
    specific: specificScore,
    measurable: measurableScore, 
    timebound: timeboundScore,
    accountability: accountabilityScore,
    improvement_suggestions: suggestions
  };
}

// Get coaching level based on session number
export function getCoachingLevel(sessionNumber: number): SMARTActionCoach {
  if (sessionNumber <= 4) return COACHING_LEVELS.foundation;
  if (sessionNumber <= 10) return COACHING_LEVELS.refinement;
  if (sessionNumber <= 16) return COACHING_LEVELS.integration;
  return COACHING_LEVELS.mastery;
}

// Generate contextual coaching prompts
export function getCoachingPrompts(action: string, sessionNumber: number, qualityScore: ActionQualityScore): string[] {
  const level = getCoachingLevel(sessionNumber);
  const prompts: string[] = [];
  
  // Add level-appropriate prompts
  prompts.push(...level.coachPrompts);
  
  // Add quality-specific prompts
  if (qualityScore.specific < 6) {
    prompts.unshift("Let's make this more specific. What exactly will you do?");
  }
  
  if (qualityScore.timebound < 6) {
    prompts.push("When exactly will you complete this? Be specific about the day and time.");
  }
  
  if (qualityScore.measurable < 6 && sessionNumber >= 5) {
    prompts.push("How will you know if this action was successful? What will you measure?");
  }
  
  return prompts.slice(0, 3); // Return top 3 most relevant prompts
}

// Generate celebration message based on progress
export function getCelebrationMessage(sessionNumber: number, qualityScore: ActionQualityScore, previousScore?: number): string {
  const level = getCoachingLevel(sessionNumber);
  let message = level.celebrationMessage;
  
  // Add improvement recognition
  if (previousScore && qualityScore.overall > previousScore) {
    const improvement = qualityScore.overall - previousScore;
    message += ` Your action quality improved by ${improvement} points - you're getting better at this!`;
  }
  
  // Add milestone recognitions
  if (qualityScore.overall >= 8) {
    message += " 🏆 This is a high-quality action that will drive real results!";
  }
  
  if (sessionNumber === 22 && qualityScore.overall >= 7) {
    message = "🎓 Congratulations! You've mastered the art of SMART actions. You're now equipped to create actions that multiply your impact through others. Well done!";
  }
  
  return message;
}

// Micro-celebration triggers for daily engagement
export const MICRO_CELEBRATIONS = {
  first_action: "🎉 First action created! Every journey starts with a single step.",
  quality_improvement: "📈 Your actions are getting more specific! Quality over quantity wins.",
  three_day_streak: "🔥 3-day completion streak! You're building unstoppable momentum.",
  accountability_used: "🤝 You're using accountability! This dramatically increases success rates.",
  taught_someone: "👨‍🏫 You taught someone else! When you teach, you learn twice.",
  system_created: "⚙️ You've created a repeatable system! This is how you scale impact.",
  ten_x_thinking: "🚀 This action shows 10x thinking! You're not just improving, you're transforming."
};