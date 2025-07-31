import React, { useState, useEffect } from 'react';
import { FieldWithTooltip } from '../shared/FormComponents';

const OperationsPlanning = ({ formData, handleInputChange, addWin, allFormData }) => {
  const [localData, setLocalData] = useState({
    // Service Delivery Process
    serviceProcess: '',
    serviceSteps: '',
    timePerService: '',
    qualityStandards: '',
    
    // Daily Operations
    dailySchedule: '',
    workHours: '',
    
    // Tools & Equipment
    toolsNeeded: '',
    equipmentCosts: '',
    
    // Customer Management
    bookingProcess: '',
    paymentProcess: '',
    
    // Service Area & Logistics
    serviceRadius: '',
    capacityPlanning: '',
    
    // Quality Control
    qualityChecklist: '',
    
    // Business Systems
    recordKeeping: '',
    
    ...formData
  });

  const [completionPercentage, setCompletionPercentage] = useState(0);

  const updateField = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    handleInputChange(field, value);
  };

  const calculateCompletion = () => {
    const requiredFields = [
      'serviceProcess', 'serviceSteps', 'timePerService', 'dailySchedule',
      'toolsNeeded', 'bookingProcess', 'paymentProcess', 'serviceRadius',
      'qualityChecklist', 'recordKeeping'
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
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">How It Works</h1>
              <p className="text-gray-600">Operations plan - Show the bank exactly how you'll run your business</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Progress: {completionPercentage}%</div>
            <div className="text-xs text-green-600">Auto-saving...</div>
          </div>
        </div>
        
        {/* Three Fish Header */}
        <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-6">
          <div className="flex items-center">
            <div className="text-purple-600 mr-3">🐠</div>
            <div>
              <h3 className="text-lg font-semibold text-purple-800">TEACH TO FISH</h3>
              <p className="text-purple-700">Learn to create efficient systems that banks can understand and trust</p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Delivery Process */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Your Service Delivery Process</h2>
        <p className="text-gray-600 mb-4">Banks want to see you have a clear, repeatable process for serving customers</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="serviceProcess" label="Describe your complete service process" required>
            <textarea
              value={localData.serviceProcess}
              onChange={(e) => updateField('serviceProcess', e.target.value)}
              placeholder="Describe step-by-step what happens during a typical service call..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="serviceSteps" label="Break down your service into specific steps" required>
            <textarea
              value={localData.serviceSteps}
              onChange={(e) => updateField('serviceSteps', e.target.value)}
              placeholder="1. Step one&#10;2. Step two&#10;3. Step three..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="timePerService" label="How long does each service take?" required>
            <textarea
              value={localData.timePerService}
              onChange={(e) => updateField('timePerService', e.target.value)}
              placeholder="List different service types and how long each takes..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="qualityStandards" label="What are your quality standards?">
            <textarea
              value={localData.qualityStandards}
              onChange={(e) => updateField('qualityStandards', e.target.value)}
              placeholder="Describe your quality standards and how you ensure excellent service..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Daily Operations */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Daily Operations Schedule</h2>
        <p className="text-gray-600 mb-4">Show how you'll manage your time and maximize productivity</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="dailySchedule" label="What does a typical day look like?" required>
            <textarea
              value={localData.dailySchedule}
              onChange={(e) => updateField('dailySchedule', e.target.value)}
              placeholder="Describe a typical workday from morning to evening..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="workHours" label="What are your working hours?">
            <select
              value={localData.workHours}
              onChange={(e) => updateField('workHours', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your typical working hours</option>
              <option value="Monday-Friday business hours">Monday-Friday business hours</option>
              <option value="Evenings and weekends only">Evenings and weekends only</option>
              <option value="Flexible hours by appointment">Flexible hours by appointment</option>
              <option value="Set schedule (specific days/times)">Set schedule (specific days/times)</option>
              <option value="24/7 availability">24/7 availability</option>
            </select>
          </FieldWithTooltip>
        </div>
      </div>

      {/* Tools & Equipment */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Tools, Equipment & Supplies</h2>
        <p className="text-gray-600 mb-4">List everything you need to deliver your service professionally</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="toolsNeeded" label="What tools and equipment do you need?" required>
            <textarea
              value={localData.toolsNeeded}
              onChange={(e) => updateField('toolsNeeded', e.target.value)}
              placeholder="List all tools and equipment needed for your service..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="equipmentCosts" label="How much will your equipment cost?">
            <textarea
              value={localData.equipmentCosts}
              onChange={(e) => updateField('equipmentCosts', e.target.value)}
              placeholder="List equipment costs (research actual prices)..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Customer Management */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Customer Management Process</h2>
        <p className="text-gray-600 mb-4">How you'll handle customers from first contact to payment</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="bookingProcess" label="How will customers book your services?" required>
            <textarea
              value={localData.bookingProcess}
              onChange={(e) => updateField('bookingProcess', e.target.value)}
              placeholder="Describe how customers will schedule and book your services..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="paymentProcess" label="How will customers pay you?" required>
            <textarea
              value={localData.paymentProcess}
              onChange={(e) => updateField('paymentProcess', e.target.value)}
              placeholder="Describe your payment methods and process..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Service Area & Logistics */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Service Area & Logistics</h2>
        <p className="text-gray-600 mb-4">Define where and how you'll serve customers efficiently</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="serviceRadius" label="What's your service area radius?" required>
            <select
              value={localData.serviceRadius}
              onChange={(e) => updateField('serviceRadius', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select your service radius</option>
              <option value="Within 5 miles of my home">Within 5 miles of my home</option>
              <option value="Within 10 miles of my home">Within 10 miles of my home</option>
              <option value="Within 15 miles of my home">Within 15 miles of my home</option>
              <option value="Within 20 miles of my home">Within 20 miles of my home</option>
              <option value="My entire city/county">My entire city/county</option>
              <option value="Multiple cities in my area">Multiple cities in my area</option>
            </select>
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="capacityPlanning" label="How many customers can you serve per day/week?">
            <textarea
              value={localData.capacityPlanning}
              onChange={(e) => updateField('capacityPlanning', e.target.value)}
              placeholder="Describe your daily and weekly customer capacity..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Quality Control */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Quality Control & Customer Satisfaction</h2>
        <p className="text-gray-600 mb-4">How you'll ensure consistent, excellent service every time</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="qualityChecklist" label="What's your quality control checklist?" required>
            <textarea
              value={localData.qualityChecklist}
              onChange={(e) => updateField('qualityChecklist', e.target.value)}
              placeholder="Create a quality checklist you'll use for every service call..."
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Business Systems */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Business Systems & Record Keeping</h2>
        <p className="text-gray-600 mb-4">How you'll track customers, money, and business performance</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="recordKeeping" label="How will you keep business records?" required>
            <textarea
              value={localData.recordKeeping}
              onChange={(e) => updateField('recordKeeping', e.target.value)}
              placeholder="Describe your system for keeping business records..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>
        </div>
      </div>

      {/* Biblical Wisdom */}
      <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex items-start">
          <div className="text-yellow-600 mr-3 text-lg">💡</div>
          <div>
            <h4 className="font-semibold text-yellow-800 mb-2">Biblical Business Wisdom</h4>
            <p className="text-yellow-700 text-sm">
              "She sets about her work vigorously; her arms are strong for her tasks." - Proverbs 31:17
            </p>
            <p className="text-yellow-600 text-sm mt-2">
              Good systems and planning give you strength to work vigorously and serve customers excellently!
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
                ? "Outstanding! You have a complete operations plan that banks will trust."
                : "Keep building your operations plan to show banks you're organized and professional."
              }
            </p>
          </div>
          <div className="text-2xl">
            {completionPercentage === 100 ? "✅" : "⏳"}
          </div>
        </div>
        
        {completionPercentage < 100 && (
          <div className="mt-3 text-sm text-gray-600">
            <p><strong>Operations planning tips:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Walk through your service process step-by-step with a friend</li>
              <li>Time yourself doing a practice service to validate your estimates</li>
              <li>Research actual prices for tools and supplies online</li>
              <li>Create simple checklists for quality and record-keeping</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperationsPlanning;