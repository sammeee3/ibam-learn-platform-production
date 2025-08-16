// config/constants.js
// All shared constants, colors, and configuration

export const colors = {
  primary: '#2563eb',
  secondary: '#059669', 
  accent: '#dc2626',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  background: '#f8fafc',
  border: '#e5e7eb',
  text: '#1f2937'
};

export const encouragementMessages = [
  "🎉 You just took action - that's what separates dreamers from doers!",
  "💪 Every question answered makes your business plan stronger!",
  "🌟 Small steps today = thriving business tomorrow!",
  "🚀 You're not just planning - you're preparing to THRIVE!",
  "🎯 That 'failure' just saved you from making a bigger mistake later!",
  "💡 You're building something that honors God - keep going!",
  "🏆 Each section completed brings you closer to launch!",
  "⭐ Progress isn't always perfect - but it's always valuable!",
  "🔥 You just did something most people only dream about!",
  "🌈 Every entrepreneur starts exactly where you are right now!"
];

export const celebrationMessages = [
  "🎊 BOOM! You're officially thinking like an entrepreneur!",
  "✨ That's what we call faith-driven action!",
  "🚀 Houston, we have a business owner in the making!",
  "💎 You just leveled up your business game!",
  "🎯 Bulls-eye! Perfect entrepreneur thinking right there!",
  "🌟 That answer shows you're ready for business success!",
  "💪 You're building something God can really use!",
  "🔥 Now THAT'S how you plan for prosperity!",
  "🏆 Champion mindset activated!",
  "⚡ You're on fire! Keep this momentum going!"
];

export const threeFishApproach = {
  giveFish: {
    title: "🐟 GIVE A FISH",
    description: "Start lean with minimal money to prove your business works",
    focus: "Bootstrap funding, minimal startup costs, cash flow positive fast",
    color: colors.secondary
  },
  teachFish: {
    title: "🎣 TEACH TO FISH", 
    description: "Build real entrepreneurial skills for long-term success",
    focus: "Market validation, customer development, business operations",
    color: colors.primary
  },
  equipDiscipleship: {
    title: "⚡ EQUIP FOR DISCIPLESHIP",
    description: "Create businesses that multiply disciples and kingdom impact",
    focus: "Faith integration, community service, mentoring others", 
    color: colors.accent
  }
};

export const initialFormData = {
  readinessAssessment: {
    riskTolerance: 0,
    familySupport: 0,
    timeAvailable: 0,
    financialCushion: 0,
    previousExperience: '',
    motivationLevel: 0,
    learningCommitment: 0,
    stressHandling: 0,
    supportNetwork: '',
    personalWhyStatement: ''
  },
  faithDrivenPurpose: {
    visionStatement: '',
    missionStatement: '',
    faithDrivenImpact: '',
    biblicalFoundation: '',
    discipleshipPlan: '',
    ethicalFramework: '',
    sabbathPlanning: '',
    stewardshipPlan: '',
    generosityStrategy: '',
    servantLeadershipPlan: ''
  },
  businessBasics: {
    businessName: '',
    industry: '',
    legalStructure: '',
    businessAddress: '',
    description: '',
    uniqueValue: '',
    problemSolved: '',
    targetMarket: '',
    businessModel: ''
  },
  marketOpportunity: {
    marketTiming: '',
    competitiveBarriers: '',
    industryTrends: '',
    regulatoryIssues: '',
    marketSize: '',
    customerNeed: '',
    competitiveAdvantage: '',
    whyNow: ''
  },
  marketValidation: {
    productDefinition: '',
    priceStrategy: '',
    promotionPlan: '',
    targetCustomerProfile: '',
    customerValidationEvidence: '',
    competitorAnalysis: '',
    customerAcquisitionCost: 0,
    customerLifetimeValue: 0,
    testMarketResults: '',
    customerInterviews: ''
  },
  legalCompliance: {
    businessLicenses: '',
    taxObligations: '',
    employmentLaw: '',
    intellectualProperty: '',
    contractsNeeded: '',
    insuranceRequirements: '',
    dataPrivacy: '',
    industryRegulations: ''
  },
  operationsPlanning: {
    dailyWorkflow: '',
    qualityControl: '',
    supplierManagement: '',
    customerService: '',
    technologyStack: '',
    inventoryManagement: '',
    backupPlans: '',
    scalingProcesses: ''
  },
  financial: {
    // Basic settings
    planningPeriod: 36,
    inflationRate: 3.5,
    salaryIncreaseRate: 4.0,
    salesGrowthRate: 10.0,
    bootstrapBudget: 5000,
    
    // One-time startup costs
    startupCosts: {
      equipment: 0,
      initialInventory: 0,
      deposits: 0,
      licenses: 0,
      initialMarketing: 0,
      workingCapital: 0,
      furniture: 0,
      technology: 0,
      renovation: 0,
      legal: 0,
      other: 0
    },
    
    // Fixed monthly costs
    fixedCosts: {
      businessLicense: 0,
      generalInsurance: 0,
      rent: 0,
      utilities: 0,
      internet: 0,
      accounting: 0,
      bankFees: 0,
      software: 0,
      ownerSalary: 0,
      salaries: 0,
      loanPayments: 0,
      propertyTax: 0,
      custom: []
    },
    
    // Variable costs
    variableCosts: {
      materials: 0,
      inventory: 0,
      shipping: 0,
      creditCardFees: 0,
      marketing: 0,
      travel: 0,
      supplies: 0,
      contractors: 0,
      custom: []
    },
    
    // Products and services
    productsServices: [],
    
    // 36-month projections
    monthlyProjections: Array(36).fill(null).map((_, index) => ({
      month: index + 1,
      projectedRevenue: 0,
      actualRevenue: 0,
      projectedExpenses: 0,
      actualExpenses: 0
    }))
  },
  implementationPlan: {
    ninetyDayPlan: '',
    weeklyMilestones: [],
    resourceAllocation: '',
    decisionFramework: '',
    launchChecklist: [],
    successMetrics: ''
  },
  riskManagement: {
    worstCaseScenario: '',
    contingencyPlanning: '',
    cashFlowStress: '',
    competitorResponse: '',
    keyPersonRisks: '',
    insuranceNeeds: ''
  },
  kpiDashboard: {
    customerAcquisitionCost: 0,
    customerLifetimeValue: 0,
    conversionRates: {},
    monthlyRecurringRevenue: 0,
    inventoryTurnover: 0,
    customerSatisfaction: 0
  },
  scalingFramework: {
    hiringIndicators: '',
    systemsReadiness: '',
    marketExpansion: '',
    franchiseModel: '',
    exitStrategy: ''
  },
  faithMetrics: {
    personalGrowth: {
      dailyPrayer: { goal: 0, actual: 0 },
      bibleStudy: { goal: 0, actual: 0 },
      worship: { goal: 0, actual: 0 },
      mentoring: { goal: 0, actual: 0 }
    },
    businessImpact: {
      customerService: { goal: 0, actual: 0 },
      integrityStandard: { goal: 0, actual: 0 },
      discipleshipOpportunities: { goal: 0, actual: 0 },
      communityService: { goal: 0, actual: 0 },
      employeeWellbeing: { goal: 0, actual: 0 },
      supplierFairness: { goal: 0, actual: 0 }
    }
  },
  winsTracking: {
    dailyWins: [],
    weeklyWins: [],
    monthlyWins: [],
    lessonsLearned: [],
    breakthroughMoments: []
  },
  coachingReviews: {
    monthlyReviews: [],
    quarterlyAssessments: [],
    annualEvaluations: [],
    actionItems: [],
    coachNotes: ''
  }
};