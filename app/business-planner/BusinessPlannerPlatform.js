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
  Fish
} from 'lucide-react';

const IBAMBusinessPlanner = () => {
  // IBAM Brand Colors & Design System
  const colors = {
    primary: '#2563eb', // IBAM Blue
    secondary: '#059669', // IBAM Green  
    accent: '#dc2626', // IBAM Red
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

  // Win tracking and encouragement system
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

  const winCategories = {
    customer: "Talked to a real customer",
    research: "Did market research", 
    money: "Figured out costs or pricing",
    progress: "Completed a business plan section",
    learning: "Learned from a mistake",
    faith: "Applied faith to business decisions"
  };

  // Complete field explanations in everyday language
  const fieldExplanations = {
    // Business Basics
    businessName: "This is what customers will call your business. Pick something easy to remember, spell, and say out loud. Avoid confusing abbreviations or overly clever names.",
    industry: "What type of business are you starting? This helps us give you specific advice, cost estimates, and legal requirements based on what works in your industry.",
    legalStructure: "How your business is legally organized affects taxes, liability, and paperwork.",
    sole_proprietorship: "You own the business alone. Simplest taxes (report on personal tax return), but you're personally responsible for all business debts and lawsuits.",
    partnership: "You and one or more people own the business together. Share profits, losses, and responsibilities. Need a written partnership agreement.",
    llc: "Limited Liability Company - protects your personal assets (house, car, savings) if the business gets sued or goes into debt. More paperwork but worth the protection.",
    corporation: "Separate legal entity. Maximum protection but complex taxes and lots of paperwork. Good for businesses planning to have investors.",
    s_corp: "Special tax election that can save on self-employment taxes if you make good profit. Requires payroll and more complexity.",
    nonprofit: "Tax-exempt organization for charitable, religious, or social causes. Requires IRS approval and has restrictions on activities.",
    businessAddress: "Where your business is legally located. Can be your home address if working from home. Affects taxes, licenses, and legal notices.",
    description: "Explain what your business does in simple terms that a 10-year-old could understand. What problem do you solve for customers?",
    uniqueValue: "Why should customers choose you instead of your competitors? What makes you special, better, or different?",

    // Faith-Driven Purpose
    visionStatement: "The big picture of what God is calling you to accomplish. Think 5-10 years out. How will this business serve His purposes and make an eternal impact?",
    missionStatement: "Your day-to-day purpose. How will you serve God and love others through this business? What drives you to get up every morning?",
    faithDrivenImpact: "How will this business help make disciples, serve the community, and advance God's work on earth? What spiritual impact will it have?",
    discipleshipPlan: "How will you use this business to help others grow in their faith? Will you mentor employees, serve the community, or support missions?",
    biblicalFoundation: "What Bible verses will guide your business decisions? What Christian principles will you follow even when it costs money?",

    // Market Research  
    productDefinition: "Describe exactly what customers buy from you. What do they get? What problem does it solve? Be specific about features and benefits.",
    customerValidationEvidence: "CRITICAL: Proof that real people want to buy this. List specific conversations with potential customers. What did they say? Would they actually pay?",
    targetCustomerProfile: "Who exactly is your ideal customer? Age, income, location, lifestyle, problems they have. The more specific, the better your marketing.",
    competitorAnalysis: "Who else does what you want to do? Research their prices, strengths, weaknesses. Call them, visit their websites, read their reviews.",
    priceStrategy: "What will you charge? Why will customers pay that much? How does it compare to competitors? Can you make profit at this price?",
    promotionPlan: "How will customers find out about you? Social media, word of mouth, advertising, networking. How will you get your first 10 customers?",
    customerAcquisitionCost: "How much money does it cost to get one new customer? Add up marketing expenses and divide by number of customers gained.",
    customerLifetimeValue: "How much total money will one customer spend with you over their lifetime? Include repeat purchases and referrals.",

    // Financial Planning
    bootstrapBudget: "How much money can you actually spend without borrowing or going into debt? Look at your savings account right now.",
    planningPeriod: "How many months to project into the future. 36 months (3 years) gives a realistic picture of business growth.",
    inflationRate: "How much prices increase each year. US average is 2-4%. Higher rates mean your costs will go up faster.",
    salaryIncreaseRate: "Annual raises for employees. 3-5% is typical to keep good people and account for inflation.",
    salesGrowthRate: "How much you expect sales to grow each month. Be realistic - 5-15% monthly growth is aggressive but possible.",

    // Startup Costs
    equipment: "Tools, machines, computers, furniture needed to run your business. Include delivery and setup costs. Buy used when possible.",
    initialInventory: "Products or materials you need to stock before opening. Start with 1-3 months worth. Don't overstock initially.",
    deposits: "Security deposits required by landlords, utility companies, suppliers. Usually 1-2 months of service.",
    licenses: "Business license, professional licenses, permits required to legally operate. Research your city/state requirements.",
    initialMarketing: "Money for grand opening, website, business cards, signs, initial advertising. Focus on low-cost, high-impact marketing.",
    workingCapital: "Cash buffer for the first few months before profits arrive. Recommended: 3-6 months of expenses.",
    furniture: "Desks, chairs, shelving, display cases needed to furnish your business space.",
    technology: "Computers, tablets, software, point-of-sale systems, internet setup.",
    renovation: "Costs to modify your space for business use. Get contractor quotes before estimating.",
    legal: "Lawyer fees for contracts, business formation, trademark. Accountant setup fees.",

    // Fixed Monthly Costs
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

    // Variable Costs
    materials: "Raw materials or products you sell. Usually 25-50% of revenue for retail/manufacturing businesses.",
    inventory: "Ongoing inventory purchases to restock products. Varies with sales volume.",
    shipping: "Costs to deliver products to customers. Include packaging materials and delivery fees.",
    creditCardFees: "Fees charged by payment processors. Typically 2.5-3.5% of credit card sales.",
    marketing: "Ongoing marketing and advertising costs. Recommended 5-10% of revenue for growth.",
    travel: "Business travel, vehicle expenses, gas for deliveries or client visits.",
    supplies: "Office supplies, cleaning supplies, small tools. Usually $50-200/month.",
    contractors: "Temporary help, freelancers, specialized services you outsource instead of hiring employees.",

    // Faith Metrics
    dailyPrayer: "Set a realistic daily prayer goal in minutes. Even 5-10 minutes counts if you do it consistently. This keeps God at the center of your business decisions.",
    bibleStudy: "How many times per week will you study Scripture? Include personal study, small groups, or Bible studies related to business and calling.",
    worship: "Corporate worship (church) plus personal worship times per week. Includes church services, small groups, personal worship time.",
    customerService: "Rate yourself 1-10: How excellently are you loving and serving customers? Going above and beyond their expectations?",
    integrityStandard: "Rate yourself 1-10: How consistently do you follow biblical principles in business decisions, even when it costs money?",
    discipleshipOpportunities: "Count monthly conversations or opportunities where you help others grow in faith through your business relationships.",
    communityService: "Hours per month you or your business serves the local community. Include volunteer work, donations, community involvement."
  };

  // Three Fish Integration
  const threeFishApproach = {
    giveFish: {
      title: "🐟 GIVE A FISH",
      description: "Start-up funding to launch your faith-driven business",
      focus: "Minimal capital requirements, bootstrap approach"
    },
    teachFish: {
      title: "🎣 TEACH TO FISH", 
      description: "Entrepreneur training for sustainable development",
      focus: "Skills, market validation, customer research"
    },
    equipDiscipleship: {
      title: "⚡ EQUIP FOR DISCIPLESHIP",
      description: "Multiplication through discipleship in business",
      focus: "Faith integration, community impact, spiritual growth"
    }
  };

  const [formData, setFormData] = useState({
    faithDrivenPurpose: {
      visionStatement: '',
      missionStatement: '',
      faithDrivenImpact: '',
      biblicalFoundation: '',
      discipleshipPlan: ''
    },
    businessBasics: {
      businessName: '',
      industry: '',
      legalStructure: '',
      businessAddress: '',
      description: '',
      uniqueValue: ''
    },
    marketResearch: {
      productDefinition: '',
      priceStrategy: '',
      promotionPlan: '',
      targetCustomerProfile: '',
      customerValidationEvidence: '',
      competitorAnalysis: '',
      customerAcquisitionCost: 0,
      customerLifetimeValue: 0,
      marketSizeEvidence: '',
      competitiveAdvantage: '',
      customerPainPoints: '',
      solutionValidation: ''
    },
    serviceDetails: {
      isServiceBusiness: false,
      services: [],
      hourlyRate: 0,
      averageServiceTime: 0,
      dailyCapacity: 0,
      scalingStrategy: ''
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
    faithMetrics: {
      personalGrowth: {
        dailyPrayer: { goal: 0, actual: 0 },
        bibleStudy: { goal: 0, actual: 0 },
        worship: { goal: 0, actual: 0 }
      },
      businessImpact: {
        customerService: { goal: 0, actual: 0 },
        integrityStandard: { goal: 0, actual: 0 },
        discipleshipOpportunities: { goal: 0, actual: 0 },
        communityService: { goal: 0, actual: 0 }
      }
    },
    winsTracking: {
      dailyWins: [],
      weeklyWins: [],
      monthlyWins: [],
      lessonsLearned: []
    }
  });

  const sections = [
    { 
      id: 'dashboard', 
      title: 'Overview', 
      icon: <BarChart3 className="w-5 h-5" />,
      fishApproach: 'overview'
    },
    { 
      id: 'faithDrivenPurpose', 
      title: 'Faith Purpose', 
      icon: <Heart className="w-5 h-5" />,
      fishApproach: 'equipDiscipleship'
    },
    { 
      id: 'businessBasics', 
      title: 'Business Core', 
      icon: <Building className="w-5 h-5" />,
      fishApproach: 'teachFish'
    },
    { 
      id: 'marketResearch', 
      title: 'Market Validation', 
      icon: <Search className="w-5 h-5" />,
      fishApproach: 'teachFish'
    },
    { 
      id: 'financial', 
      title: 'Financial Plan', 
      icon: <DollarSign className="w-5 h-5" />,
      fishApproach: 'giveFish'
    },
    { 
      id: 'faithMetrics', 
      title: 'Faith Growth', 
      icon: <BookOpen className="w-5 h-5" />,
      fishApproach: 'equipDiscipleship'
    },
    { 
      id: 'winsTracking', 
      title: 'Your Wins', 
      icon: <Trophy className="w-5 h-5" />,
      fishApproach: 'equipDiscipleship'
    }
  ];

  // Win celebration popup
  const WinCelebration = ({ message, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="font-bold text-xl mb-3" style={{ color: colors.primary }}>You Just Won!</h3>
        <p className="text-gray-700 mb-4">{message}</p>
        <button 
          onClick={onClose}
          className="text-white px-6 py-2 rounded hover:opacity-90"
          style={{ backgroundColor: colors.success }}
        >
          Keep Going! 🚀
        </button>
      </div>
    </div>
  );

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
    const randomMessage = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
    addNotification('success', randomMessage);
  };

  // Challenge questions system
  const generateChallengeQuestions = (section, data) => {
    const questions = [];
    
    if (section === 'marketResearch') {
      if (!data.customerValidationEvidence) {
        questions.push({
          type: 'error',
          question: 'LOAN OFFICER SAYS: Show me 3 people who said they would buy this. No loan without customer proof!',
          field: 'customerValidationEvidence'
        });
      }
      
      if (!data.competitorAnalysis) {
        questions.push({
          type: 'warning',
          question: 'RESEARCH REQUIRED: Name 5 competitors. What do they charge? Why will customers pick you?',
          field: 'competitorAnalysis'
        });
      }
    }
    
    if (section === 'financial') {
      const totalStartup = Object.values(data.startupCosts || {}).reduce((sum, val) => sum + (val || 0), 0);
      if (totalStartup > data.bootstrapBudget) {
        questions.push({
          type: 'error',
          question: `TOO EXPENSIVE: You want $${totalStartup.toLocaleString()} but only have $${data.bootstrapBudget?.toLocaleString()}. What can you eliminate?`,
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
    }, 5000);
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

    // Detect wins
    if (field === 'businessName' && value.length > 3) {
      addWin('progress', 'Picked a business name');
    }
    if (field === 'customerValidationEvidence' && value.length > 50) {
      addWin('customer', 'Added customer validation evidence');
    }
    if (field === 'competitorAnalysis' && value.length > 100) {
      addWin('research', 'Researched competitors');
    }
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
    const baseRevenue = financial.productsServices.reduce((sum, product) => 
      sum + (product.price * product.monthlyQuantity), 0);
    
    const fixedCosts = Object.values(financial.fixedCosts).reduce((sum, val) => sum + (val || 0), 0);
    const variableCosts = Object.values(financial.variableCosts).reduce((sum, val) => sum + (val || 0), 0);
    
    return financial.monthlyProjections.map((month, index) => {
      const growthFactor = Math.pow(1 + (financial.salesGrowthRate / 100 / 12), index);
      const inflationFactor = Math.pow(1 + (financial.inflationRate / 100 / 12), index);
      
      const projectedRevenue = baseRevenue * growthFactor;
      const projectedExpenses = (fixedCosts * inflationFactor) + (variableCosts * growthFactor);
      
      return {
        ...month,
        projectedRevenue,
        projectedExpenses,
        profit: projectedRevenue - projectedExpenses
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
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 w-64">
        {content}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
      </div>
    </div>
  );

  // Field with hover tooltip
  const FieldWithTooltip = ({ fieldKey, label, children, required = false }) => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <HoverTooltip content={fieldExplanations[fieldKey] || "Field explanation not available"}>
          <label className="block text-sm font-bold cursor-help flex items-center space-x-1" style={{ color: colors.text }}>
            <span>{label} {required && <span className="text-red-500">*</span>}</span>
            <HelpCircle className="w-4 h-4 opacity-60" style={{ color: colors.primary }} />
          </label>
        </HoverTooltip>
      </div>
      {children}
    </div>
  );

  // Notification banner
  const NotificationBanner = () => (
    <div className="fixed top-4 right-4 space-y-2 z-40">
      {notifications.slice(0, 3).map(notification => (
        <div
          key={notification.id}
          className={`p-3 rounded shadow-lg text-sm max-w-sm ${
            notification.type === 'success' ? 'bg-green-100 border-green-500 text-green-800' :
            notification.type === 'error' ? 'bg-red-100 border-red-500 text-red-800' :
            'bg-blue-100 border-blue-500 text-blue-800'
          } border-l-4`}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">{notification.message}</div>
            <button
              onClick={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
              className="ml-2 text-gray-500"
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
        <h4 className="font-bold flex items-center" style={{ color: colors.text }}>
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
          Loan Officer Says:
        </h4>
        {challengeQuestions.map((challenge, index) => (
          <div
            key={index}
            className={`p-3 rounded border-l-4 text-sm ${
              challenge.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
              'bg-yellow-50 border-yellow-500 text-yellow-800'
            }`}
          >
            <div className="font-medium mb-1">
              {challenge.type === 'error' ? '🚫 REQUIRED:' : '⚠️ RECOMMENDED:'}
            </div>
            <div>{challenge.question}</div>
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
      <div className="mb-6 p-4 rounded-lg border-l-4" style={{ 
        backgroundColor: `${colors.primary}10`, 
        borderColor: colors.primary 
      }}>
        <div className="flex items-center space-x-3 mb-2">
          <Fish className="w-6 h-6" style={{ color: colors.primary }} />
          <h3 className="font-bold" style={{ color: colors.primary }}>
            {approach.title}
          </h3>
        </div>
        <p className="text-sm" style={{ color: colors.text }}>
          {approach.description}
        </p>
        <p className="text-xs mt-1 text-gray-600">
          Focus: {approach.focus}
        </p>
      </div>
    );
  };

  const renderDashboard = () => {
    const totalStartupCosts = Object.values(formData.financial.startupCosts).reduce((sum, val) => sum + (val || 0), 0);
    const totalMonthlyFixed = Object.values(formData.financial.fixedCosts).reduce((sum, val) => sum + (val || 0), 0);
    const recentWins = formData.winsTracking.dailyWins.slice(0, 3);

    return (
      <div className="space-y-6">
        {/* IBAM Mission Header */}
        <div className="rounded-lg p-6 text-white" style={{ 
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` 
        }}>
          <h1 className="text-2xl font-bold mb-2">Your Faith-Driven Business Plan</h1>
          <p className="text-blue-100 mb-4">
            Create a comprehensive business plan that integrates biblical principles with sound business practices.
          </p>
          
          {/* Three Fish Approach Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {Object.entries(threeFishApproach).map(([key, approach]) => (
              <div key={key} className="p-3 rounded bg-white bg-opacity-20">
                <div className="font-semibold text-sm mb-1">{approach.title}</div>
                <div className="text-xs opacity-90">{approach.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg text-center border" style={{ borderColor: colors.border }}>
            <div className="text-xl font-bold" style={{ color: colors.primary }}>
              ${totalStartupCosts.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Startup Investment</div>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center border" style={{ borderColor: colors.border }}>
            <div className="text-xl font-bold" style={{ color: colors.secondary }}>
              ${totalMonthlyFixed.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Monthly Expenses</div>
          </div>
        </div>

        {/* Recent Wins */}
        <div className="bg-yellow-50 rounded-lg p-4 border" style={{ borderColor: colors.border }}>
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
              Start filling out sections to track your progress! Every step counts.
            </p>
          )}
        </div>

        {/* IBAM Mission Integration */}
        <div className="border rounded-lg p-4" style={{ borderColor: colors.border }}>
          <h3 className="font-bold mb-3" style={{ color: colors.text }}>
            📖 IBAM Mission Integration
          </h3>
          <div className="text-sm space-y-2" style={{ color: colors.text }}>
            <div className="flex justify-between">
              <span>Business Name:</span>
              <span className="font-medium">{formData.businessBasics.businessName || 'Not Set'}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer Validation:</span>
              <span className={`font-medium ${formData.marketResearch.customerValidationEvidence ? 'text-green-600' : 'text-red-600'}`}>
                {formData.marketResearch.customerValidationEvidence ? '✓ Evidence provided' : '✗ Need proof'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Bootstrap Ready:</span>
              <span className={`font-medium ${totalStartupCosts <= formData.financial.bootstrapBudget ? 'text-green-600' : 'text-red-600'}`}>
                {totalStartupCosts <= formData.financial.bootstrapBudget ? '✓ Lean approach' : '✗ Too expensive'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Faith Integration:</span>
              <span className={`font-medium ${formData.faithDrivenPurpose.visionStatement ? 'text-green-600' : 'text-orange-600'}`}>
                {formData.faithDrivenPurpose.visionStatement ? '✓ Purpose defined' : '⚠️ In progress'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFaithDrivenPurpose = () => (
    <div className="space-y-6">
      <ThreeFishHeader fishApproach="equipDiscipleship" />
      
      <div className="bg-blue-50 rounded-lg p-4 border-l-4" style={{ borderColor: colors.primary }}>
        <h3 className="font-bold mb-2" style={{ color: colors.primary }}>
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
          style={{ borderColor: colors.border, focusRingColor: colors.primary }}
          placeholder="What big thing is God calling you to accomplish through this business?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="missionStatement" label="Mission Statement 🎯">
        <textarea
          value={formData.faithDrivenPurpose.missionStatement}
          onChange={(e) => handleInputChange('faithDrivenPurpose', 'missionStatement', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="How will you serve God and love others through this business?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="faithDrivenImpact" label="Faith-Driven Impact 👑">
        <textarea
          value={formData.faithDrivenPurpose.faithDrivenImpact}
          onChange={(e) => handleInputChange('faithDrivenPurpose', 'faithDrivenImpact', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="How will this business help make disciples and serve God's faith-driven purposes?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="discipleshipPlan" label="Discipleship Plan ⚡">
        <textarea
          value={formData.faithDrivenPurpose.discipleshipPlan}
          onChange={(e) => handleInputChange('faithDrivenPurpose', 'discipleshipPlan', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="How will you equip others for discipleship through your business? How will faith-driven impact multiply?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="biblicalFoundation" label="Biblical Foundation 📖">
        <textarea
          value={formData.faithDrivenPurpose.biblicalFoundation}
          onChange={(e) => handleInputChange('faithDrivenPurpose', 'biblicalFoundation', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="What Bible verses will guide your business decisions and practices?"
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
          className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
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
        </select>
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="legalStructure" label="Legal Structure">
        <HoverTooltip content={fieldExplanations.legalStructure}>
          <select
            value={formData.businessBasics.legalStructure}
            onChange={(e) => handleInputChange('businessBasics', 'legalStructure', e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none cursor-help"
            style={{ borderColor: colors.border }}
          >
            <option value="">Select structure</option>
            <HoverTooltip content={fieldExplanations.sole_proprietorship}>
              <option value="sole_proprietorship">Sole Proprietorship</option>
            </HoverTooltip>
            <HoverTooltip content={fieldExplanations.partnership}>
              <option value="partnership">Partnership</option>
            </HoverTooltip>
            <HoverTooltip content={fieldExplanations.llc}>
              <option value="llc">LLC</option>
            </HoverTooltip>
            <HoverTooltip content={fieldExplanations.corporation}>
              <option value="corporation">Corporation</option>
            </HoverTooltip>
            <HoverTooltip content={fieldExplanations.s_corp}>
              <option value="s_corp">S Corporation</option>
            </HoverTooltip>
            <HoverTooltip content={fieldExplanations.nonprofit}>
              <option value="nonprofit">Non-profit</option>
            </HoverTooltip>
          </select>
        </HoverTooltip>
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="businessAddress" label="Business Address">
        <input
          type="text"
          value={formData.businessBasics.businessAddress}
          onChange={(e) => handleInputChange('businessBasics', 'businessAddress', e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="123 Main St, City, State ZIP"
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="description" label="Business Description">
        <textarea
          value={formData.businessBasics.description}
          onChange={(e) => handleInputChange('businessBasics', 'description', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="What does your business do? How does it help customers?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="uniqueValue" label="What Makes You Different?">
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

  const renderMarketResearch = () => (
    <div className="space-y-6">
      <ThreeFishHeader fishApproach="teachFish" />
      <ChallengeQuestions />
      
      {/* Marketing Triangle */}
      <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
        <h3 className="font-bold text-yellow-800 mb-2">📐 Understanding Your Customers and Competition</h3>
        <div className="text-sm text-yellow-700 space-y-1">
          <p><strong>Product:</strong> What exactly are you selling?</p>
          <p><strong>Price:</strong> How much will people pay?</p>
          <p><strong>Promotion:</strong> How will customers find you?</p>
        </div>
      </div>

      <FieldWithTooltip fieldKey="productDefinition" label="🎯 Product Definition (What Are You Selling?)">
        <textarea
          value={formData.marketResearch.productDefinition}
          onChange={(e) => handleInputChange('marketResearch', 'productDefinition', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="Be specific: What do customers get? What problem do you solve?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="customerValidationEvidence" label="🚨 Customer Proof (REQUIRED FOR FUNDING)" required>
        <textarea
          value={formData.marketResearch.customerValidationEvidence}
          onChange={(e) => handleInputChange('marketResearch', 'customerValidationEvidence', e.target.value)}
          className="w-full p-3 border-2 border-red-300 rounded-lg text-sm focus:ring-2 focus:outline-none"
          placeholder="List 3 people you talked to. What did they say? Would they buy? Include names and quotes."
          rows={4}
        />
        {!formData.marketResearch.customerValidationEvidence && (
          <div className="mt-2 p-2 bg-red-50 rounded text-xs text-red-700">
            ❌ NO FUNDING WITHOUT CUSTOMER PROOF: Talk to real potential customers first!
          </div>
        )}
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="targetCustomerProfile" label="👥 Target Customer Profile">
        <textarea
          value={formData.marketResearch.targetCustomerProfile}
          onChange={(e) => handleInputChange('marketResearch', 'targetCustomerProfile', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="Who exactly is your ideal customer? Age, income, location, problems they have."
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="competitorAnalysis" label="🏆 Competition Research">
        <textarea
          value={formData.marketResearch.competitorAnalysis}
          onChange={(e) => handleInputChange('marketResearch', 'competitorAnalysis', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="List 5 competitors: Names, prices, what they do well, what they do poorly"
          rows={4}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="priceStrategy" label="💰 Price Strategy (How Much Will You Charge?)">
        <textarea
          value={formData.marketResearch.priceStrategy}
          onChange={(e) => handleInputChange('marketResearch', 'priceStrategy', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="Your prices vs competitor prices. Why will people pay your price?"
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="promotionPlan" label="📢 Promotion Plan (How Will Customers Find You?)">
        <textarea
          value={formData.marketResearch.promotionPlan}
          onChange={(e) => handleInputChange('marketResearch', 'promotionPlan', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="Social media, word of mouth, advertising, networking - how will you get customers?"
          rows={3}
        />
      </FieldWithTooltip>

      <div className="grid grid-cols-2 gap-4">
        <FieldWithTooltip fieldKey="customerAcquisitionCost" label="Customer Acquisition Cost">
          <input
            type="number"
            value={formData.marketResearch.customerAcquisitionCost}
            onChange={(e) => handleInputChange('marketResearch', 'customerAcquisitionCost', parseFloat(e.target.value) || 0)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
            style={{ borderColor: colors.border }}
            placeholder="$0"
          />
        </FieldWithTooltip>

        <FieldWithTooltip fieldKey="customerLifetimeValue" label="Customer Lifetime Value">
          <input
            type="number"
            value={formData.marketResearch.customerLifetimeValue}
            onChange={(e) => handleInputChange('marketResearch', 'customerLifetimeValue', parseFloat(e.target.value) || 0)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
            style={{ borderColor: colors.border }}
            placeholder="$0"
          />
        </FieldWithTooltip>
      </div>
    </div>
  );

  const renderFinancial = () => {
    const totalStartupCosts = Object.values(formData.financial.startupCosts).reduce((sum, val) => sum + (val || 0), 0);
    const totalFixedCosts = Object.values(formData.financial.fixedCosts).reduce((sum, val) => sum + (val || 0), 0);
    const totalVariableCosts = Object.values(formData.financial.variableCosts).reduce((sum, val) => sum + (val || 0), 0);
    const isOverBudget = totalStartupCosts > formData.financial.bootstrapBudget;
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
          <h3 className="font-bold text-green-800 mb-2">💪 Stewarding Resources and Planning for Growth</h3>
          <FieldWithTooltip fieldKey="bootstrapBudget" label="Bootstrap Budget">
            <input
              type="number"
              value={formData.financial.bootstrapBudget}
              onChange={(e) => handleInputChange('financial', 'bootstrapBudget', parseInt(e.target.value) || 5000)}
              className="w-32 p-2 border rounded focus:ring-2 focus:outline-none"
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
              Total Startup Investment: ${totalStartupCosts.toLocaleString()}
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
            <h4 className="font-semibold mb-3 text-gray-700">Essential Business Costs (Every US Business)</h4>
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
              Total Fixed Costs: ${totalFixedCosts.toLocaleString()}/month
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
            <h4 className="font-semibold mb-3 text-gray-700">Universal Variable Costs</h4>
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
              Total Variable Costs: ${totalVariableCosts.toLocaleString()}/month
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
                  rows={3}
                  placeholder="Describe what you're selling, who it's for, what problems it solves..."
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
                    <span className="ml-2">${(product.price * product.monthlyQuantity).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="font-medium">Profit Margin:</span> 
                    <span className="ml-2">
                      {product.price > 0 ? (((product.price - product.costOfGoods) / product.price * 100).toFixed(1)) : 0}%
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Monthly Profit:</span> 
                    <span className="ml-2">
                      ${((product.price - product.costOfGoods) * product.monthlyQuantity).toLocaleString()}
                    </span>
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

        {/* 36-Month Projections */}
        <div className="bg-white border rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4" style={{ color: colors.primary }}>
            📊 36-Month Financial Projections
          </h3>

          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Projection Summary (First 12 Months)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Total Revenue:</span>
                <div className="text-lg font-bold text-green-600">
                  ${projections.slice(0, 12).reduce((sum, month) => sum + month.projectedRevenue, 0).toLocaleString()}
                </div>
              </div>
              <div>
                <span className="font-medium">Total Expenses:</span>
                <div className="text-lg font-bold text-red-600">
                  ${projections.slice(0, 12).reduce((sum, month) => sum + month.projectedExpenses, 0).toLocaleString()}
                </div>
              </div>
              <div>
                <span className="font-medium">Net Profit:</span>
                <div className="text-lg font-bold text-blue-600">
                  ${projections.slice(0, 12).reduce((sum, month) => sum + month.profit, 0).toLocaleString()}
                </div>
              </div>
              <div>
                <span className="font-medium">Break-even Month:</span>
                <div className="text-lg font-bold text-purple-600">
                  Month {projections.findIndex(month => month.profit > 0) + 1 || 'Not reached'}
                </div>
              </div>
            </div>
          </div>

          {/* Monthly projection table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Month</th>
                  <th className="p-2 text-center">Projected Revenue</th>
                  <th className="p-2 text-center">Actual Revenue</th>
                  <th className="p-2 text-center">Projected Expenses</th>
                  <th className="p-2 text-center">Actual Expenses</th>
                  <th className="p-2 text-center">Projected Profit</th>
                  <th className="p-2 text-center">Variance</th>
                </tr>
              </thead>
              <tbody>
                {projections.slice(0, 12).map((month, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 font-medium">Month {month.month}</td>
                    <td className="p-2 text-center">${month.projectedRevenue.toLocaleString()}</td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        value={month.actualRevenue}
                        onChange={(e) => {
                          const updated = [...formData.financial.monthlyProjections];
                          updated[index] = { ...updated[index], actualRevenue: parseFloat(e.target.value) || 0 };
                          handleInputChange('financial', 'monthlyProjections', updated);
                        }}
                        className="w-20 p-1 text-xs border rounded text-center"
                        placeholder="$0"
                      />
                    </td>
                    <td className="p-2 text-center">${month.projectedExpenses.toLocaleString()}</td>
                    <td className="p-2 text-center">
                      <input
                        type="number"
                        value={month.actualExpenses}
                        onChange={(e) => {
                          const updated = [...formData.financial.monthlyProjections];
                          updated[index] = { ...updated[index], actualExpenses: parseFloat(e.target.value) || 0 };
                          handleInputChange('financial', 'monthlyProjections', updated);
                        }}
                        className="w-20 p-1 text-xs border rounded text-center"
                        placeholder="$0"
                      />
                    </td>
                    <td className={`p-2 text-center font-medium ${month.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${month.profit.toLocaleString()}
                    </td>
                    <td className="p-2 text-center">
                      {month.actualRevenue > 0 || month.actualExpenses > 0 ? (
                        <span className={`text-xs ${
                          (month.actualRevenue - month.actualExpenses) > month.profit ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {(month.actualRevenue - month.actualExpenses) > month.profit ? '↗️ Better' : '↘️ Worse'}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">No data</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Financial Health Dashboard */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold mb-4 text-gray-800">💡 Financial Health Dashboard</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-white rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-green-600">
                ${(totalStartupCosts + (totalFixedCosts * 6)).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Recommended Initial Investment</div>
              <div className="text-xs text-gray-500">Startup + 6 months expenses</div>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-blue-600">
                ${(totalFixedCosts + totalVariableCosts).toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Monthly Break-even</div>
              <div className="text-xs text-gray-500">Revenue needed to break even</div>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-purple-600">
                {projections.length > 0 && projections[0].projectedRevenue > 0 
                  ? Math.ceil((totalFixedCosts + totalVariableCosts) / projections[0].projectedRevenue)
                  : 'N/A'
                }
              </div>
              <div className="text-sm text-gray-600">Months to Break-even</div>
              <div className="text-xs text-gray-500">Based on current projections</div>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow text-center">
              <div className="text-2xl font-bold text-orange-600">
                {totalStartupCosts > 0 && projections.length > 0 
                  ? ((projections.slice(0, 12).reduce((sum, month) => sum + month.profit, 0) / totalStartupCosts) * 100).toFixed(1)
                  : 0
                }%
              </div>
              <div className="text-sm text-gray-600">First Year ROI</div>
              <div className="text-xs text-gray-500">Return on investment</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFaithMetrics = () => (
    <div className="space-y-6">
      <ThreeFishHeader fishApproach="equipDiscipleship" />
      
      <div className="bg-blue-50 rounded-lg p-4 border-l-4" style={{ borderColor: colors.primary }}>
        <h3 className="font-bold mb-2" style={{ color: colors.primary }}>
          📖 How Business and Ministry Work Together
        </h3>
        <p className="text-sm" style={{ color: colors.text }}>
          Track your spiritual growth and ministry impact. These metrics are included in your monthly coach reports.
        </p>
      </div>

      {/* Personal Spiritual Growth */}
      <div className="border rounded-lg p-4">
        <h3 className="font-bold mb-3 text-gray-800">💙 Personal Spiritual Growth</h3>
        
        {Object.entries(formData.faithMetrics.personalGrowth).map(([key, metric]) => (
          <div key={key} className="mb-4 p-3 bg-blue-50 rounded">
            <FieldWithTooltip 
              fieldKey={key} 
              label={
                key === 'dailyPrayer' ? '🙏 Daily Prayer (minutes)' :
                key === 'bibleStudy' ? '📖 Bible Study (times per week)' :
                '🎵 Worship (times per week)'
              }
            >
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Goal</label>
                  <input
                    type="number"
                    value={metric.goal}
                    onChange={(e) => {
                      const newData = { ...formData };
                      newData.faithMetrics.personalGrowth[key].goal = parseInt(e.target.value) || 0;
                      setFormData(newData);
                    }}
                    className="w-full p-2 text-sm border rounded"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">This Month</label>
                  <input
                    type="number"
                    value={metric.actual}
                    onChange={(e) => {
                      const newData = { ...formData };
                      newData.faithMetrics.personalGrowth[key].actual = parseInt(e.target.value) || 0;
                      setFormData(newData);
                      if (parseInt(e.target.value) >= metric.goal && metric.goal > 0) {
                        addWin('faith', `Hit your ${key} goal!`);
                      }
                    }}
                    className="w-full p-2 text-sm border rounded"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-blue-500 transition-all" 
                    style={{ 
                      width: `${metric.goal > 0 ? Math.min((metric.actual / metric.goal) * 100, 100) : 0}%` 
                    }}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {metric.goal > 0 ? `${Math.round((metric.actual / metric.goal) * 100)}% of goal` : 'Set a goal'}
                </div>
              </div>
            </FieldWithTooltip>
          </div>
        ))}
      </div>

      {/* Business Impact */}
      <div className="border rounded-lg p-4">
        <h3 className="font-bold mb-3 text-gray-800">💚 Faith-Driven Business Impact</h3>
        
        {Object.entries(formData.faithMetrics.businessImpact).map(([key, metric]) => (
          <div key={key} className="mb-4 p-3 bg-green-50 rounded">
            <FieldWithTooltip 
              fieldKey={key} 
              label={
                key === 'customerService' ? '🤝 Customer Service Excellence (1-10)' :
                key === 'integrityStandard' ? '✨ Business Integrity (1-10)' :
                key === 'discipleshipOpportunities' ? '🌱 Discipleship Opportunities (count)' :
                '🌍 Community Service (hours/month)'
              }
            >
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div>
                  <label className="block text-xs font-medium mb-1">Goal</label>
                  <input
                    type="number"
                    value={metric.goal}
                    onChange={(e) => {
                      const newData = { ...formData };
                      newData.faithMetrics.businessImpact[key].goal = parseInt(e.target.value) || 0;
                      setFormData(newData);
                    }}
                    className="w-full p-2 text-sm border rounded"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">This Month</label>
                  <input
                    type="number"
                    value={metric.actual}
                    onChange={(e) => {
                      const newData = { ...formData };
                      newData.faithMetrics.businessImpact[key].actual = parseInt(e.target.value) || 0;
                      setFormData(newData);
                      if (parseInt(e.target.value) >= metric.goal && metric.goal > 0) {
                        addWin('faith', `Achieved your ${key} goal!`);
                      }
                    }}
                    className="w-full p-2 text-sm border rounded"
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full bg-green-500 transition-all" 
                    style={{ 
                      width: `${metric.goal > 0 ? Math.min((metric.actual / metric.goal) * 100, 100) : 0}%` 
                    }}
                  />
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {metric.goal > 0 ? `${Math.round((metric.actual / metric.goal) * 100)}% of goal` : 'Set a goal'}
                </div>
              </div>
            </FieldWithTooltip>
          </div>
        ))}
      </div>

      {/* Coach Report Preview */}
      <div className="p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold mb-3 text-gray-800">📋 Monthly Coach Report Preview</h3>
        <div className="text-sm space-y-2">
          <div className="grid grid-cols-3 gap-2 font-medium border-b pb-2">
            <div>Metric</div>
            <div>Goal</div>
            <div>Actual</div>
          </div>
          
          {/* Personal Growth Section */}
          <div className="font-medium text-blue-800 mt-3 mb-1">Personal Growth:</div>
          {Object.entries(formData.faithMetrics.personalGrowth).map(([key, metric]) => (
            <div key={key} className="grid grid-cols-3 gap-2 text-xs">
              <div>
                {key === 'dailyPrayer' && 'Daily Prayer (min)'}
                {key === 'bibleStudy' && 'Bible Study (times/wk)'}
                {key === 'worship' && 'Worship (times/wk)'}
              </div>
              <div>{metric.goal}</div>
              <div className={metric.actual >= metric.goal ? 'text-green-600' : 'text-red-600'}>
                {metric.actual} {metric.actual >= metric.goal ? '✓' : '!'}
              </div>
            </div>
          ))}
          
          {/* Business Impact Section */}
          <div className="font-medium text-green-800 mt-3 mb-1">Business Impact:</div>
          {Object.entries(formData.faithMetrics.businessImpact).map(([key, metric]) => (
            <div key={key} className="grid grid-cols-3 gap-2 text-xs">
              <div>
                {key === 'customerService' && 'Customer Service (1-10)'}
                {key === 'integrityStandard' && 'Integrity (1-10)'}
                {key === 'discipleshipOpportunities' && 'Discipleship (count)'}
                {key === 'communityService' && 'Community Service (hrs)'}
              </div>
              <div>{metric.goal}</div>
              <div className={metric.actual >= metric.goal ? 'text-green-600' : 'text-red-600'}>
                {metric.actual} {metric.actual >= metric.goal ? '✓' : '!'}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-3 p-2 bg-blue-100 rounded text-xs text-blue-800">
          💡 This report will be automatically generated each month for you and your coach to review together.
        </div>
      </div>
    </div>
  );

  const renderWinsTracking = () => (
    <div className="space-y-6">
      <ThreeFishHeader fishApproach="equipDiscipleship" />
      
      <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
        <h3 className="font-bold text-yellow-800 mb-2">🏆 Your Business Building Wins</h3>
        <p className="text-yellow-700 text-sm">
          Every step forward is a win! Track your progress and learn from setbacks.
        </p>
      </div>

      {/* Add Win Button */}
      <div className="text-center">
        <button
          onClick={() => {
            const win = prompt("What did you accomplish today? (e.g., 'Called 2 potential customers', 'Researched competitors', 'Set up business bank account')");
            if (win) {
              addWin('progress', win);
              setShowWinCelebration(true);
              setTimeout(() => setShowWinCelebration(false), 3000);
            }
          }}
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg font-bold hover:bg-yellow-600"
        >
          <Plus className="w-5 h-5 inline mr-2" />
          Add Today's Win!
        </button>
      </div>

      {/* Recent Wins */}
      <div className="border rounded-lg p-4">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-500" />
          Your Recent Wins
        </h3>
        {formData.winsTracking.dailyWins.length > 0 ? (
          <div className="space-y-3">
            {formData.winsTracking.dailyWins.slice(0, 10).map(win => (
              <div key={win.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded">
                <Trophy className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-green-800">{win.description}</div>
                  <div className="text-xs text-green-600">
                    {new Date(win.date).toLocaleDateString()} • {winCategories[win.type] || 'Progress'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Start tracking your wins! Every small step counts.</p>
          </div>
        )}
      </div>

      {/* Lessons Learned Section */}
      <div className="border rounded-lg p-4">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center">
          <Lightbulb className="w-5 h-5 mr-2 text-blue-500" />
          Lessons Learned (From "Failures")
        </h3>
        <div className="space-y-3">
          <button
            onClick={() => {
              const lesson = prompt("What didn't work as expected? What did you learn? (e.g., 'Customers said $50 was too expensive - learned they'll pay $30', 'Facebook ads didn't work - word of mouth is better')");
              if (lesson) {
                const newLesson = {
                  id: Date.now(),
                  description: lesson,
                  date: new Date().toISOString()
                };
                setFormData(prev => ({
                  ...prev,
                  winsTracking: {
                    ...prev.winsTracking,
                    lessonsLearned: [newLesson, ...prev.winsTracking.lessonsLearned.slice(0, 9)]
                  }
                }));
                addWin('learning', 'Learned from a setback');
              }
            }}
            className="w-full p-3 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add a Lesson Learned
          </button>
          
          {formData.winsTracking.lessonsLearned.map(lesson => (
            <div key={lesson.id} className="p-3 bg-blue-50 rounded">
              <div className="font-medium text-blue-800">{lesson.description}</div>
              <div className="text-xs text-blue-600 mt-1">
                {new Date(lesson.date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Encouragement */}
      <div className="bg-green-50 rounded-lg p-4 text-center">
        <Smile className="w-8 h-8 mx-auto mb-2 text-green-600" />
        <h3 className="font-bold text-green-800 mb-2">Remember:</h3>
        <p className="text-green-700 text-sm">
          Every successful business is built one small step at a time. Your "failures" are just expensive education that's making you smarter!
        </p>
      </div>
    </div>
  );

  const currentSectionData = sections[currentSection];

  const renderCurrentSection = () => {
    switch (currentSectionData.id) {
      case 'dashboard': return renderDashboard();
      case 'faithDrivenPurpose': return renderFaithDrivenPurpose();
      case 'businessBasics': return renderBusinessBasics();
      case 'marketResearch': return renderMarketResearch();
      case 'financial': return renderFinancial();
      case 'faithMetrics': return renderFaithMetrics();
      case 'winsTracking': return renderWinsTracking();
      default: return <div>Section coming soon...</div>;
    }
  };

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
      <div className="bg-white shadow-sm border-b" style={{ borderColor: colors.border }}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold" style={{ color: colors.primary }}>
                IBAM Learning Platform
              </h1>
              <p className="text-sm text-gray-600">Empower. Educate. Equip.</p>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>Session Active</span>
              <span>Auto-saving</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Section Navigation */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex space-x-1 overflow-x-auto pb-2">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(index)}
                className={`flex flex-col items-center px-3 py-2 rounded whitespace-nowrap text-xs transition-all ${
                  currentSection === index 
                    ? 'text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={currentSection === index ? { backgroundColor: colors.primary } : {}}
              >
                {section.icon}
                <span className="mt-1">{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm p-6" style={{ borderColor: colors.border }}>
          <div className="flex items-center space-x-2 mb-6">
            {currentSectionData.icon}
            <h2 className="text-xl font-bold" style={{ color: colors.text }}>
              {currentSectionData.title}
            </h2>
          </div>

          {renderCurrentSection()}

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t" style={{ borderColor: colors.border }}>
            <button
              onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
              disabled={currentSection === 0}
              className="flex items-center space-x-1 px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50 hover:bg-gray-600"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-sm text-gray-600">
              {currentSection + 1} of {sections.length}
            </span>

            <button
              onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
              disabled={currentSection === sections.length - 1}
              className="flex items-center space-x-1 px-4 py-2 text-white rounded disabled:opacity-50 hover:opacity-90"
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
          "Commit to the LORD whatever you do, and he will establish your plans."
        </p>
        <p className="text-xs opacity-90 mb-4">- Proverbs 16:3</p>
        
        <div className="flex justify-center space-x-6 text-xs opacity-75">
          <span>© 2024 IBAM</span>
          <span>Empower. Educate. Equip.</span>
          <span>Faith-Driven Entrepreneurship</span>
        </div>
      </div>
    </div>
  );
};

export default IBAMBusinessPlanner;