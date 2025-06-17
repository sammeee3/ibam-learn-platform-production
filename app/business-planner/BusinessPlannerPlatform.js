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
  const [showPopup, setShowPopup] = useState(null);
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

  // Field explanations in everyday language
  const fieldExplanations = {
    businessName: "This is what customers will call your business. Pick something easy to remember and spell. Think about what sounds trustworthy and professional.",
    industry: "What type of business are you starting? This helps us give you specific advice based on what works in your industry.",
    visionStatement: "What's the big picture God has put on your heart? Where do you see this business in 5-10 years? How will it serve His faith-driven mission?",
    faithDrivenImpact: "How will this business help make disciples and serve God's faith-driven purposes? What eternal impact will it have?",
    customerValidationEvidence: "LOAN OFFICER REQUIREMENT: Show me proof that real people want to buy this. Did you talk to potential customers? What did they say? Would they actually pay for this? Include names and quotes if possible.",
    competitorAnalysis: "Who else is doing what you want to do? Look them up online, call them, check their prices. You need to know your competition to succeed!",
    bootstrapBudget: "How much money can you actually spend without going into debt? Start with what you have in your savings account right now.",
    dailyPrayer: "Set a realistic goal for prayer time each day. Even 5-10 minutes counts if you do it consistently. This keeps God at the center of your business.",
    customerService: "Rate yourself 1-10: How well are you loving your customers? Are you going above and beyond to serve them excellently?",
    priceStrategy: "What will you charge for your product or service? Why will people pay that much? What do your competitors charge?",
    productDefinition: "Explain exactly what you're selling. What does the customer get? What problem does it solve for them?"
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
      customerLifetimeValue: 0
    },
    financial: {
      bootstrapBudget: 5000,
      planningPeriod: 36,
      startupCosts: {
        equipment: 0,
        initialInventory: 0,
        deposits: 0,
        licenses: 0,
        initialMarketing: 0,
        workingCapital: 0
      },
      fixedCosts: {
        businessLicense: 0,
        insurance: 0,
        rent: 0,
        accounting: 0,
        bankFees: 0,
        software: 0,
        ownerSalary: 0
      },
      revenueStreams: []
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

  // Pop-up component that works
  const PopupExplanation = ({ field, onClose }) => {
    if (!field || !showPopup) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-bold text-lg" style={{ color: colors.primary }}>Field Explanation</h3>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded border-l-4" style={{ borderColor: colors.primary }}>
              <p className="text-sm leading-relaxed" style={{ color: colors.text }}>
                {fieldExplanations[field] || "This field helps us understand your business better."}
              </p>
            </div>
            {field === 'customerValidationEvidence' && (
              <div className="p-3 bg-red-50 rounded border-l-4 border-red-500">
                <p className="text-red-800 text-sm font-medium">
                  🚨 LOAN OFFICER REQUIREMENT: No funding without customer proof!
                </p>
              </div>
            )}
          </div>
          <button 
            onClick={onClose}
            className="mt-4 w-full text-white py-2 rounded hover:opacity-90"
            style={{ backgroundColor: colors.primary }}
          >
            Got It!
          </button>
        </div>
      </div>
    );
  };

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

  // Validation with encouragement
  useEffect(() => {
    const currentSectionData = sections[currentSection];
    if (currentSectionData) {
      const questions = generateChallengeQuestions(currentSectionData.id, formData[currentSectionData.id] || {});
      setChallengeQuestions(questions);
    }
  }, [formData, currentSection]);

  // Field with popup button
  const FieldWithPopup = ({ fieldKey, label, children, required = false }) => (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <label className="block text-sm font-bold" style={{ color: colors.text }}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <button
          onClick={() => setShowPopup(fieldKey)}
          className="p-1 rounded-full hover:bg-blue-200"
          style={{ backgroundColor: `${colors.primary}20` }}
        >
          <HelpCircle className="w-4 h-4" style={{ color: colors.primary }} />
        </button>
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

      <FieldWithPopup fieldKey="visionStatement" label="Vision Statement ✨" required>
        <textarea
          value={formData.faithDrivenPurpose.visionStatement}
          onChange={(e) => handleInputChange('faithDrivenPurpose', 'visionStatement', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border, focusRingColor: colors.primary }}
          placeholder="What big thing is God calling you to accomplish through this business?"
          rows={3}
        />
      </FieldWithPopup>

      <FieldWithPopup fieldKey="missionStatement" label="Mission Statement 🎯">
        <textarea
          value={formData.faithDrivenPurpose.missionStatement}
          onChange={(e) => handleInputChange('faithDrivenPurpose', 'missionStatement', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="How will you serve God and love others through this business?"
          rows={3}
        />
      </FieldWithPopup>

      <FieldWithPopup fieldKey="faithDrivenImpact" label="Faith-Driven Impact 👑">
        <textarea
          value={formData.faithDrivenPurpose.faithDrivenImpact}
          onChange={(e) => handleInputChange('faithDrivenPurpose', 'faithDrivenImpact', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="How will this business help make disciples and serve God's faith-driven purposes?"
          rows={3}
        />
      </FieldWithPopup>

      <FieldWithPopup fieldKey="discipleshipPlan" label="Discipleship Plan ⚡">
        <textarea
          value={formData.faithDrivenPurpose.discipleshipPlan}
          onChange={(e) => handleInputChange('faithDrivenPurpose', 'discipleshipPlan', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="How will you equip others for discipleship through your business? How will faith-driven impact multiply?"
          rows={3}
        />
      </FieldWithPopup>

      <FieldWithPopup fieldKey="biblicalFoundation" label="Biblical Foundation 📖">
        <textarea
          value={formData.faithDrivenPurpose.biblicalFoundation}
          onChange={(e) => handleInputChange('faithDrivenPurpose', 'biblicalFoundation', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="What Bible verses will guide your business decisions and practices?"
          rows={3}
        />
      </FieldWithPopup>
    </div>
  );

  const renderBusinessBasics = () => (
    <div className="space-y-6">
      <ThreeFishHeader fishApproach="teachFish" />
      
      <FieldWithPopup fieldKey="businessName" label="Business Name" required>
        <input
          type="text"
          value={formData.businessBasics.businessName}
          onChange={(e) => handleInputChange('businessBasics', 'businessName', e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="What will customers call your business?"
        />
      </FieldWithPopup>

      <FieldWithPopup fieldKey="industry" label="Industry" required>
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
      </FieldWithPopup>

      <FieldWithPopup fieldKey="legalStructure" label="Legal Structure">
        <select
          value={formData.businessBasics.legalStructure}
          onChange={(e) => handleInputChange('businessBasics', 'legalStructure', e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
        >
          <option value="">Select structure</option>
          <option value="sole_proprietorship">Sole Proprietorship</option>
          <option value="partnership">Partnership</option>
          <option value="llc">LLC</option>
          <option value="corporation">Corporation</option>
          <option value="s_corp">S Corporation</option>
          <option value="nonprofit">Non-profit</option>
        </select>
      </FieldWithPopup>

      <FieldWithPopup fieldKey="description" label="Business Description">
        <textarea
          value={formData.businessBasics.description}
          onChange={(e) => handleInputChange('businessBasics', 'description', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="What does your business do? How does it help customers?"
          rows={3}
        />
      </FieldWithPopup>

      <FieldWithPopup fieldKey="uniqueValue" label="What Makes You Different?">
        <textarea
          value={formData.businessBasics.uniqueValue}
          onChange={(e) => handleInputChange('businessBasics', 'uniqueValue', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="Why should customers choose you over everyone else?"
          rows={3}
        />
      </FieldWithPopup>
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

      <FieldWithPopup fieldKey="productDefinition" label="🎯 Product Definition (What Are You Selling?)">
        <textarea
          value={formData.marketResearch.productDefinition}
          onChange={(e) => handleInputChange('marketResearch', 'productDefinition', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="Be specific: What do customers get? What problem do you solve?"
          rows={3}
        />
      </FieldWithPopup>

      <FieldWithPopup fieldKey="customerValidationEvidence" label="🚨 Customer Proof (REQUIRED FOR FUNDING)" required>
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
      </FieldWithPopup>

      <FieldWithPopup fieldKey="competitorAnalysis" label="🏆 Competition Research">
        <textarea
          value={formData.marketResearch.competitorAnalysis}
          onChange={(e) => handleInputChange('marketResearch', 'competitorAnalysis', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="List 5 competitors: Names, prices, what they do well, what they do poorly"
          rows={4}
        />
      </FieldWithPopup>

      <FieldWithPopup fieldKey="priceStrategy" label="💰 Price Strategy (How Much Will You Charge?)">
        <textarea
          value={formData.marketResearch.priceStrategy}
          onChange={(e) => handleInputChange('marketResearch', 'priceStrategy', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="Your prices vs competitor prices. Why will people pay your price?"
          rows={3}
        />
      </FieldWithPopup>

      <FieldWithPopup fieldKey="promotionPlan" label="📢 Promotion Plan (How Will Customers Find You?)">
        <textarea
          value={formData.marketResearch.promotionPlan}
          onChange={(e) => handleInputChange('marketResearch', 'promotionPlan', e.target.value)}
          className="w-full p-3 border rounded-lg text-sm focus:ring-2 focus:outline-none"
          style={{ borderColor: colors.border }}
          placeholder="Social media, word of mouth, advertising, networking - how will you get customers?"
          rows={3}
        />
      </FieldWithPopup>
    </div>
  );

  const renderFinancial = () => {
    const totalStartupCosts = Object.values(formData.financial.startupCosts).reduce((sum, val) => sum + (val || 0), 0);
    const totalFixedCosts = Object.values(formData.financial.fixedCosts).reduce((sum, val) => sum + (val || 0), 0);
    const isOverBudget = totalStartupCosts > formData.financial.bootstrapBudget;

    return (
      <div className="space-y-6">
        <ThreeFishHeader fishApproach="giveFish" />
        <ChallengeQuestions />
        
        {/* Bootstrap Budget */}
        <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
          <h3 className="font-bold text-green-800 mb-2">💪 Stewarding Resources and Planning for Growth</h3>
          <FieldWithPopup fieldKey="bootstrapBudget" label="How much money can you actually spend?">
            <input
              type="number"
              value={formData.financial.bootstrapBudget}
              onChange={(e) => handleInputChange('financial', 'bootstrapBudget', parseInt(e.target.value) || 5000)}
              className="w-32 p-2 border rounded focus:ring-2 focus:outline-none"
              style={{ borderColor: colors.border }}
              placeholder="$5000"
            />
          </FieldWithPopup>
          <p className="text-green-700 text-sm mt-2">
            Goal: Start lean and prove your business works before investing more.
          </p>
        </div>

        {/* Rest of financial sections with IBAM styling... */}
        {/* This would continue with all the financial sections but using IBAM colors and styling */}
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

      {/* Continue with faith metrics using IBAM styling... */}
    </div>
  );

  const renderWinsTracking = () => (
    <div className="space-y-6">
      <ThreeFishHeader fishApproach="equipDiscipleship" />
      
      {/* Continue with wins tracking using IBAM styling... */}
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
      {showPopup && <PopupExplanation field={showPopup} onClose={() => setShowPopup(null)} />}
      {showWinCelebration && (
        <WinCelebration 
          message="You're making real progress on your faith-driven business!"
          onClose={() => setShowWinCelebration(false)}
        />
      )}
      
      {/* IBAM Header Integration - This would integrate with your existing header */}
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