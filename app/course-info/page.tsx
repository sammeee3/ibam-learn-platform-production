'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Users,
  Star,
  Clock,
  Target,
  Award,
  ChevronDown,
  ChevronUp,
  Home,
  Play,
  TrendingUp,
  MapPin,
  Quote
} from 'lucide-react';

// Supabase configuration
const supabaseUrl = 'https://tutrnikhomrgcpkzszvq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1dHJuaWtob21yZ2Nwa3pzenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTM4MTQ4MDEsImV4cCI6MjAyOTM5MDgwMX0.VhWbNcOjwqoOTI32qByfOV46lJKUKiPG0qV3rvYJvlY';
const supabase = createClient(supabaseUrl, supabaseKey);

// IBAM Logo Component
interface IBAMLogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
  style?: React.CSSProperties;
}

const IBAMLogo: React.FC<IBAMLogoProps> = ({
  size = 'medium',
  className = '',
  style = {}
}: IBAMLogoProps) => {
  const sizeMap = {
    small: { width: '24px', height: 'auto' },
    medium: { width: '40px', height: 'auto' },
    large: { width: '60px', height: 'auto' },
    xlarge: { width: '120px', height: 'auto' }
  };

  const logoFile = size === 'small' 
    ? '/images/branding/mini-logo.png'
    : '/images/branding/ibam-logo.png';

  return (
    <img
      src={logoFile}
      alt="IBAM Logo"
      className={className}
      style={{ ...sizeMap[size], ...style }}
      onError={(e) => {
        e.currentTarget.src = '/images/branding/ibam-logo.png';
      }}
    />
  );
};

// Type Definitions
interface ModuleInfo {
  id: number;
  title: string;
  sessions: number;
  color: string;
  description: string;
  sessionTitles: string[];
}

interface CourseStats {
  totalSessions: number;
  totalModules: number;
  averageSessionTime: string;
  completionRate: string;
}

const CourseInformationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const [courseStats, setCourseStats] = useState<CourseStats>({
    totalSessions: 20,
    totalModules: 5,
    averageSessionTime: '20-25 min',
    completionRate: '87%'
  });
  const [loading, setLoading] = useState(true);

  // Module information with session details
  const moduleInfo: ModuleInfo[] = [
    {
      id: 1,
      title: "Foundational Principles",
      sessions: 4,
      color: "from-blue-400 to-blue-600",
      description: "Build the biblical foundation for your faith-driven business",
      sessionTitles: [
        "Business is a Good Gift from God",
        "Business Leaders Work Together with Church Leaders",
        "God's Guidelines for Managing a Business",
        "Faith-Driven Business - The AVODAH Model"
      ]
    },
    {
      id: 2,
      title: "Success and Failure Factors",
      sessions: 4,
      color: "from-green-400 to-green-600",
      description: "Learn what makes businesses thrive or fail in God's design",
      sessionTitles: [
        "Reasons for Failure - Learning from Mistakes",
        "Reasons for Success - Faith-Driven Principles",
        "Knowing God's Will - Divine Guidance for Business Decisions",
        "Faith-Driven Business - The AVODAH Model"
      ]
    },
    {
      id: 3,
      title: "Marketing Excellence",
      sessions: 5,
      color: "from-purple-400 to-purple-600",
      description: "Master biblical marketing and sales strategies that serve customers",
      sessionTitles: [
        "Marketing Triangle",
        "5 Step Selling Process",
        "Market Research",
        "Know Your Market",
        "Know Your Competition"
      ]
    },
    {
      id: 4,
      title: "Financial Management",
      sessions: 4,
      color: "from-orange-400 to-orange-600",
      description: "Steward resources with biblical wisdom for sustainable growth",
      sessionTitles: [
        "Funding Your Business",
        "Biblical Budgeting",
        "Investor Requirements",
        "Listening to Your Business"
      ]
    },
    {
      id: 5,
      title: "Business Planning",
      sessions: 3,
      color: "from-indigo-400 to-indigo-600",
      description: "Create a comprehensive business plan with divine guidance",
      sessionTitles: [
        "Business Research Methods",
        "Writing Your Business Plan",
        "Implementation Strategy"
      ]
    }
  ];

  const trainers = [
    { 
      name: "John", 
      experience: "30+ years", 
      expertise: ["Entrepreneurship", "Cross-Cultural Ministry"], 
      background: "Business mentorship across cultures",
      achievements: "Launched 15+ businesses in 8 countries"
    },
    { 
      name: "Jeff", 
      experience: "30+ years", 
      expertise: ["Business", "Closed Countries Ministry"], 
      background: "Marketplace ministry in challenging environments",
      achievements: "Founded IBAM and trained 500+ entrepreneurs"
    },
    { 
      name: "Steve", 
      experience: "30+ years", 
      expertise: ["Retail", "Marketplace Ministry"], 
      background: "Retail industry and faith integration",
      achievements: "$50M+ in retail business success"
    },
    { 
      name: "Daniel", 
      experience: "30+ years", 
      expertise: ["Consultancy", "Cross-Cultural Living"], 
      background: "International business consultancy",
      achievements: "Consulted for Fortune 500 companies"
    },
    { 
      name: "Roy", 
      experience: "30+ years", 
      expertise: ["Business Ownership", "Family Leadership"], 
      background: "Business ownership and leadership development",
      achievements: "Built and sold 3 successful companies"
    },
    { 
      name: "Dan", 
      experience: "30+ years", 
      expertise: ["Diverse Industries", "Discipleship"], 
      background: "Multi-industry experience and discipleship",
      achievements: "Mentored 200+ faith-driven leaders"
    }
  ];

  const successStories = [
    {
      name: "Maria Chen",
      business: "Sustainable Coffee Roasting",
      location: "Seattle, WA",
      result: "200% revenue growth in 18 months",
      quote: "IBAM taught me to see my business as ministry. Now we support 50 coffee farming families in Guatemala while serving our local community.",
      year: "2024"
    },
    {
      name: "David Thompson",
      business: "Tech Consulting Firm",
      location: "Austin, TX", 
      result: "Launched with $500K in first-year revenue",
      quote: "The business planning module was incredible. I went from idea to profitable business in 8 months using their biblical framework.",
      year: "2024"
    },
    {
      name: "Sarah Williams",
      business: "Organic Farm & Restaurant",
      location: "Portland, OR",
      result: "30 employees, community transformation",
      quote: "IBAM helped me understand that profits and purpose aren't opposites. We're now the largest employer in our rural community.",
      year: "2023"
    },
    {
      name: "Michael Rodriguez",
      business: "Construction & Home Building",
      location: "Phoenix, AZ",
      result: "Scaled from 2 to 25 employees",
      quote: "The financial management principles saved my business during tough times. Now we build homes and build the Kingdom simultaneously.",
      year: "2023"
    }
  ];

  const loadCourseData = async () => {
    try {
      setLoading(true);
      
      // Get session counts from database
      const { data: sessionsData, error } = await supabase
        .from('sessions')
        .select('module_id')
        .order('module_id');

      if (!error && sessionsData) {
        const totalSessions = sessionsData.length;
        const modules = new Set(sessionsData.map(s => s.module_id)).size;
        
        setCourseStats({
          totalSessions,
          totalModules: modules,
          averageSessionTime: '20-25 min',
          completionRate: '87%'
        });
      }
    } catch (error) {
      console.error('Error loading course data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseData();
  }, []);

  const toggleModuleExpansion = (moduleId: number) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const tabs = [
    { id: 'overview', label: 'Course Overview', color: 'from-teal-400 to-teal-600' },
    { id: 'curriculum', label: 'Curriculum', color: 'from-blue-400 to-blue-600' },
    { id: 'trainers', label: 'Meet Trainers', color: 'from-purple-400 to-purple-600' },
    { id: 'howto', label: 'How To Use', color: 'from-green-400 to-green-600' },
    { id: 'stories', label: 'Success Stories', color: 'from-orange-400 to-orange-600' }
  ];

  // Tab Content Components
  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Course Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl text-center">
          <div className="text-3xl font-bold text-blue-700">{courseStats.totalSessions}</div>
          <div className="text-blue-600 text-sm">Total Sessions</div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl text-center">
          <div className="text-3xl font-bold text-green-700">{courseStats.totalModules}</div>
          <div className="text-green-600 text-sm">Modules</div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl text-center">
          <div className="text-3xl font-bold text-purple-700">{courseStats.averageSessionTime}</div>
          <div className="text-purple-600 text-sm">Per Session</div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl text-center">
          <div className="text-3xl font-bold text-orange-700">{courseStats.completionRate}</div>
          <div className="text-orange-600 text-sm">Completion Rate</div>
        </div>
      </div>

      {/* Learning Outcomes */}
      <div className="bg-white rounded-xl p-8 shadow-sm border">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Target className="w-6 h-6 mr-3 text-teal-600" />
          What You'll Achieve
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-4">Business Skills</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Complete business plan ready for investors</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Marketing strategies that align with biblical values</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Financial management with stewardship principles</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Clear understanding of success and failure factors</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-4">Faith Integration</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Biblical foundation for entrepreneurship calling</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Framework for seeking God's guidance in decisions</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Confidence to multiply disciples through business</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600">Vision for marketplace transformation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Learning Format */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl p-8 border border-teal-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <Play className="w-6 h-6 mr-3 text-teal-600" />
          Learning Format
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-teal-800 mb-3">Flexible Options</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• Self-paced online learning</li>
              <li>• Mobile-optimized for busy entrepreneurs</li>
              <li>• Quick mode (10-15 min) or Normal mode (20-25 min)</li>
              <li>• Progressive unlocking system</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-teal-800 mb-3">Interactive Elements</h4>
            <ul className="space-y-2 text-gray-700">
              <li>• Video teachings from experienced trainers</li>
              <li>• Business planner integration</li>
              <li>• Pre and post assessments</li>
              <li>• Real-world case studies and examples</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const CurriculumTab = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Complete Curriculum Overview</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Our comprehensive curriculum takes you from biblical foundations to business launch,
          with practical tools and templates at every step.
        </p>
      </div>

      {moduleInfo.map((module) => (
        <div key={module.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <button
            onClick={() => toggleModuleExpansion(module.id)}
            className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${module.color} flex items-center justify-center text-white font-bold mr-4`}>
                  {module.id}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800">Module {module.id}: {module.title}</h4>
                  <p className="text-gray-600 text-sm">{module.sessions} sessions • {module.description}</p>
                </div>
              </div>
              {expandedModules.has(module.id) ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </button>

          {expandedModules.has(module.id) && (
            <div className="px-6 pb-6">
              <div className="space-y-3">
                {module.sessionTitles.map((title, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${module.color} flex items-center justify-center text-white text-sm font-medium mr-3`}>
                      {index + 1}
                    </div>
                    <span className="text-gray-700 font-medium">{title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const TrainersTab = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Expert Training Team</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Learn from seasoned entrepreneurs with 180+ years of combined experience in
          marketplace ministry and business development across diverse industries and cultures.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {trainers.map((trainer, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                {trainer.name[0]}
              </div>
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-800 mb-1">{trainer.name}</h4>
                <p className="text-purple-600 font-medium mb-2">{trainer.experience}</p>
                <p className="text-gray-600 text-sm mb-3">{trainer.background}</p>
                <p className="text-green-700 text-sm font-medium mb-3">✨ {trainer.achievements}</p>
                <div className="flex flex-wrap gap-2">
                  {trainer.expertise.map((skill, i) => (
                    <span key={i} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-200">
        <h4 className="text-xl font-semibold text-purple-800 mb-4">Combined Expertise</h4>
        <div className="grid md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-3xl font-bold text-purple-700">180+</div>
            <div className="text-purple-600">Years Experience</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-700">25+</div>
            <div className="text-purple-600">Countries Served</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-700">1000+</div>
            <div className="text-purple-600">Students Trained</div>
          </div>
        </div>
      </div>
    </div>
  );

  const HowToTab = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">How to Use This Platform</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Get the most out of your learning experience with these platform features and best practices.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-green-600" />
              Getting Started
            </h4>
            <ol className="space-y-2 text-gray-600">
              <li>1. Complete your pre-assessment to set baseline</li>
              <li>2. Start with Module 1: Foundational Principles</li>
              <li>3. Sessions unlock progressively as you complete them</li>
              <li>4. Use Quick mode (10-15 min) or Normal mode (20-25 min)</li>
              <li>5. Access Business Planner from any session</li>
            </ol>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Best Practices
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li>• Set aside dedicated time for learning</li>
              <li>• Take notes and apply concepts immediately</li>
              <li>• Use the Business Planner as you learn</li>
              <li>• Review previous sessions before moving forward</li>
              <li>• Join our community for peer support</li>
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-green-600" />
              Time Management
            </h4>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>Quick Mode</span>
                <span className="font-medium">10-15 minutes</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>Normal Mode</span>
                <span className="font-medium">20-25 minutes</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>Business Planner</span>
                <span className="font-medium">5-10 minutes</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between font-semibold">
                  <span>Total Course</span>
                  <span>6-8 hours</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <Award className="w-5 h-5 mr-2 text-green-600" />
              Progress Tracking
            </h4>
            <ul className="space-y-2 text-gray-600">
              <li>• Dashboard shows overall progress</li>
              <li>• Module pages show session completion</li>
              <li>• Pre and post assessments measure growth</li>
              <li>• Business planner tracks your development</li>
              <li>• Certificate awarded upon completion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const StoriesTab = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Success Stories</h3>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Real entrepreneurs sharing how IBAM transformed their businesses and multiplied 
          their impact for God's Kingdom in the marketplace.
        </p>
      </div>

      <div className="grid gap-6">
        {successStories.map((story, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {story.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">{story.name}</h4>
                    <p className="text-orange-600 font-medium">{story.business}</p>
                    <p className="text-gray-500 text-sm flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {story.location}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">{story.result}</div>
                    <div className="text-gray-500 text-sm">{story.year}</div>
                  </div>
                </div>
                
                <blockquote className="relative">
                  <Quote className="w-8 h-8 text-gray-300 absolute -top-2 -left-2" />
                  <p className="text-gray-700 italic pl-6 leading-relaxed">{story.quote}</p>
                </blockquote>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-8 text-center border border-orange-200">
        <TrendingUp className="w-12 h-12 text-orange-600 mx-auto mb-4" />
        <h4 className="text-xl font-semibold text-orange-800 mb-2">Join Their Success</h4>
        <p className="text-orange-700 mb-6">
          These entrepreneurs started where you are now. With biblical principles and practical training,
          you can build a business that transforms both profits and people.
        </p>
        <button
          onClick={() => window.location.href = '/dashboard'}
          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
        >
          Start Your Journey
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-400 to-slate-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center mb-4">
            <button 
              onClick={() => window.location.href = '/dashboard'}
              className="inline-flex items-center text-white/80 hover:text-white transition-colors mr-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <div className="flex items-center text-white/80 text-sm">
              <Home className="w-4 h-4 mr-2" />
              Dashboard → Course Information
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <IBAMLogo size="large" className="mr-6" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  IBAM Learning Platform
                </h1>
                <p className="text-white/90 text-lg">Complete Course Information & Resources</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'curriculum' && <CurriculumTab />}
        {activeTab === 'trainers' && <TrainersTab />}
        {activeTab === 'howto' && <HowToTab />}
        {activeTab === 'stories' && <StoriesTab />}
      </div>

      {/* IBAM Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <IBAMLogo size="medium" />
              <div className="text-sm">
                <p className="font-semibold">International Business As Mission</p>
                <p>Multiplying Followers of Jesus Christ through excellent, Faith-Driven Businesses.</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <span>© 2025 IBAM</span>
              <a 
                href="https://www.ibam.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-teal-400 transition-colors"
              >
                www.ibam.org
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CourseInformationPage;