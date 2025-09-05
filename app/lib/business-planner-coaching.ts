/**
 * BUSINESS PLANNER AI COACHING SYSTEM
 * Section-specific coaching for business plan development
 * Integrates with IBAM coaching knowledge base and biblical principles
 */

import { IBAM_COACHING_KNOWLEDGE } from './coaching-knowledge-base';

export interface BusinessPlanSection {
  id: string;
  title: string;
  formData: Record<string, any>;
  completionPercentage: number;
  requiredFields: string[];
}

export interface CoachingResponse {
  type: 'validation' | 'guidance' | 'encouragement' | 'warning' | 'biblical';
  message: string;
  actionItems?: string[];
  biblicalPrinciple?: string;
  nextSteps?: string[];
}

// Section-Specific Coaching Logic
export const BUSINESS_SECTION_COACHING = {
  // Faith-Driven Purpose Coaching
  faithDrivenPurpose: {
    requiredFields: ['missionStatement', 'callingDescription', 'impactGoals'],
    coachingPrompts: {
      incomplete: [
        "Your 'why' is the foundation of everything else. What specific problem does God want you to solve?",
        "How does this business opportunity align with your spiritual gifts and calling?",
        "What kingdom impact do you hope to create through this business?"
      ],
      validation: [
        "Does your mission statement pass the 'grandmother test' - could your grandmother understand it?",
        "How does this calling connect to serving others, not just making money?",
        "What would success look like if God, not the market, defined it?"
      ]
    },
    biblicalPrinciples: {
      calling: "Jeremiah 29:11 - God has plans for your unique path",
      service: "Mark 10:43-44 - Greatness through serving others", 
      stewardship: "Matthew 25:14-30 - Faithful with what you're given"
    }
  },

  // Business Basics Coaching
  businessBasics: {
    requiredFields: ['businessName', 'businessType', 'targetCustomer', 'valueProposition'],
    coachingPrompts: {
      incomplete: [
        "Let's get crystal clear on the basics. Who exactly are you serving?",
        "What specific problem do you solve that keeps your customers up at night?",
        "Why would someone choose you over existing alternatives?"
      ],
      validation: [
        "Is your business name memorable and does it reflect your mission?",
        "Can you explain your value proposition in one sentence?",
        "Does your target customer description include real people you know?"
      ]
    },
    warnings: [
      "Trying to serve 'everyone' usually means serving no one well",
      "If you can't explain your business simply, it may be too complex",
      "Make sure your value proposition solves a real problem, not a made-up one"
    ]
  },

  // Market Opportunity Coaching  
  marketOpportunity: {
    requiredFields: ['marketSize', 'competitorAnalysis', 'marketTrends'],
    coachingPrompts: {
      incomplete: [
        "Market size matters, but serving people well matters more. What's the real size of your opportunity?",
        "Who are your competitors really? Don't just look at direct competitors - what else do customers do instead?",
        "What trends are creating urgency for your solution right now?"
      ],
      validation: [
        "Are your market size estimates based on real research or wishful thinking?",
        "Have you identified competitors you didn't know existed?",
        "Are the trends you identified actually helping or hurting your opportunity?"
      ]
    },
    biblicalPrinciples: {
      wisdom: "Proverbs 27:14 - Count the cost and plan carefully",
      diligence: "Proverbs 21:5 - Diligent plans lead to profit"
    }
  },

  // Market Validation Coaching
  marketValidation: {
    requiredFields: ['customerInterviews', 'prototypeTesting', 'preOrdersOrCommitments'],
    coachingPrompts: {
      incomplete: [
        "Customer validation is about listening, not selling. What are real customers telling you?",
        "Have you tested your solution with people who would actually pay for it?",
        "What evidence do you have that customers will give you money, not just encouragement?"
      ],
      validation: [
        "Did you interview people outside your family and friend circle?",
        "Are customers willing to pre-order or commit to buying?",
        "What objections came up that surprised you?"
      ]
    },
    warnings: [
      "Friends and family will tell you what you want to hear - find strangers",
      "Free trials don't validate willingness to pay - get financial commitments",
      "If no one will pay now, they probably won't pay later"
    ]
  },

  // Financial Planning Coaching
  financial: {
    requiredFields: ['startupCosts', 'monthlyExpenses', 'revenueProjections', 'breakEvenAnalysis'],
    coachingPrompts: {
      incomplete: [
        "Money isn't everything, but running out of money ends everything. What are your real costs?",
        "Have you included all expenses - even the ones you forgot about?",
        "Are your revenue projections based on actual customer evidence?"
      ],
      validation: [
        "Did you add 25-50% buffer to your expense estimates?",
        "Can you survive 6 months with no revenue?",
        "Are your revenue projections conservative or optimistic?"
      ]
    },
    biblicalPrinciples: {
      stewardship: "Luke 16:10 - Faithful in little, faithful in much",
      planning: "Luke 14:28 - Count the cost before building",
      provision: "Philippians 4:19 - God supplies our needs"
    },
    warnings: [
      "Most entrepreneurs underestimate costs and overestimate revenue",
      "Cash flow problems kill more businesses than bad ideas",
      "If you can't afford to lose your startup investment, don't invest it"
    ]
  },

  // Operations Planning Coaching
  operationsPlanning: {
    requiredFields: ['workflowProcess', 'toolsAndSystems', 'qualityControl'],
    coachingPrompts: {
      incomplete: [
        "Operations are where good intentions meet reality. How will you actually deliver excellence?",
        "What systems do you need to serve customers consistently?",
        "How will you maintain quality when you're busy or tired?"
      ],
      validation: [
        "Can someone else follow your processes without you there?",
        "Have you tested your workflow with real scenarios?",
        "What happens when something goes wrong?"
      ]
    }
  },

  // Implementation Plan Coaching
  implementationPlan: {
    requiredFields: ['week1Actions', 'month1Goals', 'month3Milestones'],
    coachingPrompts: {
      incomplete: [
        "Plans without action are just dreams. What will you do this week?",
        "Which milestones will prove your business is working?",
        "What would make the first 90 days a clear success?"
      ],
      validation: [
        "Are your week 1 actions specific and time-bound?",
        "Can you achieve your month 1 goals with the resources you have?",
        "Are your 3-month milestones ambitious but realistic?"
      ]
    },
    biblicalPrinciples: {
      action: "James 2:26 - Faith without action is dead",
      persistence: "Galatians 6:9 - Don't give up doing good"
    }
  }
};

// Generate Coaching Response Based on Section State
export function generateSectionCoaching(
  sectionId: string,
  formData: Record<string, any>,
  completionPercentage: number
): CoachingResponse[] {
  const sectionConfig = BUSINESS_SECTION_COACHING[sectionId];
  if (!sectionConfig) {
    return [defaultCoachingResponse(sectionId)];
  }

  const responses: CoachingResponse[] = [];
  
  // Check completion level and provide appropriate guidance
  if (completionPercentage < 25) {
    responses.push(getStarterGuidance(sectionId, sectionConfig));
  } else if (completionPercentage < 75) {
    responses.push(getProgressGuidance(sectionId, formData, sectionConfig));
  } else if (completionPercentage < 95) {
    responses.push(getValidationCoaching(sectionId, formData, sectionConfig));
  } else {
    responses.push(getCompletionEncouragement(sectionId, sectionConfig));
  }

  // Add biblical principle if available
  if (sectionConfig.biblicalPrinciples) {
    responses.push(getBiblicalGuidance(sectionId, sectionConfig.biblicalPrinciples));
  }

  // Add warnings if applicable
  if (sectionConfig.warnings && shouldShowWarning(formData, sectionConfig)) {
    responses.push(getWarningGuidance(sectionConfig.warnings));
  }

  return responses;
}

function getStarterGuidance(sectionId: string, config: any): CoachingResponse {
  const prompts = config.coachingPrompts?.incomplete || [
    "Let's begin this important section of your business plan.",
    "Take your time to think through these questions carefully.",
    "Remember, quality is better than speed."
  ];

  return {
    type: 'guidance',
    message: `🚀 **Getting Started with ${getSectionTitle(sectionId)}**\n\n${prompts[0]}\n\nThis section is crucial for your business success. Take it one step at a time.`,
    nextSteps: [
      "Start with the required fields first",
      "Be specific rather than general",
      "Think about real customers and situations"
    ]
  };
}

function getProgressGuidance(sectionId: string, formData: any, config: any): CoachingResponse {
  const prompts = config.coachingPrompts?.incomplete || [];
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)] || 
    "You're making good progress. Keep going!";

  return {
    type: 'encouragement',
    message: `💪 **Keep Going!**\n\n${randomPrompt}\n\nYou're on the right track. Stay focused on serving your customers well.`,
    actionItems: [
      "Complete the remaining required fields",
      "Review what you've written - is it clear and specific?",
      "Think about how this connects to your overall mission"
    ]
  };
}

function getValidationCoaching(sectionId: string, formData: any, config: any): CoachingResponse {
  const validationPrompts = config.coachingPrompts?.validation || [
    "Let's validate what you've created so far.",
    "Does this align with your mission and calling?",
    "Is this realistic and achievable?"
  ];

  return {
    type: 'validation',
    message: `🔍 **Quality Check**\n\n${validationPrompts[0]}\n\nLet's make sure this section is strong before moving forward.`,
    actionItems: validationPrompts.slice(1, 3),
    nextSteps: [
      "Review each field for clarity and specificity",
      "Ask: 'Would this convince an investor or customer?'",
      "Make sure everything aligns with your faith-driven purpose"
    ]
  };
}

function getCompletionEncouragement(sectionId: string, config: any): CoachingResponse {
  return {
    type: 'encouragement',
    message: `🎉 **Excellent Work!**\n\nYou've completed the ${getSectionTitle(sectionId)} section with care and thoughtfulness. This shows the kind of excellence that honors God and serves customers well.\n\n**What's Next?**\nThis section will guide your business decisions going forward. Reference it often and update it as you learn more.`,
    actionItems: [
      "Review this section monthly to keep it current",
      "Share key insights with your accountability partner",
      "Use this as a decision-making filter for future choices"
    ]
  };
}

function getBiblicalGuidance(sectionId: string, principles: Record<string, string>): CoachingResponse {
  const principleKeys = Object.keys(principles);
  const randomKey = principleKeys[Math.floor(Math.random() * principleKeys.length)];
  const principle = principles[randomKey];

  return {
    type: 'biblical',
    message: `📖 **Biblical Business Principle**\n\n"${principle}"\n\nYour business is an opportunity to live out biblical principles. Let this guide your decisions in this section.`,
    biblicalPrinciple: principle
  };
}

function getWarningGuidance(warnings: string[]): CoachingResponse {
  const randomWarning = warnings[Math.floor(Math.random() * warnings.length)];
  
  return {
    type: 'warning',
    message: `⚠️ **Important Consideration**\n\n${randomWarning}\n\nThis isn't meant to discourage you, but to help you succeed by avoiding common mistakes.`,
    actionItems: [
      "Double-check this potential issue in your plan",
      "Consider getting input from someone experienced",
      "Make sure your approach addresses this concern"
    ]
  };
}

function shouldShowWarning(formData: any, config: any): boolean {
  // Simple logic - show warnings if certain risky patterns are detected
  if (config.requiredFields?.includes('targetCustomer')) {
    const customer = formData.targetCustomer?.toLowerCase() || '';
    return customer.includes('everyone') || customer.includes('all people') || customer.includes('general public');
  }
  return false;
}

function getSectionTitle(sectionId: string): string {
  const titleMap = {
    faithDrivenPurpose: 'Faith-Driven Purpose',
    businessBasics: 'Business Basics',
    marketOpportunity: 'Market Opportunity',
    marketValidation: 'Market Validation',
    financial: 'Financial Planning',
    operationsPlanning: 'Operations Planning',
    implementationPlan: 'Implementation Plan'
  };
  return titleMap[sectionId] || 'This Section';
}

function defaultCoachingResponse(sectionId: string): CoachingResponse {
  return {
    type: 'guidance',
    message: `Great work on the ${getSectionTitle(sectionId)} section! Every step you take is building toward a business that honors God and serves others.`,
    actionItems: [
      "Take your time to think through each question",
      "Be specific and realistic in your responses",
      "Connect your answers to your overall mission"
    ]
  };
}

// Integration with existing coaching system
export function getContextualBusinessCoaching(
  sectionId: string,
  userMessage: string,
  formData: Record<string, any>
): string {
  const lowerMessage = userMessage.toLowerCase();
  
  // Handle section-specific questions
  if (lowerMessage.includes('financial') || lowerMessage.includes('money') || lowerMessage.includes('revenue')) {
    return handleFinancialQuestions(userMessage, formData);
  }
  
  if (lowerMessage.includes('customer') || lowerMessage.includes('market') || lowerMessage.includes('target')) {
    return handleMarketQuestions(userMessage, formData);
  }
  
  if (lowerMessage.includes('purpose') || lowerMessage.includes('mission') || lowerMessage.includes('calling')) {
    return handlePurposeQuestions(userMessage, formData);
  }
  
  // Default response with section context
  return `That's a great question about your ${getSectionTitle(sectionId)}. From a biblical business perspective, the key is always starting with serving others well. How does this decision help you better serve the people God has called you to reach?`;
}

function handleFinancialQuestions(userMessage: string, formData: any): string {
  return `**Biblical Financial Wisdom:**

Money is a tool for ministry, not the goal itself. Here's how to think about your finances:

**1. Stewardship First** - You're managing God's resources, not just your own
**2. Sustainable Service** - Price fairly so you can serve customers long-term  
**3. Generous Margins** - Build in room to give and serve others

**Practical Question:** What would "faithful stewardship" look like for your specific financial situation?`;
}

function handleMarketQuestions(userMessage: string, formData: any): string {
  return `**Customer-Centered Approach:**

Jesus always met people where they were and served their real needs. For your business:

**1. Listen First** - What problems keep your customers awake at night?
**2. Serve Specifically** - Better to serve 100 people excellently than 1000 poorly
**3. Love Your Neighbors** - Your customers are neighbors God wants you to serve

**Discovery Question:** If you could solve one problem for one specific type of person, what would it be?`;
}

function handlePurposeQuestions(userMessage: string, formData: any): string {
  return `**Faith-Driven Purpose:**

Your "why" is the foundation everything else builds on. Consider:

**1. Calling Connection** - How does this business align with how God made you?
**2. Kingdom Impact** - What eternal difference could this make?
**3. Faithful Stewardship** - How are you using your unique gifts to serve?

**Reflection Question:** If this business succeeded beyond your dreams, what impact would you be most proud of?`;
}

export default BUSINESS_SECTION_COACHING;