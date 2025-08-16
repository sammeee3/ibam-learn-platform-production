// components/sections/ReadinessAssessment.jsx
// Readiness Assessment section component

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { colors } from '../../config/constants';
import { ThreeFishHeader } from '../shared/Navigation';
import { FieldWithTooltip, RatingInput, TextInput, TextArea } from '../shared/FormComponents';

const ReadinessAssessment = ({ formData, handleInputChange, challengeQuestions }) => {
  // Challenge Questions Display
  const ChallengeQuestions = () => (
    challengeQuestions.length > 0 && (
      <div className="mb-6 space-y-3">
        <h4 className="font-bold flex items-center text-lg" style={{ color: colors.text }}>
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
          Reality Check:
        </h4>
        {challengeQuestions.map((challenge, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-l-4 text-sm ${
              challenge.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
              'bg-yellow-50 border-yellow-500 text-yellow-800'
            }`}
          >
            <div className="font-medium mb-2">
              {challenge.type === 'error' ? '🚫 IMPORTANT:' : '⚠️ CONSIDER:'}
            </div>
            <div className="leading-relaxed">{challenge.question}</div>
          </div>
        ))}
      </div>
    )
  );

  return (
    <div className="space-y-6">
      <ThreeFishHeader fishApproach="teachFish" />
      
      <div className="bg-blue-50 rounded-xl p-4 border-l-4" style={{ borderColor: colors.primary }}>
        <h3 className="font-bold mb-2" style={{ color: colors.primary }}>
          🤔 Let's Be Honest: Are You Really Ready?
        </h3>
        <p className="text-sm" style={{ color: colors.text }}>
          Business is tough. It's better to know now if you're ready than to find out later when you've spent money and time.
        </p>
      </div>

      <ChallengeQuestions />

      <FieldWithTooltip fieldKey="riskTolerance" label="How comfortable are you with uncertainty?" required>
        <RatingInput
          value={formData.riskTolerance}
          onChange={(value) => handleInputChange('riskTolerance', value)}
          max={10}
        />
        <p className="text-xs text-gray-600 mt-1">
          Business means not knowing if you'll make money next month. Rate your comfort level.
        </p>
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="familySupport" label="Does your family support this dream?" required>
        <RatingInput
          value={formData.familySupport}
          onChange={(value) => handleInputChange('familySupport', value)}
          max={10}
        />
        <p className="text-xs text-gray-600 mt-1">
          You'll work nights and weekends. Will your family understand and support you?
        </p>
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="timeAvailable" label="Hours per week you can realistically work on this" required>
        <TextInput
          value={formData.timeAvailable || ''}
          onChange={(value) => handleInputChange('timeAvailable', parseInt(value) || 0)}
          placeholder="20"
          className="text-lg font-medium"
        />
        <p className="text-xs text-gray-600 mt-1">
          Be honest. Factor in your current job, family time, and sleep. Most need 20+ hours.
        </p>
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="financialCushion" label="How many months can your family survive without business income?" required>
        <TextInput
          value={formData.financialCushion || ''}
          onChange={(value) => handleInputChange('financialCushion', parseInt(value) || 0)}
          placeholder="6"
          className="text-lg font-medium"
        />
        <p className="text-xs text-gray-600 mt-1">
          Most businesses take 6-12 months to become profitable. Do you have enough savings?
        </p>
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="motivationLevel" label="How badly do you want this?" required>
        <RatingInput
          value={formData.motivationLevel}
          onChange={(value) => handleInputChange('motivationLevel', value)}
          max={10}
        />
        <p className="text-xs text-gray-600 mt-1">
          On tough days, what will keep you going? Rate your drive and determination.
        </p>
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="previousExperience" label="Previous business or leadership experience">
        <TextArea
          value={formData.previousExperience || ''}
          onChange={(value) => handleInputChange('previousExperience', value)}
          placeholder="Managed a team of 5 people... Ran a lemonade stand... Sold stuff on eBay... No experience, but willing to learn..."
          rows={3}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="personalWhyStatement" label="Why do you want to start a business?" required>
        <TextArea
          value={formData.personalWhyStatement || ''}
          onChange={(value) => handleInputChange('personalWhyStatement', value)}
          placeholder="I want to be my own boss... I have a great idea... I want to serve my community... I need more income..."
          rows={4}
        />
      </FieldWithTooltip>

      {/* Reality Check Results */}
      {formData.riskTolerance > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 border">
          <h3 className="font-bold mb-3 text-gray-800">📊 Your Readiness Reality Check</h3>
          <div className="space-y-2 text-sm">
            {formData.riskTolerance < 5 && (
              <div className="text-orange-700">⚠️ Low risk tolerance - business might be stressful for you</div>
            )}
            {formData.timeAvailable < 20 && (
              <div className="text-red-700">🚨 May not have enough time for business success</div>
            )}
            {formData.familySupport < 7 && (
              <div className="text-orange-700">⚠️ Work on getting more family buy-in first</div>
            )}
            {formData.financialCushion < 6 && (
              <div className="text-red-700">🚨 Need bigger financial safety net</div>
            )}
            {formData.riskTolerance >= 7 && 
             formData.timeAvailable >= 20 && 
             formData.familySupport >= 7 && 
             formData.financialCushion >= 6 && (
              <div className="text-green-700 font-medium">🎉 You look ready for entrepreneurship!</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadinessAssessment;