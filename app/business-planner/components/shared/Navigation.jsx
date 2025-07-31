// components/shared/Navigation.jsx
// Navigation, progress tracking, and mobile navigation components

import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, Fish, BookOpen } from 'lucide-react';
import { colors, threeFishApproach } from '../../config/constants';
import { sections } from '../../config/sectionsConfig';

// Progress indicator component
export const ProgressIndicator = ({ completedSections }) => {
  const calculateProgress = () => {
    const requiredSections = sections.filter(s => s.required);
    const completedRequired = requiredSections.filter(s => completedSections.has(s.id));
    return {
      required: Math.round((completedRequired.length / requiredSections.length) * 100),
      overall: Math.round((completedSections.size / sections.length) * 100)
    };
  };

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

// Three Fish Section Header
export const ThreeFishHeader = ({ fishApproach }) => {
  if (fishApproach === 'overview') return null;
  
  const approach = threeFishApproach[fishApproach];
  if (!approach) return null;
  
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

// Mobile Section Navigation
export const MobileSectionNavigation = ({ currentSection, setCurrentSection, completedSections }) => {
  return (
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
  );
};

// Bottom Navigation
export const BottomNavigation = ({ currentSection, setCurrentSection, completedSections }) => {
  const calculateProgress = () => {
    const requiredSections = sections.filter(s => s.required);
    const completedRequired = requiredSections.filter(s => completedSections.has(s.id));
    return Math.round((completedRequired.length / requiredSections.length) * 100);
  };

  return (
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
              {calculateProgress()}% Complete
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
  );
};

// IBAM Header
export const IBAMHeader = ({ completedSections }) => {
  const calculateProgress = () => {
    const requiredSections = sections.filter(s => s.required);
    const completedRequired = requiredSections.filter(s => completedSections.has(s.id));
    return Math.round((completedRequired.length / requiredSections.length) * 100);
  };

  return (
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
            <div>Progress: {calculateProgress()}%</div>
            <div>Auto-saving ✓</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// IBAM Footer
export const IBAMFooter = () => {
  return (
    <div className="mt-8 p-6 text-center text-white" style={{ 
      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` 
    }}>
      <BookOpen className="w-6 h-6 mx-auto mb-2 opacity-90" />
      <p className="text-sm font-medium italic mb-2">
        "For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, to give you hope and a future."
      </p>
      <p className="text-xs opacity-90 mb-4">- Jeremiah 29:11</p>
      
      <div className="flex justify-center space-x-6 text-xs opacity-75">
        <span>© 2025 IBAM</span>
        <span>Empower. Educate. Equip.</span>
        <span>Faith-Driven Entrepreneurship</span>
      </div>
    </div>
  );
};