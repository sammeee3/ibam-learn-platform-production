import React, { useState, useEffect } from 'react';
import { FieldWithTooltip } from '../shared/FormComponents';

const MarketOpportunity = ({ formData, handleInputChange, addWin, allFormData }) => {
  const [localData, setLocalData] = useState({
    // Problem & Solution
    problemDescription: '',
    solutionDescription: '',
    targetCustomerProfile: '',
    
    // Market Size
    serviceArea: '',
    populationSize: '',
    targetMarketSize: '',
    marketSizeCalculation: '',
    
    // Competition Analysis
    directCompetitors: '',
    competitorPricing: '',
    competitorWeaknesses: '',
    yourAdvantages: '',
    
    // Market Trends
    marketGrowing: '',
    seasonalFactors: '',
    economicFactors: '',
    
    // Opportunity Validation
    customerDemand: '',
    pricingStrategy: '',
    revenueProjection: '',
    
    ...formData
  });

  const [completionPercentage, setCompletionPercentage] = useState(0);

  const updateField = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    handleInputChange(field, value);
  };

  const calculateCompletion = () => {
    const requiredFields = [
      'problemDescription', 'solutionDescription', 'targetCustomerProfile',
      'serviceArea', 'targetMarketSize', 'competitorPricing', 'yourAdvantages',
      'customerDemand', 'pricingStrategy'
    ];
    
    const completed = requiredFields.filter(field => localData[field]?.trim()).length;
    const percentage = Math.round((completed / requiredFields.length) * 100);
    setCompletionPercentage(percentage);
  };

  useEffect(() => {
    calculateCompletion();
  }, [localData]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">The Opportunity</h1>
              <p className="text-gray-600">Market analysis - Show the bank there's demand for your service</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Progress: {completionPercentage}%</div>
            <div className="text-xs text-green-600">Auto-saving...</div>
          </div>
        </div>
        
        {/* Three Fish Header */}
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex items-center">
            <div className="text-green-600 mr-3">🐠</div>
            <div>
              <h3 className="text-lg font-semibold text-green-800">TEACH TO FISH</h3>
              <p className="text-green-700">Learn to identify real market opportunities that banks want to fund</p>
            </div>
          </div>
        </div>
      </div>

      {/* Problem & Solution Section */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">The Problem You're Solving</h2>
        <p className="text-gray-600 mb-4">Banks want to see you understand a real problem that people will pay to solve</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="problemDescription" label="What problem does your service solve?" required>
            <textarea
              value={localData.problemDescription}
              onChange={(e) => updateField('problemDescription', e.target.value)}
              placeholder="Describe the specific problem your customers face..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="solutionDescription" label="How does your service solve this problem?" required>
            <textarea
              value={localData.solutionDescription}
              onChange={(e) => updateField('solutionDescription', e.target.value)}
              placeholder="Explain how your service solves the problem..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="targetCustomerProfile" label="Who exactly is your ideal customer?" required>
            <textarea
              value={localData.targetCustomerProfile}
              onChange={(e) => updateField('targetCustomerProfile', e.target.value)}
              placeholder="Describe your ideal customer in detail..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Market Size Section */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Your Market Size</h2>
        <p className="text-gray-600 mb-4">Banks need to see there are enough customers to make your business profitable</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="serviceArea" label="What area will you serve?" required>
            <select
              value={localData.serviceArea}
              onChange={(e) => updateField('serviceArea', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select your service area size</option>
              <option value="Just my neighborhood (500-2,000 people)">Just my neighborhood (500-2,000 people)</option>
              <option value="My zip code area (5,000-15,000 people)">My zip code area (5,000-15,000 people)</option>
              <option value="Several zip codes (15,000-50,000 people)">Several zip codes (15,000-50,000 people)</option>
              <option value="My whole city (50,000+ people)">My whole city (50,000+ people)</option>
              <option value="Multiple cities in my area">Multiple cities in my area</option>
            </select>
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="populationSize" label="How many people live in your service area?">
            <input
              type="number"
              value={localData.populationSize}
              onChange={(e) => updateField('populationSize', e.target.value)}
              placeholder="Enter population number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="targetMarketSize" label="How many potential customers are in your area?" required>
            <input
              type="number"
              value={localData.targetMarketSize}
              onChange={(e) => updateField('targetMarketSize', e.target.value)}
              placeholder="Number of potential customers"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="marketSizeCalculation" label="How did you calculate this number?">
            <textarea
              value={localData.marketSizeCalculation}
              onChange={(e) => updateField('marketSizeCalculation', e.target.value)}
              placeholder="Explain how you calculated your market size..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Competition Analysis */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Your Competition</h2>
        <p className="text-gray-600 mb-4">Banks want to see you understand who you're competing against and how you'll win</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="directCompetitors" label="Who are your main competitors?">
            <textarea
              value={localData.directCompetitors}
              onChange={(e) => updateField('directCompetitors', e.target.value)}
              placeholder="List your main competitors and what they offer..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="competitorPricing" label="What do competitors charge?" required>
            <textarea
              value={localData.competitorPricing}
              onChange={(e) => updateField('competitorPricing', e.target.value)}
              placeholder="List competitor prices for similar services..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="competitorWeaknesses" label="What are their weaknesses?">
            <textarea
              value={localData.competitorWeaknesses}
              onChange={(e) => updateField('competitorWeaknesses', e.target.value)}
              placeholder="What do competitors do poorly that you can do better..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="yourAdvantages" label="What's your competitive advantage?" required>
            <textarea
              value={localData.yourAdvantages}
              onChange={(e) => updateField('yourAdvantages', e.target.value)}
              placeholder="Explain why customers will choose you over competitors..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Market Trends */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Market Trends</h2>
        <p className="text-gray-600 mb-4">Show the bank this market is growing and stable</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="marketGrowing" label="Is demand for your service growing or shrinking?">
            <select
              value={localData.marketGrowing}
              onChange={(e) => updateField('marketGrowing', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select market trend</option>
              <option value="Growing rapidly">Growing rapidly</option>
              <option value="Growing steadily">Growing steadily</option>
              <option value="Staying the same">Staying the same</option>
              <option value="Declining slowly">Declining slowly</option>
              <option value="Declining rapidly">Declining rapidly</option>
            </select>
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="seasonalFactors" label="Are there busy and slow seasons?">
            <textarea
              value={localData.seasonalFactors}
              onChange={(e) => updateField('seasonalFactors', e.target.value)}
              placeholder="Describe your busy and slow seasons..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="economicFactors" label="How do economic conditions affect your business?">
            <textarea
              value={localData.economicFactors}
              onChange={(e) => updateField('economicFactors', e.target.value)}
              placeholder="How does the economy affect demand for your service..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Opportunity Summary */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Your Opportunity Summary</h2>
        <p className="text-gray-600 mb-4">Convince the bank this is a real business opportunity</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="customerDemand" label="What evidence shows people want your service?" required>
            <textarea
              value={localData.customerDemand}
              onChange={(e) => updateField('customerDemand', e.target.value)}
              placeholder="Provide evidence that customers want and will pay for your service..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="pricingStrategy" label="What will you charge?" required>
            <textarea
              value={localData.pricingStrategy}
              onChange={(e) => updateField('pricingStrategy', e.target.value)}
              placeholder="Explain your pricing strategy and why customers will pay..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="revenueProjection" label="How much revenue can you realistically make?">
            <textarea
              value={localData.revenueProjection}
              onChange={(e) => updateField('revenueProjection', e.target.value)}
              placeholder="Calculate your realistic monthly/yearly revenue potential..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Biblical Wisdom */}
      <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4">
        <div className="flex items-start">
          <div className="text-blue-600 mr-3 text-lg">💡</div>
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Biblical Business Wisdom</h4>
            <p className="text-blue-700 text-sm">
              "The plans of the diligent lead to profit as surely as haste leads to poverty." - Proverbs 21:5
            </p>
            <p className="text-blue-600 text-sm mt-2">
              Take time to thoroughly understand your market. Banks and customers can tell when you've done your homework!
            </p>
          </div>
        </div>
      </div>

      {/* Completion Status */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-800">Section Progress: {completionPercentage}%</h4>
            <p className="text-sm text-gray-600">
              {completionPercentage === 100 
                ? "Great! This section is complete and ready for loan officers."
                : "Complete all required fields to finish this section."
              }
            </p>
          </div>
          <div className="text-2xl">
            {completionPercentage === 100 ? "✅" : "⏳"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketOpportunity;