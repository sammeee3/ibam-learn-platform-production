// config/sectionsConfig.js
// All section definitions and navigation configuration

import React from 'react';
import { 
  BarChart3, 
  Brain, 
  Heart, 
  Building, 
  Target, 
  Search, 
  Shield, 
  Settings, 
  DollarSign, 
  Rocket, 
  AlertCircle, 
  Activity, 
  TrendingUp, 
  BookOpen, 
  Trophy, 
  Users 
} from 'lucide-react';

export const sections = [
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
    subtitle: 'Faith-Driven purpose',
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