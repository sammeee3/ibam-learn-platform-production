import React, { useState, useEffect } from 'react';
import { FieldWithTooltip } from '../shared/FormComponents';

const MarketValidation = ({ formData, handleInputChange, addWin, allFormData }) => {
  const [localData, setLocalData] = useState({
    // Customer Validation
    customerInterviews: '',
    customerFeedback: '',
    preOrders: '',
    testCustomers: '',
    
    // Market Research
    surveyResults: '',
    onlineResearch: '',
    
    // Proof of Concept
    pilotTestResults: '',
    successStories: '',
    
    // Competitive Analysis
    competitorSuccess: '',
    uniqueValue: '',
    
    // Financial Validation
    pricingTests: '',
    revenueProof: '',
    
    // Social Proof
    testimonials: '',
    referrals: '',
    
    // Risk Mitigation
    marketRisks: '',
    contingencyPlans: '',
    
    ...formData
  });

  const [completionPercentage, setCompletionPercentage] = useState(0);

  const updateField = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    handleInputChange(field, value);
  };

  const calculateCompletion = () => {
    const requiredFields = [
      'customerInterviews', 'surveyResults', 'pilotTestResults', 
      'competitorSuccess', 'pricingTests', 'testimonials',
      'marketRisks', 'contingencyPlans'
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
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Prove It Works</h1>
              <p className="text-gray-600">Customer validation - Show the bank people actually want this</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Progress: {completionPercentage}%</div>
            <div className="text-xs text-green-600">Auto-saving...</div>
          </div>
        </div>
        
        {/* Three Fish Header */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
          <div className="flex items-center">
            <div className="text-blue-600 mr-3">🐠</div>
            <div>
              <h3 className="text-lg font-semibold text-blue-800">TEACH TO FISH</h3>
              <p className="text-blue-700">Learn to validate your business idea with real customer proof</p>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Validation Section */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Real Customer Feedback</h2>
        <p className="text-gray-600 mb-4">Banks want proof that actual customers want and will pay for your service</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="customerInterviews" label="How many potential customers have you talked to?" required>
            <textarea
              value={localData.customerInterviews}
              onChange={(e) => updateField('customerInterviews', e.target.value)}
              placeholder="Describe who you talked to and what they said about your service idea..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="customerFeedback" label="What did customers say about your idea?">
            <textarea
              value={localData.customerFeedback}
              onChange={(e) => updateField('customerFeedback', e.target.value)}
              placeholder="Summarize customer feedback - both positive and concerns..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="preOrders" label="Have any customers committed to hiring you?">
            <textarea
              value={localData.preOrders}
              onChange={(e) => updateField('preOrders', e.target.value)}
              placeholder="List any customer commitments, pre-orders, or strong interest..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="testCustomers" label="Have you done any test services?">
            <textarea
              value={localData.testCustomers}
              onChange={(e) => updateField('testCustomers', e.target.value)}
              placeholder="Describe any test services you've provided and the results..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Market Research Section */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Market Research Evidence</h2>
        <p className="text-gray-600 mb-4">Show you've researched beyond just talking to friends and family</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="surveyResults" label="What surveys or polls have you done?" required>
            <textarea
              value={localData.surveyResults}
              onChange={(e) => updateField('surveyResults', e.target.value)}
              placeholder="Describe your survey method and key findings..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="onlineResearch" label="What online research have you done?">
            <textarea
              value={localData.onlineResearch}
              onChange={(e) => updateField('onlineResearch', e.target.value)}
              placeholder="Describe your online research and findings..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Proof of Concept */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Proof of Concept</h2>
        <p className="text-gray-600 mb-4">Evidence that your business model actually works in practice</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="pilotTestResults" label="Results from your pilot test or trial run" required>
            <textarea
              value={localData.pilotTestResults}
              onChange={(e) => updateField('pilotTestResults', e.target.value)}
              placeholder="Describe your pilot test results and lessons learned..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="successStories" label="Success stories and case studies">
            <textarea
              value={localData.successStories}
              onChange={(e) => updateField('successStories', e.target.value)}
              placeholder="Share specific success stories from your service..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Competitive Validation */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Competitive Validation</h2>
        <p className="text-gray-600 mb-4">Proof that similar businesses succeed in your market</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="competitorSuccess" label="Evidence that competitors are successful" required>
            <textarea
              value={localData.competitorSuccess}
              onChange={(e) => updateField('competitorSuccess', e.target.value)}
              placeholder="Describe evidence that competitors are successful..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="uniqueValue" label="Your unique value proposition">
            <textarea
              value={localData.uniqueValue}
              onChange={(e) => updateField('uniqueValue', e.target.value)}
              placeholder="Explain what makes your service unique and valuable..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Financial Validation */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Financial Validation</h2>
        <p className="text-gray-600 mb-4">Proof that your pricing and business model make financial sense</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="pricingTests" label="How have you tested your pricing?" required>
            <textarea
              value={localData.pricingTests}
              onChange={(e) => updateField('pricingTests', e.target.value)}
              placeholder="Describe how you've validated your pricing strategy..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="revenueProof" label="Any early revenue or income proof?">
            <textarea
              value={localData.revenueProof}
              onChange={(e) => updateField('revenueProof', e.target.value)}
              placeholder="Describe any money you've already made from your service..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Social Proof */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Social Proof</h2>
        <p className="text-gray-600 mb-4">Evidence that others believe in your business</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="testimonials" label="Customer testimonials and reviews" required>
            <textarea
              value={localData.testimonials}
              onChange={(e) => updateField('testimonials', e.target.value)}
              placeholder="Paste actual customer testimonials and feedback..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="referrals" label="Referrals and word-of-mouth">
            <textarea
              value={localData.referrals}
              onChange={(e) => updateField('referrals', e.target.value)}
              placeholder="Describe any referrals or word-of-mouth interest..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Risk Management */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Risk Assessment</h2>
        <p className="text-gray-600 mb-4">Show banks you've thought about what could go wrong and how you'll handle it</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="marketRisks" label="What are the biggest risks to your business?" required>
            <textarea
              value={localData.marketRisks}
              onChange={(e) => updateField('marketRisks', e.target.value)}
              placeholder="List the main risks that could hurt your business..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="contingencyPlans" label="How will you handle these risks?" required>
            <textarea
              value={localData.contingencyPlans}
              onChange={(e) => updateField('contingencyPlans', e.target.value)}
              placeholder="Describe your backup plans for each major risk..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Biblical Wisdom */}
      <div className="mt-8 bg-green-50 border-l-4 border-green-400 p-4">
        <div className="flex items-start">
          <div className="text-green-600 mr-3 text-lg">💡</div>
          <div>
            <h4 className="font-semibold text-green-800 mb-2">Biblical Business Wisdom</h4>
            <p className="text-green-700 text-sm">
              "Suppose one of you wants to build a tower. Won't you first sit down and estimate the cost to see if you have enough money to complete it?" - Luke 14:28
            </p>
            <p className="text-green-600 text-sm mt-2">
              Jesus taught about counting the cost before starting. Validating your business idea is biblical wisdom!
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
                ? "Excellent! You have strong validation evidence for loan officers."
                : "Complete more validation activities to strengthen your business case."
              }
            </p>
          </div>
          <div className="text-2xl">
            {completionPercentage === 100 ? "✅" : "⏳"}
          </div>
        </div>
        
        {completionPercentage < 100 && (
          <div className="mt-3 text-sm text-gray-600">
            <p><strong>Quick validation ideas:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Post in local Facebook groups asking about your service</li>
              <li>Survey 10 neighbors or friends about their needs</li>
              <li>Offer free trial service to 3 people for testimonials</li>
              <li>Research competitor prices and reviews online</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketValidation;