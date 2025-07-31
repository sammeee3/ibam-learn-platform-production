import React, { useState, useEffect } from 'react';
import { FieldWithTooltip } from '../shared/FormComponents';

const LegalCompliance = ({ formData, handleInputChange, addWin, allFormData }) => {
  const [localData, setLocalData] = useState({
    // Business Registration
    businessName: '',
    businessType: '',
    registrationStatus: '',
    registrationDate: '',
    
    // Federal Requirements
    einNumber: '',
    einApplication: '',
    businessBankAccount: '',
    
    // State & Local Requirements
    businessLicense: '',
    professionalLicense: '',
    salesTax: '',
    
    // Insurance & Protection
    generalLiability: '',
    professionalLiability: '',
    bondingInsurance: '',
    
    // Contracts & Agreements
    serviceAgreements: '',
    
    // Tax Obligations
    quarterlyTaxes: '',
    
    // Compliance Tracking
    renewalDates: '',
    
    ...formData
  });

  const [completionPercentage, setCompletionPercentage] = useState(0);

  const updateField = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    handleInputChange(field, value);
  };

  const calculateCompletion = () => {
    const requiredFields = [
      'businessName', 'businessType', 'registrationStatus', 'einApplication',
      'businessBankAccount', 'businessLicense', 'generalLiability', 
      'serviceAgreements', 'quarterlyTaxes', 'renewalDates'
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
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Legal Stuff</h1>
              <p className="text-gray-600">Legal compliance - Make your business official and protected</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Progress: {completionPercentage}%</div>
            <div className="text-xs text-green-600">Auto-saving...</div>
          </div>
        </div>
        
        {/* Three Fish Header */}
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex items-center">
            <div className="text-red-600 mr-3">🐠</div>
            <div>
              <h3 className="text-lg font-semibold text-red-800">GIVE A FISH</h3>
              <p className="text-red-700">Get the legal foundation right so banks can confidently lend to you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Registration */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Business Registration</h2>
        <p className="text-gray-600 mb-4">Make your business official with the government</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="businessName" label="What will you name your business?" required>
            <textarea
              value={localData.businessName}
              onChange={(e) => updateField('businessName', e.target.value)}
              placeholder="Enter your business name (check availability first)..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="businessType" label="What type of business structure do you want?" required>
            <select
              value={localData.businessType}
              onChange={(e) => updateField('businessType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select your business structure</option>
              <option value="Sole Proprietorship (just me)">Sole Proprietorship (just me)</option>
              <option value="LLC (Limited Liability Company)">LLC (Limited Liability Company)</option>
              <option value="Partnership">Partnership</option>
              <option value="Corporation">Corporation</option>
              <option value="Not sure yet - need advice">Not sure yet - need advice</option>
            </select>
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="registrationStatus" label="What's your business registration status?" required>
            <select
              value={localData.registrationStatus}
              onChange={(e) => updateField('registrationStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select your registration status</option>
              <option value="Not started yet">Not started yet</option>
              <option value="Researching requirements">Researching requirements</option>
              <option value="In progress">In progress</option>
              <option value="Completed">Completed</option>
              <option value="Need help with process">Need help with process</option>
            </select>
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="registrationDate" label="When did/will you register your business?">
            <input
              type="date"
              value={localData.registrationDate}
              onChange={(e) => updateField('registrationDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h4 className="font-semibold text-blue-800 mb-2">📋 Business Registration Steps:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
            <li>Check if your business name is available</li>
            <li>Choose your business structure (Sole Proprietorship or LLC)</li>
            <li>Register with your state's Secretary of State office</li>
            <li>Get your registration certificate</li>
            <li>Keep your certificate safe - banks need to see it</li>
          </ol>
        </div>
      </div>

      {/* Federal Requirements */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Federal Requirements</h2>
        <p className="text-gray-600 mb-4">Required paperwork with the federal government</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="einNumber" label="Do you have an EIN (Tax ID Number)?">
            <textarea
              value={localData.einNumber}
              onChange={(e) => updateField('einNumber', e.target.value)}
              placeholder="Enter your EIN if you have one, or 'Not yet' if you need to apply..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="einApplication" label="What's your EIN application status?" required>
            <select
              value={localData.einApplication}
              onChange={(e) => updateField('einApplication', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select your EIN status</option>
              <option value="Haven't started yet">Haven't started yet</option>
              <option value="Ready to apply online">Ready to apply online</option>
              <option value="Application submitted">Application submitted</option>
              <option value="EIN received">EIN received</option>
              <option value="Need help with application">Need help with application</option>
            </select>
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="businessBankAccount" label="Do you have a business bank account?" required>
            <select
              value={localData.businessBankAccount}
              onChange={(e) => updateField('businessBankAccount', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select your business banking status</option>
              <option value="Not opened yet">Not opened yet</option>
              <option value="Researching banks">Researching banks</option>
              <option value="Ready to open account">Ready to open account</option>
              <option value="Account opened">Account opened</option>
              <option value="Need help choosing bank">Need help choosing bank</option>
            </select>
          </FieldWithTooltip>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
          <h4 className="font-semibold text-green-800 mb-2">🏦 Business Banking Steps:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-green-700">
            <li>Get your EIN from IRS.gov (free)</li>
            <li>Get your business registration certificate</li>
            <li>Compare business accounts at local banks</li>
            <li>Open business checking account (bring EIN and registration)</li>
            <li>Order business checks and debit card</li>
          </ol>
        </div>
      </div>

      {/* State & Local Requirements */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">State & Local Requirements</h2>
        <p className="text-gray-600 mb-4">Licenses and permits required in your area</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="businessLicense" label="Do you need a general business license?" required>
            <select
              value={localData.businessLicense}
              onChange={(e) => updateField('businessLicense', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select your business license status</option>
              <option value="Not sure if I need one">Not sure if I need one</option>
              <option value="Need to apply">Need to apply</option>
              <option value="Application in progress">Application in progress</option>
              <option value="License obtained">License obtained</option>
              <option value="My area doesn't require one">My area doesn't require one</option>
            </select>
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="professionalLicense" label="Do you need professional or trade licenses?">
            <textarea
              value={localData.professionalLicense}
              onChange={(e) => updateField('professionalLicense', e.target.value)}
              placeholder="Describe any professional licenses you need for your service..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="salesTax" label="Do you need to collect sales tax?">
            <select
              value={localData.salesTax}
              onChange={(e) => updateField('salesTax', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your sales tax status</option>
              <option value="Not sure if I need to">Not sure if I need to</option>
              <option value="My service doesn't require it">My service doesn't require it</option>
              <option value="Need to register">Need to register</option>
              <option value="Registered for sales tax">Registered for sales tax</option>
              <option value="Need help understanding requirements">Need help understanding requirements</option>
            </select>
          </FieldWithTooltip>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
          <h4 className="font-semibold text-yellow-800 mb-2">🏛️ Where to Check Requirements:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
            <li><strong>City/County:</strong> Business license, permits, zoning</li>
            <li><strong>State:</strong> Professional licenses, sales tax registration</li>
            <li><strong>Industry Associations:</strong> Trade-specific requirements</li>
            <li><strong>SCORE.org:</strong> Free business mentoring and guidance</li>
          </ul>
        </div>
      </div>

      {/* Insurance & Protection */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Insurance & Protection</h2>
        <p className="text-gray-600 mb-4">Protect yourself, your customers, and your business</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="generalLiability" label="Do you have general liability insurance?" required>
            <select
              value={localData.generalLiability}
              onChange={(e) => updateField('generalLiability', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select your liability insurance status</option>
              <option value="Not obtained yet">Not obtained yet</option>
              <option value="Getting quotes">Getting quotes</option>
              <option value="Applied for coverage">Applied for coverage</option>
              <option value="Have coverage">Have coverage</option>
              <option value="Not sure if I need it">Not sure if I need it</option>
            </select>
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="professionalLiability" label="Do you need professional liability insurance?">
            <select
              value={localData.professionalLiability}
              onChange={(e) => updateField('professionalLiability', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your professional insurance status</option>
              <option value="Not obtained yet">Not obtained yet</option>
              <option value="Getting quotes">Getting quotes</option>
              <option value="Applied for coverage">Applied for coverage</option>
              <option value="Have coverage">Have coverage</option>
              <option value="Not sure if I need it">Not sure if I need it</option>
            </select>
          </FieldWithTooltip>

          <FieldWithTooltip fieldKey="bondingInsurance" label="Do you need bonding insurance?">
            <select
              value={localData.bondingInsurance}
              onChange={(e) => updateField('bondingInsurance', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your bonding insurance status</option>
              <option value="Not obtained yet">Not obtained yet</option>
              <option value="Getting quotes">Getting quotes</option>
              <option value="Applied for coverage">Applied for coverage</option>
              <option value="Have coverage">Have coverage</option>
              <option value="Not sure if I need it">Not sure if I need it</option>
            </select>
          </FieldWithTooltip>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
          <h4 className="font-semibold text-purple-800 mb-2">💡 Insurance Shopping Tips:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-purple-700">
            <li>Get quotes from at least 3 insurance companies</li>
            <li>Ask about business package deals (bundle liability + bonding)</li>
            <li>Check if your industry has group insurance rates</li>
            <li>Ask customers what insurance they require</li>
          </ul>
        </div>
      </div>

      {/* Contracts & Agreements */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Contracts & Legal Agreements</h2>
        <p className="text-gray-600 mb-4">Protect yourself with proper paperwork</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="serviceAgreements" label="Do you have service agreements or contracts?" required>
            <textarea
              value={localData.serviceAgreements}
              onChange={(e) => updateField('serviceAgreements', e.target.value)}
              placeholder="Describe your customer service agreements..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mt-4">
          <h4 className="font-semibold text-indigo-800 mb-2">📄 Legal Document Resources:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-indigo-700">
            <li><strong>LegalZoom:</strong> Basic contract templates</li>
            <li><strong>Rocket Lawyer:</strong> Free legal documents with subscription</li>
            <li><strong>Local SCORE:</strong> Free business mentoring</li>
            <li><strong>State Bar Association:</strong> Find affordable lawyers</li>
          </ul>
        </div>
      </div>

      {/* Tax Obligations */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Tax Obligations</h2>
        <p className="text-gray-600 mb-4">Understand your tax responsibilities as a business owner</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="quarterlyTaxes" label="Do you understand quarterly tax payments?" required>
            <textarea
              value={localData.quarterlyTaxes}
              onChange={(e) => updateField('quarterlyTaxes', e.target.value)}
              placeholder="Describe your understanding of quarterly tax obligations..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </FieldWithTooltip>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
          <h4 className="font-semibold text-green-800 mb-2">💰 Tax Planning Tips:</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
            <li>Set aside 25-30% of income for taxes immediately</li>
            <li>Track business mileage every trip</li>
            <li>Keep receipts for all business purchases</li>
            <li>Pay quarterly taxes to avoid penalties</li>
            <li>Consider hiring a tax professional for your first year</li>
          </ul>
        </div>
      </div>

      {/* Compliance Tracking */}
      <div className="mb-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">Staying Compliant</h2>
        <p className="text-gray-600 mb-4">Keep track of renewals and ongoing requirements</p>
        
        <div className="space-y-6">
          <FieldWithTooltip fieldKey="renewalDates" label="What licenses and permits need renewal?" required>
            <textarea
              value={localData.renewalDates}
              onChange={(e) => updateField('renewalDates', e.target.value)}
              placeholder="List what needs renewal and when..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
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
              "Let everyone be subject to the governing authorities, for there is no authority except that which God has established." - Romans 13:1
            </p>
            <p className="text-blue-600 text-sm mt-2">
              Following legal requirements honors God and protects your business. Banks trust businesses that follow the law!
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
                ? "Perfect! You have all the legal basics covered for bank approval."
                : "Keep working through legal requirements to protect your business and satisfy banks."
              }
            </p>
          </div>
          <div className="text-2xl">
            {completionPercentage === 100 ? "✅" : "⏳"}
          </div>
        </div>
        
        {completionPercentage < 100 && (
          <div className="mt-3 text-sm text-gray-600">
            <p><strong>Legal setup priority order:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Choose business name and structure</li>
              <li>Register business with state</li>
              <li>Get EIN from IRS (free at IRS.gov)</li>
              <li>Open business bank account</li>
              <li>Get liability insurance</li>
              <li>Apply for required licenses</li>
            </ol>
          </div>
        )}
      </div>

      {/* Emergency Legal Resources */}
      <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <h4 className="font-semibold text-red-800 mb-2">🚨 Need Legal Help?</h4>
        <div className="text-sm text-red-700 space-y-1">
          <p><strong>Free Resources:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>SCORE.org:</strong> Free business mentoring</li>
            <li><strong>SBA.gov:</strong> Small Business Administration guidance</li>
            <li><strong>State Secretary of State:</strong> Business registration help</li>
            <li><strong>IRS.gov:</strong> Tax ID number and tax information</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LegalCompliance;