/**
 * AI Coach Introduction and Positioning
 * Establishes trust, sets expectations, and provides context
 */

export const AI_COACH_INTRODUCTION = {
  // Main introduction message
  welcomeMessage: `🤖 **IBAM Coaching Assistant**

Hi! I'm here to assist you with questions and guidance, backed by experienced IBAM business coaches who follow Jesus. Think of me as having their collective wisdom available to you 24/7.

**I'm here to help as much as you want or need** - whether that's quick questions, working through decisions, or exploring biblical business principles together.

**Try using me first for your coaching needs** - I can help you work through most situations right away.

**Want human connection?** You can request a volunteer IBAM coach [here]. Our volunteer coaches are amazing - they're running businesses and performing ministry themselves, so they love connecting with startup entrepreneurs like you! Just keep in mind they're volunteers with their own businesses, so response times may vary.

**Coming soon:** We're also working on paid coaching options for more intensive support.

**Rest assured:** Real IBAM business coaches who follow Jesus are behind our conversation, and everything I share comes from their experience helping entrepreneurs honor God in business.

**Ready to explore how God might be calling you in business?**`,

  // Context phrases to use during conversations
  contextPhrases: {
    experienceReference: "Based on insights from IBAM coaches",
    teamWisdom: "From the coaching team's experience",
    recommendation: "The coaches behind this platform recommend",
    commonPattern: "IBAM coaches often see this with entrepreneurs",
    biblicalBasis: "Our coaching team grounds this in Scripture",
    practicalApplication: "Real IBAM coaches have found that"
  },

  // Available help options
  supportOptions: {
    aiFirst: {
      title: "AI Coaching Assistant (Available Now)",
      description: "Immediate help with questions, decisions, and biblical business principles",
      benefits: ["24/7 availability", "Instant responses", "Backed by experienced coaches", "Perfect for quick guidance"],
      recommendedFor: "Most coaching needs, questions, and decision-making support"
    },
    
    volunteerCoach: {
      title: "Volunteer Human Coach",
      description: "Connect with successful entrepreneurs and ministers",
      benefits: ["Personal connection", "Real business experience", "Ministry background", "Startup enthusiasm"],
      expectations: ["Response times may vary", "They run their own businesses", "Volunteer basis"],
      requestLink: "[Request Human Coach Here]"
    },
    
    paidCoaching: {
      title: "Professional Coaching (Coming Soon)",
      description: "Intensive support for serious entrepreneurs",
      benefits: ["Dedicated time", "Structured programs", "Guaranteed availability", "Deep expertise"],
      status: "In development"
    }
  },

  // Trust-building elements
  trustBuilders: {
    humanBackedAI: "Real coaches behind every response",
    biblicalFoundation: "All guidance rooted in Scripture",
    entrepreneurExperience: "Coaches are successful business owners",
    ministryHeart: "Coaches actively serve in ministry",
    studentSuccess: "Proven track record helping entrepreneurs",
    jesusFollowers: "All coaches follow Jesus Christ"
  },

  // Expectation setting
  expectations: {
    aiCapabilities: [
      "Answer most business and biblical questions",
      "Help work through decisions using discovery methods",
      "Provide biblical perspectives on business challenges", 
      "Guide action planning and goal setting",
      "Available instantly anytime you need help"
    ],
    
    humanCoachValue: [
      "Personal relationship and accountability",
      "Real-world business experience sharing",
      "Ministry partnership and prayer support",
      "Network connections and introductions",
      "Emotional support during challenges"
    ],
    
    whenToUpgrade: [
      "You want ongoing accountability partnership",
      "You need industry-specific expertise",
      "You're facing major business decisions",
      "You want prayer and spiritual support",
      "You'd benefit from network connections"
    ]
  }
};

// Generate dynamic introduction based on user context
export const getPersonalizedIntroduction = (userContext: {
  hasAssessment?: boolean;
  businessStage?: string;
  faithLevel?: string;
  isFirstSession?: boolean;
}) => {
  let introduction = AI_COACH_INTRODUCTION.welcomeMessage;
  
  if (userContext.isFirstSession) {
    introduction += "\n\n**Since this is your first session**, I'm especially excited to help you discover how God might be calling you in business!";
  }
  
  if (userContext.hasAssessment) {
    introduction += "\n\n**I've reviewed your assessment** and I'm ready to personalize our conversation based on your background and goals.";
  }
  
  if (userContext.businessStage === 'planning') {
    introduction += "\n\n**Perfect timing for AI coaching** - I can help you work through the foundational questions and decisions that are so important in the planning stage.";
  }
  
  return introduction;
};

// Ongoing conversation context phrases
export const getContextualPhrase = (situationType: keyof typeof AI_COACH_INTRODUCTION.contextPhrases) => {
  return AI_COACH_INTRODUCTION.contextPhrases[situationType];
};

export default AI_COACH_INTRODUCTION;