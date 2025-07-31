// components/sections/BusinessBasics.jsx
import React from 'react';
import { ThreeFishHeader } from '../shared/Navigation';
import { FieldWithTooltip, TextInput, Select, TextArea } from '../shared/FormComponents';

const BusinessBasics = ({ formData, handleInputChange }) => {
  const industryOptions = [
    { value: 'restaurant', label: '🍽️ Restaurant/Food Service' },
    { value: 'retail', label: '🏪 Retail Store' },
    { value: 'consulting', label: '💼 Consulting' },
    { value: 'ecommerce', label: '💻 Online Store' },
    { value: 'services', label: '✂️ Personal Services' },
    { value: 'ministry', label: '⛪ Ministry/Non-profit' },
    { value: 'manufacturing', label: '🏭 Manufacturing' },
    { value: 'technology', label: '💻 Technology' },
    { value: 'healthcare', label: '🏥 Healthcare' },
    { value: 'education', label: '📚 Education/Training' }
  ];

  const legalStructureOptions = [
    { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'llc', label: 'LLC (Recommended)' },
    { value: 'corporation', label: 'Corporation' },
    { value: 's_corp', label: 'S Corporation' },
    { value: 'nonprofit', label: 'Non-profit' }
  ];

  return (
    <div className="space-y-6">
      <ThreeFishHeader fishApproach="teachFish" />
      
      <FieldWithTooltip fieldKey="businessName" label="Business Name" required>
        <TextInput
          value={formData.businessName || ''}
          onChange={(value) => handleInputChange('businessName', value)}
          placeholder="What will customers call your business?"
          className="text-lg font-medium"
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="industry" label="Industry" required>
        <Select
          value={formData.industry || ''}
          onChange={(value) => handleInputChange('industry', value)}
          options={industryOptions}
          placeholder="Pick your industry"
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="legalStructure" label="Legal Structure" required>
        <Select
          value={formData.legalStructure || ''}
          onChange={(value) => handleInputChange('legalStructure', value)}
          options={legalStructureOptions}
          placeholder="Select structure"
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="businessAddress" label="Business Address" required>
        <TextInput
          value={formData.businessAddress || ''}
          onChange={(value) => handleInputChange('businessAddress', value)}
          placeholder="123 Main St, City, State ZIP"
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="description" label="Business Description" required>
        <TextArea
          value={formData.description || ''}
          onChange={(value) => handleInputChange('description', value)}
          placeholder="What does your business do? How does it help customers?"
          rows={4}
        />
      </FieldWithTooltip>

      <FieldWithTooltip fieldKey="uniqueValue" label="What Makes You Different?" required>
        <TextArea
          value={formData.uniqueValue || ''}
          onChange={(value) => handleInputChange('uniqueValue', value)}
          placeholder="Why should customers choose you over everyone else?"
          rows={3}
        />
      </FieldWithTooltip>
    </div>
  );
};

export default BusinessBasics;