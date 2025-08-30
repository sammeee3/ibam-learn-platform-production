// components/BusinessPlannerApp.jsx
// Main orchestrator component for the business planning app

'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { colors, initialFormData, encouragementMessages, celebrationMessages } from '../config/constants';
import { sections } from '../config/sectionsConfig';

// Import navigation components
import { 
  IBAMHeader, 
  MobileSectionNavigation, 
  BottomNavigation, 
  IBAMFooter 
} from './shared/Navigation';

// Import shared UI components
import { 
  Notification, 
  WinCelebration 
} from './shared/FormComponents';
import AutoSave from './shared/AutoSave';

// Import section components
import Dashboard from './sections/Dashboard';
import ReadinessAssessment from './sections/ReadinessAssessment';
import FaithDrivenPurpose from './sections/FaithDrivenPurpose';
import BusinessBasics from './sections/BusinessBasics';
import MarketOpportunity from './sections/MarketOpportunity';
import MarketValidation from './sections/MarketValidation';
import FinancialPlanning from './sections/FinancialPlanning';
import LegalCompliance from './sections/LegalCompliance';
import OperationsPlanning from './sections/OperationsPlanning';
import ImplementationPlan from './sections/ImplementationPlan';
import RiskManagement from './sections/RiskManagement';
import KPIDashboard from './sections/KPIDashboard';
import ScalingFramework from './sections/ScalingFramework';
import FaithMetrics from './sections/FaithMetrics';
import WinsTracking from './sections/WinsTracking';
import CoachingReviews from './sections/CoachingReviews';

const BusinessPlannerApp = () => {
  const supabase = createClientComponentClient();
  
  // Core state management
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [completedSections, setCompletedSections] = useState(new Set());
  
  // UI state
  const [notifications, setNotifications] = useState([]);
  const [challengeQuestions, setChallengeQuestions] = useState([]);
  const [showWinCelebration, setShowWinCelebration] = useState(false);
  
  // User and membership state
  const [user, setUser] = useState(null);
  const [membershipLevel, setMembershipLevel] = useState('trial');
  
  // Initialize user and membership
  useEffect(() => {
    const getUserData = async () => {
      // Use custom auth system
      const userEmail = typeof window !== 'undefined' ? localStorage.getItem('ibam-auth-email') : null;
      if (!userEmail) return;
      
      const profileResponse = await fetch(`/api/user/profile?email=${encodeURIComponent(userEmail)}`);
      const profile = await profileResponse.json();
      if (!profile.auth_user_id) return;
      
      setUser({ id: profile.auth_user_id, email: userEmail });
      setMembershipLevel(profile.membership_level || 'trial');
    };
    
    getUserData();
  }, []);

  // Get current section data
  const currentSectionData = sections[currentSection];

  // Notification system
  const addNotification = (type, message) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 4000);
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

  // Generate challenge questions for validation
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

  // Validation with encouragement
  useEffect(() => {
    const currentSectionData = sections[currentSection];
    if (currentSectionData) {
      const questions = generateChallengeQuestions(currentSectionData.id, formData[currentSectionData.id] || {});
      setChallengeQuestions(questions);
    }
  }, [formData, currentSection]);

  // Notification banner
  const NotificationBanner = () => (
    <div className="fixed top-4 right-4 space-y-2 z-40">
      {notifications.slice(0, 2).map(notification => (
        <Notification 
          key={notification.id} 
          notification={notification} 
          onClose={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
        />
      ))}
    </div>
  );

  // Main render function to determine which section to show
  const renderCurrentSection = () => {
    const sectionProps = {
      formData: formData[currentSectionData.id] || {},
      handleInputChange: (field, value, subfield) => handleInputChange(currentSectionData.id, field, value, subfield),
      challengeQuestions,
      addWin,
      allFormData: formData // Pass all form data for sections that need cross-section data
    };

    switch (currentSectionData.id) {
      case 'dashboard':
        return <Dashboard {...sectionProps} completedSections={completedSections} />;
      case 'readinessAssessment':
        return <ReadinessAssessment {...sectionProps} />;
      case 'faithDrivenPurpose':
        return <FaithDrivenPurpose {...sectionProps} />;
      case 'businessBasics':
        return <BusinessBasics {...sectionProps} />;
      case 'marketOpportunity':
        return <MarketOpportunity {...sectionProps} />;
      case 'marketValidation':
        return <MarketValidation {...sectionProps} />;
      case 'financial':
        return <FinancialPlanning {...sectionProps} />;
      case 'legalCompliance':
        return <LegalCompliance {...sectionProps} />;
      case 'operationsPlanning':
        return <OperationsPlanning {...sectionProps} />;
      case 'implementationPlan':
        return <ImplementationPlan {...sectionProps} />;
      case 'riskManagement':
        return <RiskManagement {...sectionProps} />;
      case 'kpiDashboard':
        return <KPIDashboard {...sectionProps} />;
      case 'scalingFramework':
        return <ScalingFramework {...sectionProps} />;
      case 'faithMetrics':
        return <FaithMetrics {...sectionProps} />;
      case 'winsTracking':
        return <WinsTracking {...sectionProps} />;
      case 'coachingReviews':
        return <CoachingReviews {...sectionProps} />;
      default:
        return (
          <div className="space-y-6">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🚧</div>
              <h3 className="text-xl font-bold mb-2">{currentSectionData.title} Section Under Construction</h3>
              <p className="text-gray-600">This section is being built. Check back soon!</p>
            </div>
          </div>
        );
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
      
      {/* IBAM Header */}
      <IBAMHeader completedSections={completedSections} />

      {/* Mobile Section Navigation */}
      <MobileSectionNavigation 
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        completedSections={completedSections}
      />

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
      <BottomNavigation 
        currentSection={currentSection}
        setCurrentSection={setCurrentSection}
        completedSections={completedSections}
      />

      {/* Auto-Save Component */}
      <AutoSave 
        formData={formData}
        membershipLevel={membershipLevel}
        onSave={(saveResult) => {
          if (saveResult.success) {
            addNotification('success', `Plan saved ${saveResult.method === 'cloud' ? 'to cloud' : 'locally'}!`);
          } else {
            addNotification('error', 'Save failed - please try again');
          }
        }}
      />

      {/* IBAM Footer */}
      <IBAMFooter />

      {/* CSS for animations */}
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

export default BusinessPlannerApp;