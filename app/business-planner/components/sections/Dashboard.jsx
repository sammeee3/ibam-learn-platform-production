// components/sections/Dashboard.jsx
// Dashboard overview section component

import React from 'react';
import { Rocket, Brain, Trophy, Star, Flag } from 'lucide-react';
import { colors, threeFishApproach } from '../../config/constants';
import { sections } from '../../config/sectionsConfig';
import { ProgressIndicator } from '../shared/Navigation';
import { formatCurrencyString } from '../shared/FormComponents';

const Dashboard = ({ allFormData, completedSections }) => {
  // Calculate progress
  const calculateProgress = () => {
    const requiredSections = sections.filter(s => s.required);
    const completedRequired = requiredSections.filter(s => completedSections.has(s.id));
    return {
      required: Math.round((completedRequired.length / requiredSections.length) * 100),
      overall: Math.round((completedSections.size / sections.length) * 100)
    };
  };

  const progress = calculateProgress();

  // Calculate key metrics
  const totalStartupCosts = Object.values(allFormData.financial?.startupCosts || {})
    .reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  
  const standardFixedCosts = Object.entries(allFormData.financial?.fixedCosts || {})
    .filter(([key]) => key !== 'custom')
    .reduce((sum, [key, val]) => sum + (parseFloat(val) || 0), 0);
  
  const customFixedCosts = (allFormData.financial?.fixedCosts?.custom || [])
    .reduce((sum, cost) => sum + (parseFloat(cost.amount) || 0), 0);
  
  const totalMonthlyFixed = standardFixedCosts + customFixedCosts;
  const recentWins = allFormData.winsTracking?.dailyWins?.slice(0, 3) || [];

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
      <ProgressIndicator completedSections={completedSections} />

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
      {allFormData.readinessAssessment?.riskTolerance > 0 && (
        <div className="bg-purple-50 rounded-xl p-4 border" style={{ borderColor: colors.border }}>
          <h3 className="font-bold text-purple-800 mb-3 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            Your Readiness Score
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-purple-700">Risk Comfort:</span>
              <div className="font-bold">{allFormData.readinessAssessment.riskTolerance}/10</div>
            </div>
            <div>
              <span className="text-purple-700">Time Available:</span>
              <div className="font-bold">{allFormData.readinessAssessment.timeAvailable} hrs/week</div>
            </div>
            <div>
              <span className="text-purple-700">Family Support:</span>
              <div className="font-bold">{allFormData.readinessAssessment.familySupport}/10</div>
            </div>
            <div>
              <span className="text-purple-700">Financial Cushion:</span>
              <div className="font-bold">{allFormData.readinessAssessment.financialCushion} months</div>
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

export default Dashboard;