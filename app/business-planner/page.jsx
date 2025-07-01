'use client';

import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Download, 
  Calculator, 
  DollarSign, 
  Package, 
  Users, 
  FileText, 
  Heart, 
  Target, 
  BarChart3, 
  PieChart, 
  Calendar,
  Home,
  Loader2,
  Plus,
  Minus,
  Building,
  Compass,
  TrendingUp,
  HandHeart,
  BookOpen,
  Check,
  AlertCircle,
  Info,
  X,
  Edit,
  Trash2,
  HelpCircle,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  Phone,
  MessageSquare,
  Trophy,
  Star,
  Lightbulb,
  Zap,
  Smile,
  Fish,
  Shield,
  Rocket,
  Brain,
  Settings,
  Map,
  Flag,
  Award,
  Activity,
  Camera,
  Mail,
  Globe,
  Lock
} from 'lucide-react';

const IBAMBusinessPlanner = () => {
  const colors = {
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

  const [currentSection, setCurrentSection] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [challengeQuestions, setChallengeQuestions] = useState([]);
  const [showWinCelebration, setShowWinCelebration] = useState(false);
  const [completedSections, setCompletedSections] = useState(new Set());

  const encouragementMessages = [
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

  const celebrationMessages = [
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

  const fieldExplanations = {
    riskTolerance: "How comfortable are you with uncertainty? Business involves risk - like not knowing if customers will buy, or if you will make money next month. Rate your comfort level honestly.",
    familySupport: "Does your family support your business dream? Will they understand when you work evenings and weekends? Family support is crucial for success.",
    timeAvailable: "How many hours per week can you realistically work on your business? Be honest - factor in your current job, family time, and sleep!",
    financialCushion: "How many months can your family survive without your business making money? Most businesses take 6-12 months to become profitable.",
    previousExperience: "Have you run a business before, managed people, or worked in sales? Any experience helps, but do not worry if you are starting fresh!",
    
    marketTiming: "Is this the right time for your business idea? Are people ready for what you are selling? What trends support your timing?",
    competitiveBarriers: "How hard would it be for someone else to copy your business? What makes you special and harder to replicate?",
    industryTrends: "Is your industry growing or shrinking? Are there new technologies or changes that help or hurt your business idea?",
    regulatoryIssues: "Are there new laws or regulations coming that could affect your business? Any government changes to worry about?",
    
    businessLicenses: "What permits do you need to legally operate? Every city/state has different requirements. Research yours specifically.",
    taxObligations: "What taxes will you owe? Sales tax on products? Payroll tax if you hire people? Plan for quarterly tax payments.",
    employmentLaw: "If you hire employees, what laws must you follow? Minimum wage, overtime, workplace safety, discrimination protection.",
    intellectualProperty: "Do you need to protect your business name, logo, or unique ideas? Trademarks, copyrights, or patents to consider?",
    
    dailyWorkflow: "What will you actually DO every day to run your business? Map out a typical day from start to finish.",
    qualityControl: "How will you make sure your product or service is consistently good? What is your quality standard?",
    supplierManagement: "Who will supply your materials or inventory? Do you have backup suppliers if something goes wrong?",
    customerService: "How will you handle customer questions, complaints, or returns? What is your customer service philosophy?",
    
    ninetyDayPlan: "What specific things must happen in your first 90 days to launch successfully? Break it down week by week.",
    weeklyMilestones: "What must you accomplish each week to stay on track? Set specific, measurable goals.",
    resourceAllocation: "How will you divide your time and money between different business activities? What gets priority?",
    decisionFramework: "When you face tough decisions, what process will you use? What factors matter most?",
    
    worstCaseScenario: "What is the worst thing that could happen to your business? Economic downturn? Key customer leaves? Plan for it.",
    contingencyPlanning: "If your main plan does not work, what is Plan B? How will you pivot or adjust?",
    cashFlowStress: "What if sales are 50% lower than expected? Can you survive? For how long?",
    competitorResponse: "What if a big competitor tries to crush you? How will you respond?",
    
    ethicalDecisions: "When faced with a choice between profit and principles, how will you decide? What is your ethical framework?",
    sabbathPlanning: "How will you honor rest and family time while running a business? What boundaries will you set?",
    employeeDiscipleship: "If you hire people, how might you mentor them or share your faith appropriately?",
    pricingIntegrity: "How will you price fairly? Not too high to gouge customers, not too low to hurt competitors unfairly.",
    
    customerAcquisitionCost: "How much does it cost you to get one new customer? Add up all marketing expenses and divide by new customers gained.",
    customerLifetimeValue: "How much money will one customer spend with you over their lifetime? Include repeat purchases and referrals.",
    conversionRates: "What percentage of people who see your marketing actually buy from you? Track this by marketing channel.",
    monthlyRecurringRevenue: "For subscription or repeat customers, how much money comes in automatically each month?",
    
    hiringIndicators: "How will you know when it is time to hire your first employee? What metrics will tell you?",
    systemsReadiness: "Before you can grow, what business systems must be in place? Documentation, processes, quality control?",
    marketExpansion: "After you succeed locally, how might you expand? New locations? Online? Different products?",
    
    stewardshipPlan: "How will you manage God's resources (money, time, people) responsibly in your business?",
    generosityStrategy: "As your business succeeds, how will you give back? What percentage? To whom?",
    servantLeadership: "How will you lead employees or work with customers in a way that serves them, not just profits you?",
    justiceAndFairness: "How will you ensure your business practices are fair to employees, customers, suppliers, and competitors?",

    businessName: "This is what customers will call your business. Pick something easy to remember, spell, and say out loud. Avoid confusing abbreviations or overly clever names.",
    industry: "What type of business are you starting? This helps us give you specific advice, cost estimates, and legal requirements based on what works in your industry.",
    legalStructure: "How your business is legally organized affects taxes, liability, and paperwork.",
    businessAddress: "Where your business is legally located. Can be your home address if working from home. Affects taxes, licenses, and legal notices.",
    description: "Explain what your business does in simple terms that a 10-year-old could understand. What problem do you solve for customers?",
    uniqueValue: "Why should customers choose you instead of your competitors? What makes you special, better, or different?",

    visionStatement: "The big picture of what God is calling you to accomplish. Think 5-10 years out. How will this business serve His purposes and make an eternal impact?",
    missionStatement: "Your day-to-day purpose. How will you serve God and love others through this business? What drives you to get up every morning?",
    faithDrivenImpact: "How will this business help make disciples, serve the community, and advance God's work on earth? What spiritual impact will it have?",
    discipleshipPlan: "How will you use this business to help others grow in their faith? Will you mentor employees, serve the community, or support missions?",
    biblicalFoundation: "What Bible verses will guide your business decisions? What Christian principles will you follow even when it costs money?",

    productDefinition: "Describe exactly what customers buy from you. What do they get? What problem does it solve? Be specific about features and benefits.",
    customerValidationEvidence: "CRITICAL: Proof that real people want to buy this. List specific conversations with potential customers. What did they say? Would they actually pay?",
    targetCustomerProfile: "Who exactly is your ideal customer? Age, income, location, lifestyle, problems they have. The more specific, the better your marketing.",
    competitorAnalysis: "Who else does what you want to do? Research their prices, strengths, weaknesses. Call them, visit their websites, read their reviews.",
    priceStrategy: "What will you charge? Why will customers pay that much? How does it compare to competitors? Can you make profit at this price?",
    promotionPlan: "How will customers find out about you? Social media, word of mouth, advertising, networking. How will you get your first 10 customers?",

    bootstrapBudget: "How much money can you actually spend without borrowing or going into debt? Look at your savings account right now.",
    planningPeriod: "How many months to project into the future. 36 months (3 years) gives a realistic picture of business growth.",
    inflationRate: "How much prices increase each year. US average is 2-4%. Higher rates mean your costs will go up faster.",
    salaryIncreaseRate: "Annual raises for employees. 3-5% is typical to keep good people and account for inflation.",
    salesGrowthRate: "How much you expect sales to grow each month. Be realistic - 5-15% monthly growth is aggressive but possible.",

    equipment: "Tools, machines, computers, furniture needed to run your business. Include delivery and setup costs. Buy used when possible.",
    initialInventory: "Products or materials you need to stock before opening. Start with 1-3 months worth. Do not overstock initially.",
    deposits: "Security deposits required by landlords, utility companies, suppliers. Usually 1-2 months of service.",
    licenses: "Business license, professional licenses, permits required to legally operate. Research your city/state requirements.",
    initialMarketing: "Money for grand opening, website, business cards, signs, initial advertising. Focus on low-cost, high-impact marketing.",
    workingCapital: "Cash buffer for the first few months before profits arrive. Recommended: 3-6 months of expenses.",
    furniture: "Desks, chairs, shelving, display cases needed to furnish your business space.",
    technology: "Computers, tablets, software, point-of-sale systems, internet setup.",
    renovation: "Costs to modify your space for business use. Get contractor quotes before estimating.",
    legal: "Lawyer fees for contracts, business formation, trademark. Accountant setup fees.",

    businessLicense: "Annual business license divided by 12 months. Required to operate legally.",
    generalInsurance: "General liability insurance protects against lawsuits. Required by most landlords and clients.",
    rent: "Monthly rent for your business location. If home-based, allocate 10-30% of home expenses.",
    utilities: "Electric, gas, water, trash for your business location. Average $150-500/month for small business.",
    internet: "Business internet and phone service. Faster speeds cost more but improve productivity.",
    accounting: "Bookkeeping software or professional bookkeeper. Required for taxes and business decisions.",
    bankFees: "Business checking account fees, credit card processing. Separate business account is required.",
    software: "Essential software subscriptions: accounting, email, project management, industry-specific tools.",
    ownerSalary: "How much you pay yourself monthly. Consider $0 initially until business is profitable.",
    salaries: "Total monthly salaries for employees. Include taxes and benefits (add 25-30% to base salaries).",
    loanPayments: "Monthly payments on business loans, equipment financing, or credit lines.",
    propertyTax: "Property taxes if you own your business location. Divide annual amount by 12.",

    materials: "Raw materials or products you sell. Usually 25-50% of revenue for retail/manufacturing businesses.",
    inventory: "Ongoing inventory purchases to restock products. Varies with sales volume.",
    shipping: "Costs to deliver products to customers. Include packaging materials and delivery fees.",
    creditCardFees: "Fees charged by payment processors. Typically 2.5-3.5% of credit card sales.",
    marketing: "Ongoing marketing and advertising costs. Recommended 5-10% of revenue for growth.",
    travel: "Business travel, vehicle expenses, gas for deliveries or client visits.",
    supplies: "Office supplies, cleaning supplies, small tools. Usually $50-200/month.",
    contractors: "Temporary help, freelancers, specialized services you outsource instead of hiring employees.",

    dailyPrayer: "Set a realistic daily prayer goal in minutes. Even 5-10 minutes counts if you do it consistently. This keeps God at the center of your business decisions.",
    bibleStudy: "How many times per week will you study Scripture? Include personal study, small groups, or Bible studies related to business and calling.",
    worship: "Corporate worship (church) plus personal worship times per week. Includes church services, small groups, personal worship time.",
    integrityStandard: "Rate yourself 1-10: How consistently do you follow biblical principles in business decisions, even when it costs money?",
    discipleshipOpportunities: "Count monthly conversations or opportunities where you help others grow in faith through your business relationships.",
    communityService: "Hours per month you or your business serves the local community. Include volunteer work, donations, community involvement."
  };

  const threeFishApproach = {
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

  const [formData, setFormData] = useState({
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
  });

  const sections = [
    { 
      id: 'dashboard', 
      title: 'Your Journey', 
      subtitle: 'See your progress',
      icon: <BarChart3 className="w-5 h-5" />,
      fishApproach: 'overview',
      required: false,
      description: 'Track your entrepreneurial development'
    },
    { 
      id: 'readinessAssessment', 
      title: 'Are You Ready?', 
      subtitle: 'Honest self-check',
      icon: <Brain className="w-5 h-5" />,
      fishApproach: 'teachFish',
      required: true,
      description: 'Discover if entrepreneurship is right for you'
    },
    { 
      id: 'faithDrivenPurpose', 
      title: 'Your Why', 
      subtitle: 'Kingdom purpose',
      icon: <Heart className="w-5 h-5" />,
      fishApproach: 'equipDiscipleship',
      required: true,
      description: 'Define your God-given purpose and mission'
    },
    { 
      id: 'businessBasics', 
      title: 'The Basics', 
      subtitle: 'Core foundation',
      icon: <Building className="w-5 h-5" />,
      fishApproach: 'teachFish',
      required: true,
      description: 'Essential business information'
    },
    { 
      id: 'marketOpportunity', 
      title: 'The Opportunity', 
      subtitle: 'Market analysis',
      icon: <Target className="w-5 h-5" />,
      fishApproach: 'teachFish',
      required: true,
      description: 'Validate your business opportunity'
    },
    { 
      id: 'marketValidation', 
      title: 'Prove It Works', 
      subtitle: 'Customer proof',
      icon: <Search className="w-5 h-5" />,
      fishApproach: 'teachFish',
      required: true,
      description: 'Evidence that customers want this'
    },
    { 
      id: 'legalCompliance', 
      title: 'Legal Stuff', 
      subtitle: 'Stay protected',
      icon: <Shield className="w-5 h-5" />,
      fishApproach: 'giveFish',
      required: true,
      description: 'Legal requirements and protection'
    },
    { 
      id: 'operationsPlanning', 
      title: 'How It Works', 
      subtitle: 'Daily operations',
      icon: <Settings className="w-5 h-5" />,
      fishApproach: 'teachFish',
      required: true,
      description: 'Plan your daily business operations'
    },
    { 
      id: 'financial', 
      title: 'The Numbers', 
      subtitle: 'Money matters',
      icon: <DollarSign className="w-5 h-5" />,
      fishApproach: 'giveFish',
      required: true,
      description: 'Financial planning and projections'
    },
    { 
      id: 'implementationPlan', 
      title: 'Action Plan', 
      subtitle: '90-day launch',
      icon: <Rocket className="w-5 h-5" />,
      fishApproach: 'teachFish',
      required: true,
      description: 'Your step-by-step launch plan'
    },
    { 
      id: 'riskManagement', 
      title: 'What If?', 
      subtitle: 'Risk planning',
      icon: <AlertCircle className="w-5 h-5" />,
      fishApproach: 'teachFish',
      required: false,
      description: 'Plan for challenges and setbacks'
    },
    { 
      id: 'kpiDashboard', 
      title: 'Key Numbers', 
      subtitle: 'Success metrics',
      icon: <Activity className="w-5 h-5" />,
      fishApproach: 'teachFish',
      required: false,
      description: 'Track important business metrics'
    },
    { 
      id: 'scalingFramework', 
      title: 'Growth Plan', 
      subtitle: 'Scaling up',
      icon: <TrendingUp className="w-5 h-5" />,
      fishApproach: 'teachFish',
      required: false,
      description: 'Plan for business growth'
    },
    { 
      id: 'faithMetrics', 
      title: 'Faith Growth', 
      subtitle: 'Spiritual impact',
      icon: <BookOpen className="w-5 h-5" />,
      fishApproach: 'equipDiscipleship',
      required: false,
      description: 'Track spiritual and ministry goals'
    },
    { 
      id: 'winsTracking', 
      title: 'Your Wins', 
      subtitle: 'Celebrate progress',
      icon: <Trophy className="w-5 h-5" />,
      fishApproach: 'equipDiscipleship',
      required: false,
      description: 'Record victories and lessons learned'
    },
    { 
      id: 'coachingReviews', 
      title: 'Coach Reviews', 
      subtitle: 'Accountability',
      icon: <Users className="w-5 h-5" />,
      fishApproach: 'equipDiscipleship',
      required: false,
      description: 'Regular coaching check-ins'
    }
  ];

  // Progress calculation
  const calculateProgress = () => {
    const requiredSections = sections.filter(s => s.required);
    const completedRequired = requiredSections.filter(s => completedSections.has(s.id));
    return {
      required: Math.round((completedRequired.length / requiredSections.length) * 100),
      overall: Math.round((completedSections.size / sections.length) * 100)
    };
  };

  // Win celebration popup
  const WinCelebration = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl text-center animate-bounce">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="font-bold text-xl mb-3" style={{ color: colors.primary }}>Amazing!</h3>
        <p className="text-gray-700 mb-4 text-sm">{message}</p>
        <button 
          onClick={onClose}
          className="text-white px-6 py-2 rounded-lg hover:opacity-90 font-medium"
          style={{ backgroundColor: colors.success }}
        >
          Keep Going! 🚀
        </button>
      </div>
    </div>
  );
  const renderFinancial = () => {
    // Calculate totals with proper handling of custom costs
    const totalStartupCosts = Object.values(formData.financial.startupCosts)
      .reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    
    const standardFixedCosts = Object.entries(formData.financial.fixedCosts)
      .filter(([key]) => key !== 'custom')
      .reduce((sum, [key, val]) => sum + (parseFloat(val) || 0), 0);
    
    const customFixedCosts = (formData.financial.fixedCosts.custom || [])
      .reduce((sum, cost) => sum + (parseFloat(cost.amount) || 0), 0);
    
    const totalFixedCosts = standardFixedCosts + customFixedCosts;
    
    const standardVariableCosts = Object.entries(formData.financial.variableCosts)
      .filter(([key]) => key !== 'custom')
      .reduce((sum, [key, val]) => sum + (parseFloat(val) || 0), 0);
    
    const customVariableCosts = (formData.financial.variableCosts.custom || [])
      .reduce((sum, cost) => sum + (parseFloat(cost.amount) || 0), 0);
    
    const totalVariableCosts = standardVariableCosts + customVariableCosts;
    
    const isOverBudget = totalStartupCosts > (parseFloat(formData.financial.bootstrapBudget) || 0);
    const projections = calculateProjections();

    return (
      <div className="space-y-8">
        <ThreeFishHeader fishApproach="giveFish" />
        <ChallengeQuestions />
        
        {/* Financial Settings */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-l-4 border-blue-500">
          <h3 className="text-lg font-bold mb-4 text-blue-800">📊 Financial Planning Settings</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <FieldWithTooltip fieldKey="planningPeriod" label="Planning Period (Months)">
              <input
                type="number"
                value={formData.financial.planningPeriod}
                onChange={(e) => handleInputChange('financial', 'planningPeriod', parseInt(e.target.value) || 36)}
                className="w-full p-2 border rounded text-center"
                min="12"
                max="60"
              />
            </FieldWithTooltip>
            
            <FieldWithTooltip fieldKey="inflationRate" label="Inflation Rate (%)">
              <input
                type="number"
                step="0.1"
                value={formData.financial.inflationRate}
                onChange={(e) => handleInputChange('financial', 'inflationRate', parseFloat(e.target.value) || 3.5)}
                className="w-full p-2 border rounded text-center"
                min="0"
                max="20"
              />
            </FieldWithTooltip>
            
            <FieldWithTooltip fieldKey="salaryIncreaseRate" label="Salary Increases (%)">
              <input
                type="number"
                step="0.1"
                value={formData.financial.salaryIncreaseRate}
                onChange={(e) => handleInputChange('financial', 'salaryIncreaseRate', parseFloat(e.target.value) || 4.0)}
                className="w-full p-2 border rounded text-center"
                min="0"
                max="20"
              />
            </FieldWithTooltip>
            
            <FieldWithTooltip fieldKey="salesGrowthRate" label="Sales Growth (%)">
              <input
                type="number"
                step="0.1"
                value={formData.financial.salesGrowthRate}
                onChange={(e) => handleInputChange('financial', 'salesGrowthRate', parseFloat(e.target.value) || 10.0)}
                className="w-full p-2 border rounded text-center"
                min="-50"
                max="100"
              />
            </FieldWithTooltip>
          </div>
        </div>

        {/* Bootstrap Budget */}
        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
          <h3 className="font-bold text-green-800 mb-2">💪 Bootstrap Budget</h3>
          <FieldWithTooltip fieldKey="bootstrapBudget" label="How much can you actually spend?">
            <input
              type="number"
              value={formData.financial.bootstrapBudget}
              onChange={(e) => handleInputChange('financial', 'bootstrapBudget', parseInt(e.target.value) || 5000)}
              className="w-32 p-2 border rounded focus:ring-2 focus:outline-none text-lg font-bold"
              style={{ borderColor: colors.border }}
              placeholder="$5000"
            />
          </FieldWithTooltip>
          <p className="text-green-700 text-sm mt-2">
            Goal: Start lean and prove your business works before investing more.
          </p>
        </div>

        {/* Startup Costs */}
        <div className="bg-white border rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 flex items-center" style={{ color: colors.primary }}>
            🚀 One-Time Startup Costs
            {isOverBudget && <span className="ml-2 text-red-600 text-sm">⚠️ OVER BUDGET</span>}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(formData.financial.startupCosts).map(([key, value]) => (
              <FieldWithTooltip key={key} fieldKey={key} label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleInputChange('financial', 'startupCosts', parseFloat(e.target.value) || 0, key)}
                  className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-blue-300"
                  placeholder="$0"
                />
              </FieldWithTooltip>
            ))}
          </div>
          <div className={`mt-4 p-4 rounded-lg ${isOverBudget ? 'bg-red-50 border border-red-200' : 'bg-green-50 border border-green-200'}`}>
            <div className={`text-lg font-bold ${isOverBudget ? 'text-red-800' : 'text-green-800'}`}>
              Total Startup Investment: {formatCurrencyString(totalStartupCosts)}
            </div>
            <p className={`text-sm mt-1 ${isOverBudget ? 'text-red-700' : 'text-green-700'}`}>
              {isOverBudget ? '🚫 TOO EXPENSIVE! What can you eliminate, borrow, or get for free?' : 
               'This is the money you need available before you can open your business.'}
            </p>
          </div>
        </div>

        {/* Fixed Monthly Costs */}
        <div className="bg-white border rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4" style={{ color: colors.secondary }}>
            🏢 Fixed Monthly Costs
          </h3>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-gray-700">Essential Business Costs</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(formData.financial.fixedCosts).filter(([key]) => key !== 'custom').map(([key, value]) => (
                <FieldWithTooltip key={key} fieldKey={key} label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleInputChange('financial', 'fixedCosts', parseFloat(e.target.value) || 0, key)}
                    className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-blue-300"
                    placeholder="$0"
                  />
                </FieldWithTooltip>
              ))}
            </div>
          </div>

          {/* Custom Fixed Costs */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-700">Custom Fixed Costs</h4>
              <button
                onClick={() => addCustomCost('fixedCosts')}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
                <span>Add Cost</span>
              </button>
            </div>
            {formData.financial.fixedCosts.custom?.map((cost) => (
              <div key={cost.id} className="grid grid-cols-12 gap-2 mb-2 p-2 bg-gray-50 rounded">
                <input
                  type="text"
                  placeholder="Cost name"
                  value={cost.name}
                  onChange={(e) => {
                    const updated = formData.financial.fixedCosts.custom.map(c =>
                      c.id === cost.id ? { ...c, name: e.target.value } : c
                    );
                    handleInputChange('financial', 'fixedCosts', updated, 'custom');
                  }}
                  className="col-span-4 p-2 text-sm border rounded"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={cost.amount}
                  onChange={(e) => {
                    const updated = formData.financial.fixedCosts.custom.map(c =>
                      c.id === cost.id ? { ...c, amount: parseFloat(e.target.value) || 0 } : c
                    );
                    handleInputChange('financial', 'fixedCosts', updated, 'custom');
                  }}
                  className="col-span-2 p-2 text-sm border rounded"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={cost.description}
                  onChange={(e) => {
                    const updated = formData.financial.fixedCosts.custom.map(c =>
                      c.id === cost.id ? { ...c, description: e.target.value } : c
                    );
                    handleInputChange('financial', 'fixedCosts', updated, 'custom');
                  }}
                  className="col-span-5 p-2 text-sm border rounded"
                />
                <button
                  onClick={() => removeCustomCost('fixedCosts', cost.id)}
                  className="col-span-1 p-2 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-lg font-bold text-orange-800">
              Total Fixed Costs: {formatCurrencyString(totalFixedCosts)}/month
            </div>
            <p className="text-sm text-orange-700 mt-1">
              You must generate this much revenue every month just to break even.
            </p>
          </div>
        </div>

        {/* Variable Costs */}
        <div className="bg-white border rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4" style={{ color: colors.accent }}>
            📈 Variable Monthly Costs
          </h3>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-gray-700">Costs That Change With Sales</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.entries(formData.financial.variableCosts).filter(([key]) => key !== 'custom').map(([key, value]) => (
                <FieldWithTooltip key={key} fieldKey={key} label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => handleInputChange('financial', 'variableCosts', parseFloat(e.target.value) || 0, key)}
                    className="w-full p-2 text-sm border rounded focus:ring-2 focus:ring-blue-300"
                    placeholder="$0"
                  />
                </FieldWithTooltip>
              ))}
            </div>
          </div>

          {/* Custom Variable Costs */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-700">Custom Variable Costs</h4>
              <button
                onClick={() => addCustomCost('variableCosts')}
                className="flex items-center space-x-1 px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                <Plus className="w-4 h-4" />
                <span>Add Cost</span>
              </button>
            </div>
            {formData.financial.variableCosts.custom?.map((cost) => (
              <div key={cost.id} className="grid grid-cols-12 gap-2 mb-2 p-2 bg-gray-50 rounded">
                <input
                  type="text"
                  placeholder="Cost name"
                  value={cost.name}
                  onChange={(e) => {
                    const updated = formData.financial.variableCosts.custom.map(c =>
                      c.id === cost.id ? { ...c, name: e.target.value } : c
                    );
                    handleInputChange('financial', 'variableCosts', updated, 'custom');
                  }}
                  className="col-span-4 p-2 text-sm border rounded"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={cost.amount}
                  onChange={(e) => {
                    const updated = formData.financial.variableCosts.custom.map(c =>
                      c.id === cost.id ? { ...c, amount: parseFloat(e.target.value) || 0 } : c
                    );
                    handleInputChange('financial', 'variableCosts', updated, 'custom');
                  }}
                  className="col-span-2 p-2 text-sm border rounded"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={cost.description}
                  onChange={(e) => {
                    const updated = formData.financial.variableCosts.custom.map(c =>
                      c.id === cost.id ? { ...c, description: e.target.value } : c
                    );
                    handleInputChange('financial', 'variableCosts', updated, 'custom');
                  }}
                  className="col-span-5 p-2 text-sm border rounded"
                />
                <button
                  onClick={() => removeCustomCost('variableCosts', cost.id)}
                  className="col-span-1 p-2 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-lg font-bold text-yellow-800">
              Total Variable Costs: {formatCurrencyString(totalVariableCosts)}/month
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              These costs will increase as your sales volume grows.
            </p>
          </div>
        </div>

        {/* Products & Services */}
        <div className="bg-white border rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold" style={{ color: colors.success }}>
              🛍️ Products & Services
            </h3>
            <button
              onClick={addProductService}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product/Service</span>
            </button>
          </div>

          {formData.financial.productsServices.map((product, index) => (
            <div key={product.id} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-semibold text-gray-700">Product/Service #{index + 1}</h4>
                <button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      financial: {
                        ...prev.financial,
                        productsServices: prev.financial.productsServices.filter(p => p.id !== product.id)
                      }
                    }));
                  }}
                  className="text-red-500 hover:bg-red-100 p-1 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Product/Service Name</label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => {
                      const updated = formData.financial.productsServices.map(p =>
                        p.id === product.id ? { ...p, name: e.target.value } : p
                      );
                      setFormData(prev => ({
                        ...prev,
                        financial: { ...prev.financial, productsServices: updated }
                      }));
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="e.g., Website Design, Coffee Mug, Hair Cut"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Selling Price</label>
                  <input
                    type="number"
                    value={product.price}
                    onChange={(e) => {
                      const updated = formData.financial.productsServices.map(p =>
                        p.id === product.id ? { ...p, price: parseFloat(e.target.value) || 0 } : p
                      );
                      setFormData(prev => ({
                        ...prev,
                        financial: { ...prev.financial, productsServices: updated }
                      }));
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="$0"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Complete Description</label>
                <textarea
                  value={product.description}
                  onChange={(e) => {
                    const updated = formData.financial.productsServices.map(p =>
                      p.id === product.id ? { ...p, description: e.target.value } : p
                    );
                    setFormData(prev => ({
                      ...prev,
                      financial: { ...prev.financial, productsServices: updated }
                    }));
                  }}
                  className="w-full p-3 border rounded"
                  rows={2}
                  placeholder="Describe what you're selling and who it's for..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Cost of Goods/Service</label>
                  <input
                    type="number"
                    value={product.costOfGoods}
                    onChange={(e) => {
                      const updated = formData.financial.productsServices.map(p =>
                        p.id === product.id ? { ...p, costOfGoods: parseFloat(e.target.value) || 0 } : p
                      );
                      setFormData(prev => ({
                        ...prev,
                        financial: { ...prev.financial, productsServices: updated }
                      }));
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="$0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Monthly Quantity</label>
                  <input
                    type="number"
                    value={product.monthlyQuantity}
                    onChange={(e) => {
                      const updated = formData.financial.productsServices.map(p =>
                        p.id === product.id ? { ...p, monthlyQuantity: parseInt(e.target.value) || 0 } : p
                      );
                      setFormData(prev => ({
                        ...prev,
                        financial: { ...prev.financial, productsServices: updated }
                      }));
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Seasonal Variation (%)</label>
                  <input
                    type="number"
                    value={product.seasonalVariation}
                    onChange={(e) => {
                      const updated = formData.financial.productsServices.map(p =>
                        p.id === product.id ? { ...p, seasonalVariation: parseInt(e.target.value) || 0 } : p
                      );
                      setFormData(prev => ({
                        ...prev,
                        financial: { ...prev.financial, productsServices: updated }
                      }));
                    }}
                    className="w-full p-2 border rounded"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Product Metrics */}
              <div className="mt-3 p-3 bg-blue-50 rounded">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Monthly Revenue:</span> 
                    <div className="font-bold text-green-600">
                      {formatCurrencyString((parseFloat(product.price) || 0) * (parseInt(product.monthlyQuantity) || 0))}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Profit Margin:</span> 
                    <div className="font-bold text-blue-600">
                      {(() => {
                        const price = parseFloat(product.price) || 0;
                        const costOfGoods = parseFloat(product.costOfGoods) || 0;
                        if (price > 0) {
                          return `${Math.round(((price - costOfGoods) / price * 100) * 10) / 10}%`;
                        }
                        return '0%';
                      })()}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Monthly Profit:</span> 
                    <div className="font-bold text-purple-600">
                      {formatCurrencyString(((parseFloat(product.price) || 0) - (parseFloat(product.costOfGoods) || 0)) * (parseInt(product.monthlyQuantity) || 0))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {formData.financial.productsServices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Add your first product or service to start building revenue projections.</p>
            </div>
          )}
        </div>

        {/* Financial Health Dashboard */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">💡 Financial Health Dashboard</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-white rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrencyString(totalStartupCosts + (totalFixedCosts * 6))}
              </div>
              <div className="text-sm text-gray-600">Recommended Investment</div>
              <div className="text-xs text-gray-500">Startup + 6 months expenses</div>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrencyString(totalFixedCosts + totalVariableCosts)}
              </div>
              <div className="text-sm text-gray-600">Monthly Break-even</div>
              <div className="text-xs text-gray-500">Revenue needed to break even</div>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-purple-600">
                {(() => {
                  const monthlyBreakeven = totalFixedCosts + totalVariableCosts;
                  const firstMonthRevenue = projections.length > 0 ? projections[0].projectedRevenue : 0;
                  if (firstMonthRevenue > 0 && monthlyBreakeven > 0) {
                    return Math.ceil(monthlyBreakeven / firstMonthRevenue);
                  }
                  return 'N/A';
                })()}
              </div>
              <div className="text-sm text-gray-600">Months to Break-even</div>
              <div className="text-xs text-gray-500">Based on projections</div>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-orange-600">
                {(() => {
                  if (totalStartupCosts > 0 && projections.length > 0) {
                    const firstYearProfit = projections.slice(0, 12).reduce((sum, month) => sum + month.profit, 0);
                    const roi = (firstYearProfit / totalStartupCosts) * 100;
                    return `${Math.round(roi * 10) / 10}`;
                  }
                  return '0';
                })()}%
              </div>
              <div className="text-sm text-gray-600">First Year ROI</div>
              <div className="text-xs text-gray-500">Return on investment</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add win function
  const addWin = (type, description) => {
    const win = {
      id: Date.now(),
      type,
      description,
      date: new Date().toISOString(),
      celebrated: false
    };
    
    setFormData(prev => ({
      ...prev,
      winsTracking: {
        ...prev.winsTracking,
        dailyWins: [win, ...prev.winsTracking.dailyWins.slice(0, 9)]
      }
    }));

    // Show encouragement
    const randomMessage = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
    addNotification('success', randomMessage);
  };

  // Challenge questions system
  const generateChallengeQuestions = (section, data) => {
    const questions = [];
    
    if (section === 'readinessAssessment') {
      if (data.riskTolerance < 5) {
        questions.push({
          type: 'warning',
          question: '🤔 LOW RISK TOLERANCE: Business involves uncertainty. Are you sure you\'re ready for the ups and downs?',
          field: 'riskTolerance'
        });
      }
      if (data.timeAvailable < 20) {
        questions.push({
          type: 'error',
          question: '⏰ TIME REALITY CHECK: Most successful businesses require 20+ hours per week. Do you really have the time?',
          field: 'timeAvailable'
        });
      }
    }
    
    if (section === 'marketValidation') {
      if (!data.customerValidationEvidence) {
        questions.push({
          type: 'error',
          question: '🚨 NO CUSTOMER PROOF: You need evidence that real people will buy this. Have you talked to potential customers?',
          field: 'customerValidationEvidence'
        });
      }
      
      if (!data.competitorAnalysis) {
        questions.push({
          type: 'warning',
          question: '🏆 KNOW YOUR COMPETITION: Who else does what you want to do? Research 5 competitors minimum.',
          field: 'competitorAnalysis'
        });
      }
    }
    
    if (section === 'financial') {
      const totalStartup = Object.values(data.startupCosts || {}).reduce((sum, val) => sum + (val || 0), 0);
      if (totalStartup > data.bootstrapBudget) {
        questions.push({
          type: 'error',
          question: `💰 BUDGET PROBLEM: You want $${totalStartup.toLocaleString()} but only have $${data.bootstrapBudget?.toLocaleString()}. What can you cut or get cheaper?`,
          field: 'startupCosts'
        });
      }
    }
    
    return questions;
  };

  // Notification system
  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
  };

  // Handle input changes with win detection
  const handleInputChange = (section, field, value, subfield = null) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (subfield) {
        if (!newData[section][field]) newData[section][field] = {};
        newData[section][field][subfield] = value;
      } else {
        newData[section][field] = value;
      }
      return newData;
    });

    // Check section completion
    checkSectionCompletion(section);

    // Detect wins
    if (field === 'businessName' && value.length > 3) {
      addWin('progress', 'Picked a business name');
    }
    if (field === 'customerValidationEvidence' && value.length > 50) {
      addWin('customer', 'Added customer proof');
    }
    if (field === 'competitorAnalysis' && value.length > 100) {
      addWin('research', 'Researched competitors');
    }
    if (field === 'visionStatement' && value.length > 50) {
      addWin('faith', 'Defined your vision');
    }
  };

  // Check section completion
  const checkSectionCompletion = (sectionId) => {
    const sectionData = formData[sectionId];
    if (!sectionData) return;

    // Simple completion check - if most required fields have content
    const requiredFields = Object.keys(sectionData).filter(key => 
      sections.find(s => s.id === sectionId)?.required
    );
    
    const completedFields = requiredFields.filter(field => {
      const value = sectionData[field];
      if (typeof value === 'string') return value.length > 0;
      if (typeof value === 'number') return value > 0;
      if (Array.isArray(value)) return value.length > 0;
      return false;
    });

    if (completedFields.length >= Math.ceil(requiredFields.length * 0.7)) {
      setCompletedSections(prev => new Set([...prev, sectionId]));
    }
  };

  // Safe number formatting function
  const formatCurrency = (value) => {
    const num = parseFloat(value) || 0;
    return isNaN(num) ? '0' : Math.round(num * 100) / 100;
  };

  const formatCurrencyString = (value) => {
    return `$${formatCurrency(value).toLocaleString()}`;
  };

  // Add custom cost line item
  const addCustomCost = (costType) => {
    const newItem = {
      id: Date.now(),
      name: '',
      amount: 0,
      description: '',
      tooltip: ''
    };
    
    setFormData(prev => ({
      ...prev,
      financial: {
        ...prev.financial,
        [costType]: {
          ...prev.financial[costType],
          custom: [...(prev.financial[costType].custom || []), newItem]
        }
      }
    }));
  };

  // Remove custom cost line item
  const removeCustomCost = (costType, itemId) => {
    setFormData(prev => ({
      ...prev,
      financial: {
        ...prev.financial,
        [costType]: {
          ...prev.financial[costType],
          custom: prev.financial[costType].custom.filter(item => item.id !== itemId)
        }
      }
    }));
  };

  // Add product/service
  const addProductService = () => {
    const newProduct = {
      id: Date.now(),
      name: '',
      description: '',
      price: 0,
      costOfGoods: 0,
      monthlyQuantity: 0,
      seasonalVariation: 0
    };
    
    setFormData(prev => ({
      ...prev,
      financial: {
        ...prev.financial,
        productsServices: [...prev.financial.productsServices, newProduct]
      }
    }));
  };

  // Calculate monthly projections with growth and inflation
  const calculateProjections = () => {
    const { financial } = formData;
    
    // Calculate base monthly revenue from all products/services
    const baseRevenue = financial.productsServices.reduce((sum, product) => {
      const price = parseFloat(product.price) || 0;
      const quantity = parseInt(product.monthlyQuantity) || 0;
      return sum + (price * quantity);
    }, 0);
    
    // Calculate total fixed costs (excluding custom array, then adding custom costs)
    const standardFixedCosts = Object.entries(financial.fixedCosts)
      .filter(([key]) => key !== 'custom')
      .reduce((sum, [key, val]) => sum + (parseFloat(val) || 0), 0);
    
    const customFixedCosts = (financial.fixedCosts.custom || [])
      .reduce((sum, cost) => sum + (parseFloat(cost.amount) || 0), 0);
    
    const totalFixedCosts = standardFixedCosts + customFixedCosts;
    
    // Calculate total variable costs (excluding custom array, then adding custom costs)
    const standardVariableCosts = Object.entries(financial.variableCosts)
      .filter(([key]) => key !== 'custom')
      .reduce((sum, [key, val]) => sum + (parseFloat(val) || 0), 0);
    
    const customVariableCosts = (financial.variableCosts.custom || [])
      .reduce((sum, cost) => sum + (parseFloat(cost.amount) || 0), 0);
    
    const totalVariableCosts = standardVariableCosts + customVariableCosts;
    
    // Calculate cost of goods sold (COGS) from products/services
    const baseCOGS = financial.productsServices.reduce((sum, product) => {
      const costOfGoods = parseFloat(product.costOfGoods) || 0;
      const quantity = parseInt(product.monthlyQuantity) || 0;
      return sum + (costOfGoods * quantity);
    }, 0);
    
    return financial.monthlyProjections.map((month, index) => {
      // Growth factor compounds monthly
      const growthFactor = Math.pow(1 + ((parseFloat(financial.salesGrowthRate) || 0) / 100 / 12), index);
      // Inflation factor compounds monthly
      const inflationFactor = Math.pow(1 + ((parseFloat(financial.inflationRate) || 0) / 100 / 12), index);
      
      // Revenue grows with growth factor
      const projectedRevenue = baseRevenue * growthFactor;
      
      // Fixed costs only increase with inflation
      const inflatedFixedCosts = totalFixedCosts * inflationFactor;
      
      // Variable costs grow with sales volume (growth factor) and inflation
      const scaledVariableCosts = totalVariableCosts * growthFactor * inflationFactor;
      
      // COGS scales with sales volume
      const scaledCOGS = baseCOGS * growthFactor;
      
      // Total projected expenses
      const projectedExpenses = inflatedFixedCosts + scaledVariableCosts + scaledCOGS;
      
      return {
        ...month,
        projectedRevenue: Math.round(projectedRevenue * 100) / 100, // Round to 2 decimal places
        projectedExpenses: Math.round(projectedExpenses * 100) / 100,
        profit: Math.round((projectedRevenue - projectedExpenses) * 100) / 100
      };
    });
  };

  // Validation with encouragement
  useEffect(() => {
    const currentSectionData = sections[currentSection];
    if (currentSectionData) {
      const questions = generateChallengeQuestions(currentSectionData.id, formData[currentSectionData.id] || {});
      setChallengeQuestions(questions);
    }
  }, [formData, currentSection]);

  // Hover tooltip component
  const HoverTooltip = ({ content, children }) => (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 w-72 text-center">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );

  // Field with hover tooltip
  const FieldWithTooltip = ({ fieldKey, label, children, required = false }) => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <HoverTooltip content={fieldExplanations[fieldKey] || "Explanation coming soon!"}>
          <label className="block text-sm font-medium cursor-help flex items-center space-x-1" style={{ color: colors.text }}>
            <span>{label} {required && <span className="text-red-500 font-bold">*</span>}</span>
            <HelpCircle className="w-4 h-4 opacity-60 hover:opacity-100" style={{ color: colors.primary }} />
          </label>
        </HoverTooltip>
      </div>
      {children}
    </div>
  );

  // Mobile-friendly rating component
  const RatingInput = ({ value, onChange, max = 10, label }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-xs text-gray-600">
        <span>1 (Low)</span>
        <span className="font-medium">{value || 0}/{max}</span>
        <span>{max} (High)</span>
      </div>
      <input
        type="range"
        min="1"
        max={max}
        value={value || 0}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, ${colors.primary} 0%, ${colors.primary} ${(value/max)*100}%, #e5e7eb ${(value/max)*100}%, #e5e7eb 100%)`
        }}
      />
    </div>
  );

  // Notification banner
  const NotificationBanner = () => (
    <div className="fixed top-4 right-4 space-y-2 z-40">
      {notifications.slice(0, 2).map(notification => (
        <div
          key={notification.id}
          className={`p-3 rounded-lg shadow-lg text-sm max-w-sm animate-slide-in ${
            notification.type === 'success' ? 'bg-green-100 border-green-500 text-green-800' :
            notification.type === 'error' ? 'bg-red-100 border-red-500 text-red-800' :
            'bg-blue-100 border-blue-500 text-blue-800'
          } border-l-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 font-medium">{notification.message}</div>
            <button
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  // Challenge Questions Display
  const ChallengeQuestions = () => (
    challengeQuestions.length > 0 && (
      <div className="mb-6 space-y-3">
        <h4 className="font-bold flex items-center text-lg" style={{ color: colors.text }}>
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
          Reality Check:
        </h4>
        {challengeQuestions.map((challenge, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 text-sm ${
              challenge.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
              'bg-yellow-50 border-yellow-500 text-yellow-800'
            }`}
          >
            <div className="font-medium mb-2">
              {challenge.type === 'error' ? '🚫 IMPORTANT:' : '⚠️ CONSIDER:'}
            </div>
            <div className="leading-relaxed">{challenge.question}</div>
          </div>
        ))}
      </div>
    )
  );

  // Three Fish Section Header
  const ThreeFishHeader = ({ fishApproach }) => {
    if (fishApproach === 'overview') return null;
    
    const approach = threeFishApproach[fishApproach];
    return (
      <div className="mb-6 p-4 rounded-xl border-l-4 shadow-sm" style={{ 
        backgroundColor: `${approach.color}15`, 
        borderColor: approach.color 
      }}>
        <div className="flex items-center space-x-3 mb-2">
          <Fish className="w-6 h-6" style={{ color: approach.color }} />
          <h3 className="font-bold text-lg" style={{ color: approach.color }}>
            {approach.title}
          </h3>
        </div>
        <p className="text-sm mb-2" style={{ color: colors.text }}>
          {approach.description}
        </p>
        <p className="text-xs text-gray-600">
          Focus: {approach.focus}
        </p>
      </div>
    );
  };

  // Progress indicator
  const ProgressIndicator = () => {
    const progress = calculateProgress();
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border" style={{ borderColor: colors.border }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Your Progress</span>
          <span className="text-sm font-bold" style={{ color: colors.primary }}>{progress.required}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-500" 
            style={{ 
              width: `${progress.required}%`,
              backgroundColor: colors.primary 
            }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {completedSections.size} of {sections.length} sections explored
        </p>
      </div>
    );
  };

  // Section rendering functions
  const renderDashboard = () => {
    const progress = calculateProgress();
    const totalStartupCosts = Object.values(formData.financial.startupCosts)
      .reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    
    const standardFixedCosts = Object.entries(formData.financial.fixedCosts)
      .filter(([key]) => key !== 'custom')
      .reduce((sum, [key, val]) => sum + (parseFloat(val) || 0), 0);
    
    const customFixedCosts = (formData.financial.fixedCosts.custom || [])
      .reduce((sum, cost) => sum + (parseFloat(cost.amount) || 0), 0);
    
    const totalMonthlyFixed = standardFixedCosts + customFixedCosts;
    const recentWins = formData.winsTracking.dailyWins.slice(0, 3);

    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="rounded-xl p-6 text-white" style={{ 
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` 
        }}>
          <div className="flex items-center space-x-3 mb-4">
            <Rocket className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Your Business Journey</h1>
              <p className="text-blue-100">Building something amazing with faith and wisdom</p>
            </div>
          </div>
          
          {/* Three Fish Approach Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
            {Object.entries(threeFishApproach).map(([key, approach]) => (
              <div key={key} className="p-3 rounded-lg bg-white bg-opacity-20">
                <div className="font-semibold text-sm mb-1">{approach.title}</div>
                <div className="text-xs opacity-90">{approach.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <ProgressIndicator />

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl text-center border" style={{ borderColor: colors.border }}>
            <div className="text-xl font-bold" style={{ color: colors.primary }}>
              {formatCurrencyString(totalStartupCosts)}
            </div>
            <div className="text-sm text-gray-600">Startup Investment</div>
          </div>
          <div className="p-4 bg-green-50 rounded-xl text-center border" style={{ borderColor: colors.border }}>
            <div className="text-xl font-bold" style={{ color: colors.secondary }}>
              {formatCurrencyString(totalMonthlyFixed)}
            </div>
            <div className="text-sm text-gray-600">Monthly Expenses</div>
          </div>
        </div>

        {/* Readiness Assessment Results */}
        {formData.readinessAssessment.riskTolerance > 0 && (
          <div className="bg-purple-50 rounded-xl p-4 border" style={{ borderColor: colors.border }}>
            <h3 className="font-bold text-purple-800 mb-3 flex items-center">
              <Brain className="w-5 h-5 mr-2" />
              Your Readiness Score
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-purple-700">Risk Comfort:</span>
                <div className="font-bold">{formData.readinessAssessment.riskTolerance}/10</div>
              </div>
              <div>
                <span className="text-purple-700">Time Available:</span>
                <div className="font-bold">{formData.readinessAssessment.timeAvailable} hrs/week</div>
              </div>
              <div>
                <span className="text-purple-700">Family Support:</span>
                <div className="font-bold">{formData.readinessAssessment.familySupport}/10</div>
              </div>
              <div>
                <span className="text-purple-700">Financial Cushion:</span>
                <div className="font-bold">{formData.readinessAssessment.financialCushion} months</div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Wins */}
        <div className="bg-yellow-50 rounded-xl p-4 border" style={{ borderColor: colors.border }}>
          <h3 className="font-bold text-yellow-800 mb-3 flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            Your Recent Wins
          </h3>
          {recentWins.length > 0 ? (
            <div className="space-y-2">
              {recentWins.map(win => (
                <div key={win.id} className="flex items-center space-x-2 text-sm">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-800">{win.description}</span>
                  <span className="text-yellow-600 text-xs">
                    {new Date(win.date).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-yellow-700 text-sm">
              Start exploring sections to track your progress! Every step counts.
            </p>
          )}
        </div>

        {/* Next Steps */}
        <div className="border rounded-xl p-4" style={{ borderColor: colors.border }}>
          <h3 className="font-bold mb-3 flex items-center" style={{ color: colors.text }}>
            <Flag className="w-5 h-5 mr-2" />
            What's Next?
          </h3>
          {progress.required < 100 ? (
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">Keep working through the required sections:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {sections.filter(s => s.required && !completedSections.has(s.id)).slice(0, 3).map(section => (
                  <li key={section.id}>{section.title}: {section.description}</li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-sm">
              <p className="text-green-700 font-medium mb-2">🎉 Amazing! You've completed all required sections!</p>
              <p className="text-gray-600">Now explore the optional sections to fine-tune your business plan.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderReadinessAssessment = () => (
    <div className="space-y-6">
      <ThreeFishHeader fishApproach="teachFish" />
      
      <div className="bg-blue-50 rounded-xl p-4 border-l-4" style={{ borderColor: colors.primary }}>
        <h3 className="font-bold mb-2" style={{ color: colors.primary }}>
          🤔 Let's Be Honest: Are You Really Ready?
        </h3>
        <p className="text-sm" style={{ color: colors.text }}>
          Business is tough. It's better to know now if you're ready than to find out later when you've spent money and time.
        </p>
      </div>

      <ChallengeQuestions />

      <FieldWithTooltip fieldKey="riskTolerance" label="How comfortable are you with uncertainty?" required>
        <RatingInput
          value={formData.readinessAssessment.riskTolerance}
          onChange={(value) => handleInputChange('readinessAssessment', 'riskTolerance', value)}
          max={10}
        />
        <p className="text-xs text-gray-600 mt-1">
          Business means not knowing if you'll make money next month. Rate your comfort level.
        </p>
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="familySupport" label="Does your family support this dream?" required>
        <RatingInput
          value={formData.readinessAssessment.familySupport}
          onChange={(value) => handleInputChange('readinessAssessment', 'familySupport', value)}
          max={10}
        />
        <p className="text-xs text-gray-600 mt-1">
          You'll work nights and weekends. Will your family understand and support you?
        </p>
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="timeAvailable" label="Hours per week you can realistically work on this" required>
        <input
          type="number"
          value={formData.readinessAssessment.timeAvailable}
          onChange={(e) => handleInputChange('readinessAssessment', 'timeAvailable', parseInt(e.target.value) || 0)}
          className="w-full p-3 border rounded-lg text-lg font-medium focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="20"
          min="0"
          max="80"
        />
        <p className="text-xs text-gray-600 mt-1">
          Be honest. Factor in your current job, family time, and sleep. Most need 20+ hours.
        </p>
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="financialCushion" label="How many months can your family survive without business income?" required>
        <input
          type="number"
          value={formData.readinessAssessment.financialCushion}
          onChange={(e) => handleInputChange('readinessAssessment', 'financialCushion', parseInt(e.target.value) || 0)}
          className="w-full p-3 border rounded-lg text-lg font-medium focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="6"
          min="0"
          max="24"
        />
        <p className="text-xs text-gray-600 mt-1">
          Most businesses take 6-12 months to become profitable. Do you have enough savings?
        </p>
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="motivationLevel" label="How badly do you want this?" required>
        <RatingInput
          value={formData.readinessAssessment.motivationLevel}
          onChange={(value) => handleInputChange('readinessAssessment', 'motivationLevel', value)}
          max={10}
        />
        <p className="text-xs text-gray-600 mt-1">
          On tough days, what will keep you going? Rate your drive and determination.
        </p>
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="previousExperience" label="Previous business or leadership experience">
        <textarea
          value={formData.readinessAssessment.previousExperience}
          onChange={(e) => handleInputChange('readinessAssessment', 'previousExperience', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="Managed a team of 5 people... Ran a lemonade stand... Sold stuff on eBay... No experience, but willing to learn..."
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="personalWhyStatement" label="Why do you want to start a business?" required>
        <textarea
          value={formData.readinessAssessment.personalWhyStatement}
          onChange={(e) => handleInputChange('readinessAssessment', 'personalWhyStatement', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="I want to be my own boss... I have a great idea... I want to serve my community... I need more income..."
          rows={4}
        />
      </FieldWithTooltip>

      {/* Reality Check Results */}
      {formData.readinessAssessment.riskTolerance > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 border">
          <h3 className="font-bold mb-3 text-gray-800">📊 Your Readiness Reality Check</h3>
          <div className="space-y-2 text-sm">
            {formData.readinessAssessment.riskTolerance < 5 && (
              <div className="text-orange-700">⚠️ Low risk tolerance - business might be stressful for you</div>
            )}
            {formData.readinessAssessment.timeAvailable < 20 && (
              <div className="text-red-700">🚨 May not have enough time for business success</div>
            )}
            {formData.readinessAssessment.familySupport < 7 && (
              <div className="text-orange-700">⚠️ Work on getting more family buy-in first</div>
            )}
            {formData.readinessAssessment.financialCushion < 6 && (
              <div className="text-red-700">🚨 Need bigger financial safety net</div>
            )}
            {formData.readinessAssessment.riskTolerance >= 7 && 
             formData.readinessAssessment.timeAvailable >= 20 && 
             formData.readinessAssessment.familySupport >= 7 && 
             formData.readinessAssessment.financialCushion >= 6 && (
              <div className="text-green-700 font-medium">🎉 You look ready for entrepreneurship!</div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  const renderFaithDrivenPurpose = () => (
    <div className="space-y-6">
      <ThreeFishHeader fishApproach="equipDiscipleship" />
      
      <div className="bg-blue-50 rounded-xl p-4 border-l-4" style={{ borderColor: colors.accent }}>
        <h3 className="font-bold mb-2" style={{ color: colors.accent }}>
          🙏 Define Your God-Given Purpose and Direction
        </h3>
        <p className="text-sm" style={{ color: colors.text }}>
          "In their hearts humans plan their course, but the LORD establishes their steps." - Proverbs 16:9
        </p>
      </div>

      <FieldWithTooltip fieldKey="visionStatement" label="Vision Statement ✨" required>
        <textarea
          value={formData.faithDrivenPurpose.visionStatement}
          onChange={(e) => handleInputChange('faithDrivenPurpose', 'visionStatement', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="What big thing is God calling you to accomplish through this business?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="missionStatement" label="Mission Statement 🎯" required>
        <textarea
          value={formData.faithDrivenPurpose.missionStatement}
          onChange={(e) => handleInputChange('faithDrivenPurpose', 'missionStatement', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="How will you serve God and love others through this business?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="faithDrivenImpact" label="Faith-Driven Impact 👑" required>
        <textarea
          value={formData.faithDrivenPurpose.faithDrivenImpact}
          onChange={(e) => handleInputChange('faithDrivenPurpose', 'faithDrivenImpact', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="How will this business help make disciples and serve God's purposes?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="discipleshipPlan" label="Discipleship Plan ⚡" required>
        <textarea
          value={formData.faithDrivenPurpose.discipleshipPlan}
          onChange={(e) => handleInputChange('faithDrivenPurpose', 'discipleshipPlan', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="How will you equip others for discipleship through your business?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="biblicalFoundation" label="Biblical Foundation 📖" required>
        <textarea
          value={formData.faithDrivenPurpose.biblicalFoundation}
          onChange={(e) => handleInputChange('faithDrivenPurpose', 'biblicalFoundation', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="What Bible verses will guide your business decisions and practices?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="ethicalFramework" label="Ethical Decision Framework 🧭">
        <textarea
          value={formData.faithDrivenPurpose.ethicalFramework}
          onChange={(e) => handleInputChange('faithDrivenPurpose', 'ethicalFramework', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="When you face tough business decisions, how will you choose what's right?"
          rows={3}
        />
      </FieldWithTooltip>
    </div>
  );

  const renderBusinessBasics = () => (
    <div className="space-y-6">
      <ThreeFishHeader fishApproach="teachFish" />
      
      <FieldWithTooltip fieldKey="businessName" label="Business Name" required>
        <input
          type="text"
          value={formData.businessBasics.businessName}
          onChange={(e) => handleInputChange('businessBasics', 'businessName', e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none text-lg font-medium"
          style={{ borderColor: colors.border }}
          placeholder="What will customers call your business?"
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="industry" label="Industry" required>
        <select
          value={formData.businessBasics.industry}
          onChange={(e) => handleInputChange('businessBasics', 'industry', e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
        >
          <option value="">Pick your industry</option>
          <option value="restaurant">🍽️ Restaurant/Food Service</option>
          <option value="retail">🏪 Retail Store</option>
          <option value="consulting">💼 Consulting</option>
          <option value="ecommerce">💻 Online Store</option>
          <option value="services">✂️ Personal Services</option>
          <option value="ministry">⛪ Ministry/Non-profit</option>
          <option value="manufacturing">🏭 Manufacturing</option>
          <option value="technology">💻 Technology</option>
          <option value="healthcare">🏥 Healthcare</option>
          <option value="education">📚 Education/Training</option>
        </select>
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="legalStructure" label="Legal Structure" required>
        <select
          value={formData.businessBasics.legalStructure}
          onChange={(e) => handleInputChange('businessBasics', 'legalStructure', e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
        >
          <option value="">Select structure</option>
          <option value="sole_proprietorship">Sole Proprietorship</option>
          <option value="partnership">Partnership</option>
          <option value="llc">LLC (Recommended)</option>
          <option value="corporation">Corporation</option>
          <option value="s_corp">S Corporation</option>
          <option value="nonprofit">Non-profit</option>
        </select>
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="businessAddress" label="Business Address" required>
        <input
          type="text"
          value={formData.businessBasics.businessAddress}
          onChange={(e) => handleInputChange('businessBasics', 'businessAddress', e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="123 Main St, City, State ZIP"
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="description" label="Business Description" required>
        <textarea
          value={formData.businessBasics.description}
          onChange={(e) => handleInputChange('businessBasics', 'description', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="What does your business do? How does it help customers?"
          rows={4}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="uniqueValue" label="What Makes You Different?" required>
        <textarea
          value={formData.businessBasics.uniqueValue}
          onChange={(e) => handleInputChange('businessBasics', 'uniqueValue', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="Why should customers choose you over everyone else?"
          rows={3}
        />
      </FieldWithTooltip>
    </div>
  );

  const renderMarketOpportunity = () => (
    <div className="space-y-6">
      <ThreeFishHeader fishApproach="teachFish" />
      
      <div className="bg-green-50 rounded-xl p-4 border-l-4" style={{ borderColor: colors.secondary }}>
        <h3 className="font-bold mb-2" style={{ color: colors.secondary }}>
          🎯 Is This Actually A Good Opportunity?
        </h3>
        <p className="text-sm" style={{ color: colors.text }}>
          Not every business idea is worth pursuing. Let's validate this opportunity before you invest time and money.
        </p>
      </div>

      <FieldWithTooltip fieldKey="marketTiming" label="Why is NOW the right time?" required>
        <textarea
          value={formData.marketOpportunity.marketTiming}
          onChange={(e) => handleInputChange('marketOpportunity', 'marketTiming', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="What trends, changes, or timing make this the perfect moment for your business?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="competitiveBarriers" label="What makes you hard to copy?" required>
        <textarea
          value={formData.marketOpportunity.competitiveBarriers}
          onChange={(e) => handleInputChange('marketOpportunity', 'competitiveBarriers', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="What special skills, relationships, or advantages make it hard for others to replicate your business?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="industryTrends" label="Industry Growth Trends" required>
        <textarea
          value={formData.marketOpportunity.industryTrends}
          onChange={(e) => handleInputChange('marketOpportunity', 'industryTrends', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="Is your industry growing or shrinking? What changes are happening that help or hurt you?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="whyNow" label="The 'Why Now?' Story" required>
        <textarea
          value={formData.marketOpportunity.whyNow}
          onChange={(e) => handleInputChange('marketOpportunity', 'whyNow', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="If someone asked 'Why are you starting this business right now?' what would you say?"
          rows={4}
        />
      </FieldWithTooltip>
    </div>
  );

  const renderMarketValidation = () => (
    <div className="space-y-6">
      <ThreeFishHeader fishApproach="teachFish" />
      <ChallengeQuestions />
      
      <div className="bg-yellow-50 rounded-xl p-4 border-l-4 border-yellow-500">
        <h3 className="font-bold text-yellow-800 mb-2">🚨 MOST IMPORTANT SECTION!</h3>
        <p className="text-yellow-700 text-sm">
          This is where businesses succeed or fail. You MUST have proof that real people will pay real money for what you're selling.
        </p>
      </div>

      <FieldWithTooltip fieldKey="productDefinition" label="🎯 What exactly are you selling?" required>
        <textarea
          value={formData.marketValidation.productDefinition}
          onChange={(e) => handleInputChange('marketValidation', 'productDefinition', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="Be specific: What do customers get? What problem do you solve? What's included?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="customerValidationEvidence" label="🚨 Customer Proof (REQUIRED FOR FUNDING)" required>
        <textarea
          value={formData.marketValidation.customerValidationEvidence}
          onChange={(e) => handleInputChange('marketValidation', 'customerValidationEvidence', e.target.value)}
          className="w-full p-3 border-2 border-red-300 rounded-lg text-sm focus:ring-2 focus:outline-none"
          placeholder="List 3+ people you talked to. What did they say? Would they buy? Include names and quotes. Be specific!"
          rows={5}
        />
        {!formData.marketValidation.customerValidationEvidence && (
          <div className="mt-2 p-3 bg-red-50 rounded text-sm text-red-700">
            ❌ <strong>NO FUNDING WITHOUT CUSTOMER PROOF:</strong> Talk to real potential customers first! Most businesses fail because they build something nobody wants.
          </div>
        )}
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="targetCustomerProfile" label="👥 Who exactly is your ideal customer?" required>
        <textarea
          value={formData.marketValidation.targetCustomerProfile}
          onChange={(e) => handleInputChange('marketValidation', 'targetCustomerProfile', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="Age, income, location, lifestyle, problems they have. Be specific - 'everyone' is not a target market."
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="competitorAnalysis" label="🏆 Competition Research" required>
        <textarea
          value={formData.marketValidation.competitorAnalysis}
          onChange={(e) => handleInputChange('marketValidation', 'competitorAnalysis', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="List 5+ competitors: Names, prices, what they do well, what they do poorly. Visit their websites, call them!"
          rows={4}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="priceStrategy" label="💰 Price Strategy" required>
        <textarea
          value={formData.marketValidation.priceStrategy}
          onChange={(e) => handleInputChange('marketValidation', 'priceStrategy', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="Your prices vs competitor prices. Why will people pay your price? How did you test this?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="promotionPlan" label="📢 How will customers find you?" required>
        <textarea
          value={formData.marketValidation.promotionPlan}
          onChange={(e) => handleInputChange('marketValidation', 'promotionPlan', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="Social media, word of mouth, advertising, networking - how will you get your first 10 customers?"
          rows={3}
        />
      </FieldWithTooltip>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <NotificationBanner />
      {showWinCelebration && (
        <WinCelebration 
          message="You're making real progress on your faith-driven business!"
          onClose={() => setShowWinCelebration(false)}
        />
      )}
      
      {/* IBAM Header Integration */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-30" style={{ borderColor: colors.border }}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Fish className="w-6 h-6" style={{ color: colors.primary }} />
              <div>
                <h1 className="text-lg font-bold" style={{ color: colors.primary }}>
                  IBAM Business Builder
                </h1>
                <p className="text-xs text-gray-600">Empower. Educate. Equip.</p>
              </div>
            </div>
            <div className="text-right text-xs text-gray-600">
              <div>Progress: {calculateProgress().required}%</div>
              <div>Auto-saving ✓</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Section Navigation */}
      <div className="bg-white shadow-sm px-4 py-3 sticky top-16 z-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-2 overflow-x-auto pb-2 hide-scrollbar">
            {sections.map((section, index) => {
              const isActive = currentSection === index;
              const isCompleted = completedSections.has(section.id);
              const fishColor = threeFishApproach[section.fishApproach]?.color || colors.primary;
              
              return (
                <button
                  key={section.id}
                  onClick={() => setCurrentSection(index)}
                  className={`flex flex-col items-center px-3 py-3 rounded-xl transition-all duration-200 border-2 min-w-28 hover:scale-105 ${
                    isActive 
                      ? 'text-white shadow-lg transform scale-105' 
                      : 'bg-white text-gray-700 hover:shadow-md hover:border-opacity-60'
                  }`}
                  style={{
                    backgroundColor: isActive ? fishColor : `${fishColor}15`,
                    borderColor: isActive ? fishColor : (isCompleted ? colors.success : `${fishColor}40`)
                  }}
                >
                  <div className="flex items-center justify-center mb-2 relative">
                    <div 
                      className={`p-1 rounded-lg ${isActive ? 'bg-white bg-opacity-20' : ''}`}
                      style={{ color: isActive ? 'white' : fishColor }}
                    >
                      {section.icon}
                    </div>
                    {isCompleted && (
                      <CheckCircle className="w-4 h-4 text-green-500 absolute -top-1 -right-1 bg-white rounded-full" />
                    )}
                    {section.required && !isCompleted && (
                      <div className="w-2 h-2 bg-red-500 rounded-full absolute -top-1 -right-1"></div>
                    )}
                  </div>
                  <span className={`font-semibold text-xs sm:text-sm text-center leading-tight ${isActive ? 'text-white' : ''}`} style={{ color: isActive ? 'white' : fishColor }}>
                    {section.title}
                  </span>
                  <span className={`text-xs mt-1 text-center leading-tight hidden sm:block ${isActive ? 'text-white opacity-90' : 'text-gray-600'}`}>
                    {section.subtitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 pb-24">
        <div className="bg-white rounded-xl shadow-sm p-6" style={{ borderColor: colors.border }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-lg" style={{ backgroundColor: `${colors.primary}15` }}>
              {currentSectionData.icon}
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                {currentSectionData.title}
              </h2>
              <p className="text-sm text-gray-600">{currentSectionData.description}</p>
            </div>
          </div>

          {renderCurrentSection()}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg" style={{ borderColor: colors.border }}>
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg disabled:opacity-50 hover:bg-gray-600 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="text-center">
              <div className="text-sm text-gray-600">
                {currentSection + 1} of {sections.length}
              </div>
              <div className="text-xs text-gray-500">
                {calculateProgress().required}% Complete
              </div>
            </div>

            <button
              onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
              disabled={currentSection === sections.length - 1}
              className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg disabled:opacity-50 hover:opacity-90 transition-colors"
              style={{ backgroundColor: colors.primary }}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* IBAM Footer Integration */}
      <div className="mt-8 p-6 text-center text-white" style={{ 
        background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` 
      }}>
        <BookOpen className="w-6 h-6 mx-auto mb-2 opacity-90" />
        <p className="text-sm font-medium italic mb-2">
          "For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, to give you hope and a future."
        </p>
        <p className="text-xs opacity-90 mb-4">- Jeremiah 29:11</p>
        
        <div className="flex justify-center space-x-6 text-xs opacity-75">
          <span>© 2024 IBAM</span>
          <span>Empower. Educate. Equip.</span>
          <span>Faith-Driven Entrepreneurship</span>
        </div>
      </div>

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default IBAMBusinessPlanner;

