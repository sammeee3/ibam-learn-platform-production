/**
 * IBAM COACHING KNOWLEDGE BASE
 * Dynamic, curriculum-integrated coaching system
 * Biblical business principles through Jesus' ministry methods
 * Discovery-based with protective guidance
 */

import type { SessionData } from './types';

// Core Biblical Business Integration Philosophy
export const CORE_COACHING_PHILOSOPHY = {
  foundation: {
    ultimateAuthority: "Scripture is our ultimate guide - not IBAM, not trainers, not AI coaches",
    jesusMethod: "Jesus' ministry methods are proven business principles because all truth is God's truth",
    holisticIntegration: "Following Jesus and building businesses aren't separate - they're completely intertwined",
    discoveryApproach: "Like Jesus, we ask questions that lead people to their own discoveries",
    protectiveGuidance: "We guide students away from major mistakes while helping them discover excellence"
  },
  
  jesusBusinessPrinciples: {
    customerCentric: {
      jesusExample: "Jesus met people where they were (Woman at well - John 4)",
      businessApplication: "Customer-centricity = Love of neighbor (Mark 12:31)",
      practicalTool: "Deep customer discovery through curiosity and genuine care"
    },
    
    problemSolving: {
      jesusExample: "Jesus saw needs and met them (Feeding 5000 - Matthew 14)",
      businessApplication: "Product-market fit = Meeting real needs, not creating wants",
      practicalTool: "Identify genuine problems before building solutions"
    },
    
    relationshipBuilding: {
      jesusExample: "Jesus invested deeply in 12 disciples",
      businessApplication: "Customer retention through authentic relationships",
      practicalTool: "Focus on serving customers, not just selling to them"
    },
    
    multiplication: {
      jesusExample: "Jesus trained disciples who trained others (Matthew 28:19-20)",
      businessApplication: "Scaling through systems and people development",
      practicalTool: "Build processes that work without you"
    },
    
    servantLeadership: {
      jesusExample: "Jesus washed disciples' feet (John 13:1-17)",
      businessApplication: "Leadership through service, not dominance",
      practicalTool: "Lead by serving your team and customers first"
    }
  }
};

// Discovery Question Framework (Jesus-Style Coaching)
export const DISCOVERY_QUESTIONS = {
  // WHO Questions - Identity & Relationships
  who: {
    identity: [
      "Who do you see yourself becoming as a business owner?", // Based on "Who do you say I am?" - Matthew 16:15
      "Who are the people God has placed in your life to serve through this business?",
      "Who could you partner with to make this vision reality?",
      "Who has successfully done something similar that you could learn from?"
    ],
    
    customers: [
      "Who exactly are you trying to serve?", // Jesus always knew His audience
      "Who would benefit most from what you're offering?",
      "Who are you NOT trying to serve? (This helps clarify your focus)",
      "Who would pay for this solution to their problem?"
    ],
    
    team: [
      "Who could help you accomplish this vision?",
      "Who brings skills you don't have?",
      "Who shares your values and could grow with this business?"
    ]
  },
  
  // WHAT Questions - Vision & Value
  what: {
    vision: [
      "What problem are you solving that people actually have?", // Jesus met real needs
      "What would success look like 1 year from now?",
      "What impact do you want to make through this business?",
      "What would you do if you knew you couldn't fail?"
    ],
    
    value: [
      "What unique value do you bring to this market?",
      "What makes your solution different from what already exists?",
      "What would customers miss if your business didn't exist?",
      "What biblical principles guide how you operate?"
    ],
    
    resources: [
      "What resources do you currently have available?",
      "What skills have you developed that could serve this business?",
      "What would you need to get started in a simple way?"
    ]
  },
  
  // WHEN Questions - Timing & Urgency
  when: {
    timing: [
      "When do your customers need this solution most?",
      "When would be the right time to start testing this idea?",
      "When do you plan to take your first concrete action step?",
      "When will you know if this is working or needs adjustment?"
    ],
    
    milestones: [
      "When will you complete your next important milestone?",
      "When will you reassess and adjust your approach?",
      "When do you need to make key decisions about this business?"
    ]
  },
  
  // WHERE Questions - Market & Location
  where: {
    market: [
      "Where do your ideal customers spend their time?",
      "Where are they currently trying to solve this problem?",
      "Where could you test your solution with real customers?",
      "Where do you see this business operating (location/online)?"
    ],
    
    distribution: [
      "Where will customers discover your solution?",
      "Where will you deliver your product or service?",
      "Where could you find your first 10 customers?"
    ]
  },
  
  // WHY Questions - Purpose & Motivation
  why: {
    purpose: [
      "Why does this business opportunity excite you?", // Connect to calling
      "Why would customers choose your solution over alternatives?",
      "Why is now the right time for this business?",
      "Why do you believe God is leading you in this direction?"
    ],
    
    motivation: [
      "Why are you willing to work hard to make this succeed?",
      "Why would this business honor God and serve others?",
      "Why would failure be unacceptable to you?"
    ]
  },
  
  // HOW Questions - Strategy & Implementation
  how: {
    strategy: [
      "How would you test this idea with minimal risk?", // Lean startup principles
      "How will you know if customers actually want this?",
      "How could you start serving one customer excellently?",
      "How will you measure success?"
    ],
    
    implementation: [
      "How will you take the first step this week?",
      "How will you stay accountable to your commitments?",
      "How will you adjust if your first approach doesn't work?",
      "How can you serve customers while building the business?"
    ]
  }
};

// Protective Guidance - Warning Signs & Redirections
export const PROTECTIVE_GUIDANCE = {
  commonMistakes: {
    buildingWithoutCustomers: {
      warning: "I notice you're focusing on the solution before deeply understanding the problem.",
      redirect: "Jesus spent time with people before serving them. What if we explored your customers' actual needs first?",
      biblicalPrinciple: "Even Jesus asked questions to understand people's situations (Mark 10:51 - 'What do you want me to do for you?')"
    },
    
    perfectingBeforeTesting: {
      warning: "It sounds like you want everything perfect before launching.",
      redirect: "Jesus sent disciples out to practice while they were still learning. How could you test this with one person first?",
      biblicalPrinciple: "Faith requires taking steps before seeing the whole staircase (Hebrews 11:1)"
    },
    
    goingAlone: {
      warning: "This sounds like you're planning to do everything yourself.",
      redirect: "Jesus worked with a team from the beginning. Who could help you with this vision?",
      biblicalPrinciple: "Two are better than one - Ecclesiastes 4:9-12"
    },
    
    ignoringFinances: {
      warning: "Let's make sure this business can actually sustain itself financially.",
      redirect: "Jesus taught about counting the cost (Luke 14:28). How will this generate enough revenue to serve people well?",
      biblicalPrinciple: "Good stewardship requires understanding the numbers"
    },
    
    rushing: {
      warning: "This feels like you might be moving too fast without proper foundation.",
      redirect: "Jesus spent 30 years preparing for 3 years of ministry. What foundation work needs to happen first?",
      biblicalPrinciple: "The plans of the diligent lead to profit (Proverbs 21:5)"
    }
  },
  
  riskAssessment: {
    financial: [
      "What's the maximum you could afford to lose if this doesn't work?",
      "How will you support yourself while building this business?",
      "What would financial failure look like, and how would you recover?"
    ],
    
    relational: [
      "How will this business affect your family relationships?",
      "What would overwork do to your ability to serve others well?",
      "How will you maintain your relationship with God through business stress?"
    ],
    
    operational: [
      "What could go wrong with this plan, and how would you handle it?",
      "What skills do you need that you don't currently have?",
      "What would happen if your main competitor copied your idea?"
    ]
  }
};

// Business Terms Library - Plain English Explanations
export const BUSINESS_TERMS_LIBRARY = {
  financial: {
    "COGS": "Cost of Goods Sold - What it actually costs you to make your product or deliver your service",
    "Revenue": "All the money coming into your business from sales",
    "Profit": "Revenue minus all your costs - what's left over",
    "Cash Flow": "Money coming in and going out - like your business breathing",
    "Break-even": "The point where your revenue equals your costs - you're not losing money anymore",
    "Burn Rate": "How fast you're spending money while building the business"
  },
  
  marketing: {
    "Customer Acquisition": "How you find and attract new customers",
    "Market Research": "Learning about your customers' real problems and needs",
    "Value Proposition": "Why someone would choose your solution over alternatives",
    "Target Market": "The specific group of people you're trying to serve",
    "Customer Persona": "A detailed description of your ideal customer",
    "Conversion": "When someone goes from interested to actually buying"
  },
  
  operations: {
    "MVP": "Minimum Viable Product - The simplest version that solves the core problem",
    "Iteration": "Making small improvements based on customer feedback",
    "Scaling": "Growing the business without breaking what already works",
    "Systems": "Processes that work without you having to do everything manually",
    "Outsourcing": "Having others do work so you can focus on what matters most"
  },
  
  strategy: {
    "Pivot": "Changing direction based on what you learn from customers",
    "Product-Market Fit": "When customers actually want what you're offering",
    "Competitive Advantage": "What makes you different and better than alternatives",
    "Business Model": "How you make money while serving customers",
    "Exit Strategy": "Your plan for eventually transitioning out of day-to-day operations"
  }
};

// Excellence Guidance - Leading Students Toward Best Practices
export const EXCELLENCE_GUIDANCE = {
  actionStepOptimization: {
    makeItSpecific: {
      prompt: "That's a good direction! Let's make it even more specific so you know exactly what success looks like.",
      example: "Instead of 'talk to customers,' what if it was 'have 20-minute conversations with 5 potential customers about their biggest frustration with [specific problem]'?"
    },
    
    addAccountability: {
      prompt: "This action would be even stronger with built-in accountability. Who could you share this commitment with?",
      biblicalConnection: "Jesus sent disciples out in pairs (Mark 6:7) - accountability increases effectiveness."
    },
    
    includeTimeBound: {
      prompt: "When exactly will you complete this? Being specific about timing helps turn intentions into reality.",
      practical: "What day and time works best for your schedule?"
    },
    
    considerRisks: {
      prompt: "What could prevent this from happening, and how would you handle that?",
      preparation: "Having a backup plan shows wisdom, not lack of faith."
    }
  },
  
  businessPrincipleAlignment: {
    customerFirst: {
      check: "How does this action serve your customers better?",
      upgrade: "What if this action also gathered customer feedback at the same time?"
    },
    
    stewardship: {
      check: "How does this honor God with your resources?",
      upgrade: "What would excellent stewardship look like in this situation?"
    },
    
    sustainability: {
      check: "How does this build long-term health for your business?",
      upgrade: "What would make this action create ongoing positive impact?"
    }
  }
};

// Dynamic Curriculum Integration
export const getCurriculumBasedGuidance = (sessionData: SessionData) => {
  // Extract biblical principles from current session content
  const currentSessionPrinciples = extractBiblicalPrinciples(sessionData);
  
  // Generate contextual coaching questions based on session content
  const contextualQuestions = generateContextualQuestions(sessionData);
  
  // Create session-specific business term definitions
  const sessionTerms = extractBusinessTerms(sessionData);
  
  return {
    sessionContext: {
      currentFocus: sessionData.title,
      keyPrinciples: currentSessionPrinciples,
      applicableTerms: sessionTerms
    },
    
    contextualCoaching: {
      discoveryQuestions: contextualQuestions,
      protectiveGuidance: getSessionSpecificWarnings(sessionData),
      excellenceOpportunities: getSessionBasedOptimizations(sessionData)
    }
  };
};

// Helper Functions
function extractBiblicalPrinciples(sessionData: SessionData) {
  // Extract scripture references and principles from session content
  const principles: any[] = [];
  
  // Note: scripture property not available in current SessionData type
  // TODO: Add scripture support to SessionData interface when available
  if (sessionData.content && 'scripture' in sessionData.content && sessionData.content.scripture) {
    principles.push({
      reference: (sessionData.content as any).scripture,
      businessApplication: mapScriptureToBusiness((sessionData.content as any).scripture),
      practicalImplementation: getImplementationSuggestions((sessionData.content as any).scripture)
    });
  }
  
  return principles;
}

function generateContextualQuestions(sessionData: SessionData) {
  // Generate discovery questions specific to current session content
  const baseQuestions = DISCOVERY_QUESTIONS;
  const sessionSpecific: any[] = [];
  
  // Add session-specific discovery questions based on content
  // Note: keyPoints property not available in current SessionData type
  if (sessionData.content && 'keyPoints' in sessionData.content && Array.isArray((sessionData.content as any).keyPoints)) {
    (sessionData.content as any).keyPoints.forEach((point: string) => {
      sessionSpecific.push(createDiscoveryQuestion(point));
    });
  }
  
  return {
    general: baseQuestions,
    sessionSpecific
  };
}

function extractBusinessTerms(sessionData: SessionData) {
  // Extract and define business terms mentioned in current session
  const terms = {};
  const sessionContent = sessionData.content?.written_curriculum?.main_content || '';
  
  // Check for business terms in content and provide definitions
  Object.keys(BUSINESS_TERMS_LIBRARY).forEach(category => {
    Object.keys(BUSINESS_TERMS_LIBRARY[category]).forEach(term => {
      if (sessionContent.toLowerCase().includes(term.toLowerCase())) {
        terms[term] = BUSINESS_TERMS_LIBRARY[category][term];
      }
    });
  });
  
  return terms;
}

function getSessionSpecificWarnings(sessionData: SessionData) {
  // Return protective guidance relevant to current session
  return PROTECTIVE_GUIDANCE.commonMistakes;
}

function getSessionBasedOptimizations(sessionData: SessionData) {
  // Return excellence guidance opportunities for current session
  return EXCELLENCE_GUIDANCE.actionStepOptimization;
}

function mapScriptureToBusiness(scripture: string) {
  // Map scripture references to practical business applications
  const mappings = {
    "Matthew 28:19-20": "Multiplication strategy - train others to do what you do",
    "Mark 12:31": "Customer service excellence through genuine care",
    "Luke 14:28": "Financial planning and counting the cost",
    "Proverbs 21:5": "Strategic planning and diligent preparation",
    "Ecclesiastes 4:9-12": "Partnership and team building"
  };
  
  return mappings[scripture] || "Apply this biblical principle to your business decisions";
}

function getImplementationSuggestions(scripture: string) {
  // Provide practical ways to implement biblical principles in business
  const implementations = {
    "Matthew 28:19-20": [
      "Create training systems that can work without you",
      "Develop others to lead parts of the business",
      "Document processes so they can be replicated"
    ],
    "Mark 12:31": [
      "Genuinely listen to customer problems",
      "Put customer success before your profit",
      "Treat customers how you'd want to be treated"
    ]
  };
  
  return implementations[scripture] || ["Apply this principle with wisdom and prayer"];
}

function createDiscoveryQuestion(keyPoint: string) {
  // Generate discovery questions based on session key points
  return `How does '${keyPoint}' apply to your current business situation?`;
}

// Export main coaching interface
export const IBAM_COACHING_KNOWLEDGE = {
  philosophy: CORE_COACHING_PHILOSOPHY,
  discoveryQuestions: DISCOVERY_QUESTIONS,
  protectiveGuidance: PROTECTIVE_GUIDANCE,
  businessTerms: BUSINESS_TERMS_LIBRARY,
  excellenceGuidance: EXCELLENCE_GUIDANCE,
  getCurriculumContext: getCurriculumBasedGuidance
};

export default IBAM_COACHING_KNOWLEDGE;