'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Head from 'next/head';

interface DonationGoal {
  target_amount: number;
  current_amount: number;
  description: string;
}

// Explicitly define the form data structure
interface DonationFormData {
  amount: string;
  frequency: 'one-time' | 'monthly' | 'quarterly' | 'annual';
  paymentMethod: 'credit-card' | 'ach' | 'check';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  prayerRequest: string;
  coverFees: boolean;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  accountType: 'checking' | 'savings';
  bankName: string;
  routingNumber: string;
  accountNumber: string;
  accountHolderName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface FormErrors {
  [key: string]: string;
}

const US_STATES = [
  { value: '', label: 'Select State' },
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' }, { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' }, { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' }, { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' }, { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' }, { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' }, { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' }, { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' }, { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' }, { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' }, { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' }, { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' }, { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' }
];

const initialFormData: DonationFormData = {
  amount: '',
  frequency: 'monthly',
  paymentMethod: 'credit-card',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  prayerRequest: '',
  coverFees: false,
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  cardholderName: '',
  accountType: 'checking',
  bankName: '',
  routingNumber: '',
  accountNumber: '',
  accountHolderName: '',
  address: '',
  city: '',
  state: '',
  zipCode: ''
};

export default function DonationPage() {
  const [goal, setGoal] = useState<DonationGoal>({
    target_amount: 2000 monthly,
    current_amount: 0,
    description: 'Jeff & Julie 2026 Ministry Launch Fund'
  });
  
  const [formData, setFormData] = useState<DonationFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchGoalData();
  }, []);

  const fetchGoalData = async () => {
    try {
      const response = await fetch('/donation/api/goals');
      if (response.ok) {
        const data = await response.json();
        setGoal(data);
      }
    } catch (error) {
      console.error('Error fetching goal data:', error);
    }
  };

  const calculateFees = () => {
    const amount = parseFloat(formData.amount) || 0;
    if (amount <= 0) return { fee: 0, total: amount };

    let fee = 0;
    if (formData.paymentMethod === 'credit-card') {
      fee = amount * 0.029 + 0.30;
    } else {
      fee = Math.min(amount * 0.008, 5.00);
    }

    return {
      fee: Math.round(fee * 100) / 100,
      total: formData.coverFees ? amount + fee : amount
    };
  };

  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts: string[] = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string): string => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  // Use useCallback to prevent type inference issues
  const updateFormData = useCallback((updates: Partial<DonationFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  }, []);

  const updateTouched = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const updateErrors = useCallback((field: string, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  // Explicitly typed input change handler
  const handleInputChange = useCallback((field: keyof DonationFormData) => {
    return (value: string | boolean) => {
      let processedValue = value;
      
      if (typeof value === 'string') {
        if (field === 'cardNumber') {
          processedValue = formatCardNumber(value);
        } else if (field === 'expiryDate') {
          processedValue = formatExpiryDate(value);
        } else if (field === 'routingNumber' || field === 'accountNumber' || field === 'cvv') {
          processedValue = value.replace(/\D/g, '');
        }
      }

      updateFormData({ [field]: processedValue });
      // Remove the automatic validation and error clearing - only validate on submit
    };
  }, [updateFormData]);

  const handleBlur = useCallback((field: keyof DonationFormData) => {
    return () => {
      updateTouched(field);
      // Remove automatic validation on blur - only validate on submit
    };
  }, [updateTouched]);

  const validateField = useCallback((field: keyof DonationFormData): boolean => {
    const value = formData[field];
    let error = '';

    if (typeof value === 'boolean') {
      return true;
    }

    const stringValue = value as string;

    switch (field) {
      case 'amount':
        if (!stringValue || parseFloat(stringValue) < 10) {
          error = 'Minimum donation is $10';
        }
        break;
      case 'firstName':
        if (!stringValue.trim()) error = 'First name is required';
        break;
      case 'lastName':
        if (!stringValue.trim()) error = 'Last name is required';
        break;
      case 'email':
        if (!stringValue.trim()) {
          error = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(stringValue)) {
          error = 'Please enter a valid email address';
        }
        break;
      case 'cardNumber':
        if (formData.paymentMethod === 'credit-card' && !stringValue.replace(/\s/g, '')) {
          error = 'Card number is required';
        }
        break;
      case 'expiryDate':
        if (formData.paymentMethod === 'credit-card' && !stringValue) {
          error = 'Expiry date is required';
        }
        break;
      case 'cvv':
        if (formData.paymentMethod === 'credit-card' && !stringValue) {
          error = 'CVV is required';
        }
        break;
      case 'cardholderName':
        if (formData.paymentMethod === 'credit-card' && !stringValue.trim()) {
          error = 'Cardholder name is required';
        }
        break;
      case 'bankName':
        if (formData.paymentMethod === 'ach' && !stringValue.trim()) {
          error = 'Bank name is required';
        }
        break;
      case 'routingNumber':
        if (formData.paymentMethod === 'ach' && (!stringValue || stringValue.length !== 9)) {
          error = 'Valid 9-digit routing number is required';
        }
        break;
      case 'accountNumber':
        if (formData.paymentMethod === 'ach' && !stringValue) {
          error = 'Account number is required';
        }
        break;
      case 'accountHolderName':
        if (formData.paymentMethod === 'ach' && !stringValue.trim()) {
          error = 'Account holder name is required';
        }
        break;
      case 'address':
        if (!stringValue.trim()) error = 'Address is required';
        break;
      case 'city':
        if (!stringValue.trim()) error = 'City is required';
        break;
      case 'state':
        if (!stringValue) error = 'State is required';
        break;
      case 'zipCode':
        if (!stringValue.trim()) error = 'ZIP code is required';
        break;
    }

    updateErrors(field, error);
    return error === '';
  }, [formData, updateErrors]);

  const validateForm = useCallback((): boolean => {
    const fieldsToValidate: (keyof DonationFormData)[] = ['amount'];

    // Add required fields based on payment method
    if (formData.paymentMethod === 'credit-card') {
      fieldsToValidate.push('firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode');
      fieldsToValidate.push('cardNumber', 'expiryDate', 'cvv', 'cardholderName');
    } else if (formData.paymentMethod === 'ach') {
      fieldsToValidate.push('firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode');
      fieldsToValidate.push('bankName', 'routingNumber', 'accountNumber', 'accountHolderName');
    }
    // For 'check' payment method, only amount is required

    let isValid = true;
    const newTouched: Record<string, boolean> = {};

    fieldsToValidate.forEach(field => {
      newTouched[field] = true;
      if (!validateField(field)) {
        isValid = false;
      }
    });

    setTouched(prev => ({ ...prev, ...newTouched }));
    return isValid;
  }, [formData, validateField]);

  const getFieldClassName = useCallback((field: keyof DonationFormData, baseClass: string = ''): string => {
    // Only show errors if the form has been submitted and there's an actual error
    const hasError = touched[field] && errors[field];
    
    if (hasError) {
      return `${baseClass} border-red-500 bg-red-50 focus:ring-red-500 focus:border-red-500`;
    }
    return `${baseClass} border-slate-300 focus:ring-teal-500 focus:border-teal-500`;
  }, [touched, errors]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      return;
    }

    // For check payments, just show success without processing
    if (formData.paymentMethod === 'check') {
      setShowSuccess(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const { fee, total } = calculateFees();
      
      // Format payload to match the original working API structure exactly
      const payload = {
        donor: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || '',
          prayerRequests: formData.prayerRequest || ''
        },
        amount: parseFloat(formData.amount),
        frequency: formData.frequency || 'one-time',
        paymentMethod: formData.paymentMethod,
        coverFees: formData.coverFees,
        totalAmount: total,
        processingFees: fee,
        paymentDetails: formData.paymentMethod === 'credit-card' ? {
          cardNumber: formData.cardNumber,
          expirationDate: formData.expiryDate.replace('/', ''), // Remove slash like working version
          cardCode: formData.cvv,
          cardholderName: formData.cardholderName,
          billingAddress: formData.address,  // Correct field names
          billingCity: formData.city,
          billingState: formData.state,
          billingZip: formData.zipCode        // billingZip not billingZipCode
        } : {
          accountType: formData.accountType,
          routingNumber: formData.routingNumber,
          accountNumber: formData.accountNumber,
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName,
          billingAddress: formData.address,  // Correct field names  
          billingCity: formData.city,
          billingState: formData.state,
          billingZip: formData.zipCode        // billingZip not billingZipCode
        }
      };

      console.log('Sending payload:', JSON.stringify(payload, null, 2));

      const response = await fetch('/donation/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (response.ok) {
        setShowSuccess(true);
        await fetchGoalData();
        
        setFormData(initialFormData);
        setTouched({});
        setErrors({});
      } else {
        console.error('API Error Response:', JSON.stringify(result, null, 2));
        console.error('Status:', response.status);
        console.error('Response Headers:', response.headers);
        alert(`Error: ${result.error || 'Payment failed. Please try again.'}\n\nStatus: ${response.status}\nFull Error: ${JSON.stringify(result, null, 2)}`);
      }
    } catch (error) {
      console.error('Network/Parse error:', error);
      alert(`Network error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progressPercentage = Math.min(((goal.current_amount || 0) / (goal.target_amount || 24000)) * 100, 100);
  const { fee, total } = calculateFees();

  if (showSuccess) {
    return (
      <div>
        <Head>
          <title>Thank You - Donation Complete</title>
        </Head>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <div className="relative w-full h-48 mb-6 rounded-lg overflow-hidden bg-slate-200">
              <img
                src="/donation-assets/photos/celebration-success.jpg"
                alt="Celebration success"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="text-6xl mb-4">🙏</div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Thank You!</h2>
            <p className="text-slate-600 mb-6">
              Your generosity is multiplying ministry across three continents. 
              You&apos;ll receive an email confirmation shortly.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Give Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="googlebot" content="noindex, nofollow" />
        <meta name="bingbot" content="noindex, nofollow" />
        <meta name="ChatGPT" content="noindex" />
        <meta name="GPTBot" content="noindex" />
        <title>Support Jeff & Julie - Strategic Ministry Multiplication</title>
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
        <div className="relative h-[480px] overflow-hidden">
          <img
            src="/donation-assets/photos/hero-background.jpg"
            alt="Jeff and Julie in ministry context"
            className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/85 via-slate-900/60 to-slate-900/85" />
          <div className="absolute inset-0 flex items-center justify-center text-center px-4">
            <div className="max-w-4xl">
              <div className="flex items-center justify-center mb-6">
                <div className="mr-4 bg-white/10 backdrop-blur rounded-full p-2">
                  <img
                    src="/donation-assets/logos/ibam-logo.png"
                    alt="IBAM Logo"
                    className="h-16 w-auto"
                  />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
                  Strategic Force Multiplication
                </h1>
              </div>
              <p className="text-xl md:text-2xl text-teal-100 mb-6 drop-shadow-md">
                Multiplying followers of Jesus through excellent, faith-driven businesses among the unreached
              </p>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 inline-block border border-white/20">
                <p className="text-teal-100">
                  <strong className="text-white">Recent Impact:</strong> Jeff partners with three disciplemaking movements globally and is launching a new USA pilot this year
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{goal.description}</h3>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Progress</span>
                    <span>{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-slate-800 mt-2">
                    <span>${(goal.current_amount || 0).toLocaleString()}</span>
                    <span>${(goal.target_amount || 24000).toLocaleString()}</span>
                  </div>
                </div>
                
                <p className="text-slate-600">
                  Join strategic partners investing in sustainable ministry infrastructure across Central Asia, 
                  Indonesia, and Central Africa. Our goal is 2,000 dollars a monthly increase in partners by Christmas 2025.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <img
                    src="/donation-assets/photos/impact-showcase.jpg"
                    alt="Ministry impact and multiplication results"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-3">Force Multiplication in Action</h4>
                <div className="space-y-2 text-slate-600">
                  <p>✓ Training business leaders who multiply disciples through marketplace influence</p>
                  <p>✓ Establishing sustainable income streams for long-term ministry presence</p>
                  <p>✓ Creating indigenous leadership that continues multiplication without external dependency</p>
                  <p>✓ Building bridges for Gospel access in business and trade contexts</p>
                </div>
              </div>

              <div className="bg-slate-100 rounded-lg p-4 text-center">
                <p className="text-sm text-slate-600">
                  🔒 Tax-deductible 501(c)(3) • Secure payment processing • 100% goes to ministry when fees are covered
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Donation Amount *
                    </label>
                    
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[25, 50, 100, 250, 500, 1000].map(amount => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => handleInputChange('amount')(amount.toString())}
                          className="px-3 py-1 text-sm border border-slate-300 rounded hover:bg-teal-50 hover:border-teal-300 transition-colors"
                        >
                          ${amount}
                        </button>
                      ))}
                    </div>
                    
                    <div className="relative">
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Other Amount
                      </label>
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">$</span>
                      <input
                        name="amount"
                        type="number"
                        min="10"
                        step="1"
                        value={formData.amount}
                        onChange={(e) => handleInputChange('amount')(e.target.value)}
                        onBlur={handleBlur('amount')}
                        className={getFieldClassName('amount', 'w-full pl-8 pr-3 py-2 border rounded-lg')}
                        placeholder="Enter custom amount"
                      />
                    </div>
                    {touched.amount && errors.amount && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.amount}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Frequency
                    </label>
                    <select
                      value={formData.frequency}
                      onChange={(e) => handleInputChange('frequency')(e.target.value as DonationFormData['frequency'])}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    >
                      <option value="one-time">One-time</option>
                      <option value="monthly">Monthly (Best!)</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annual">Annual</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange('paymentMethod')('credit-card')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.paymentMethod === 'credit-card'
                          ? 'border-teal-600 bg-teal-100 shadow-md'
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">💳</div>
                        <div className="font-medium">Credit/Debit Card</div>
                        <div className="text-sm text-slate-600">Instant • 2.9% + $0.30</div>
                      </div>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleInputChange('paymentMethod')('ach')}
                      className={`p-4 border-2 rounded-lg transition-all ${
                        formData.paymentMethod === 'ach'
                          ? 'border-teal-600 bg-teal-100 shadow-md'
                          : 'border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">🏦</div>
                        <div className="font-medium">Bank Transfer</div>
                        <div className="text-sm text-slate-600">2-4 days • 0.8% (75% savings!)</div>
                      </div>
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleInputChange('paymentMethod')('check')}
                    className={`w-full p-3 border-2 rounded-lg transition-all ${
                      formData.paymentMethod === 'check'
                        ? 'border-teal-600 bg-teal-100 shadow-md'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-xl mb-1">📝</div>
                      <div className="font-medium">Give by Check</div>
                      <div className="text-sm text-slate-600">5-7 days • No processing fees</div>
                    </div>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      First Name {formData.paymentMethod !== 'check' ? '*' : '(Optional)'}
                    </label>
                    <input
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName')(e.target.value)}
                      onBlur={handleBlur('firstName')}
                      className={getFieldClassName('firstName', 'w-full px-3 py-2 border rounded-lg')}
                      placeholder="John"
                    />
                    {touched.firstName && errors.firstName && formData.paymentMethod !== 'check' && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Last Name {formData.paymentMethod !== 'check' ? '*' : '(Optional)'}
                    </label>
                    <input
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName')(e.target.value)}
                      onBlur={handleBlur('lastName')}
                      className={getFieldClassName('lastName', 'w-full px-3 py-2 border rounded-lg')}
                      placeholder="Smith"
                    />
                    {touched.lastName && errors.lastName && formData.paymentMethod !== 'check' && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <span className="mr-1">⚠️</span>
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {formData.paymentMethod !== 'check' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email')(e.target.value)}
                        onBlur={handleBlur('email')}
                        className={getFieldClassName('email', 'w-full px-3 py-2 border rounded-lg')}
                        placeholder="john@example.com"
                      />
                      {touched.email && errors.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.email}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Phone (Optional)
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone')(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                  </div>
                )}

                {formData.paymentMethod === 'credit-card' ? (
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-800">Credit Card Information</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Card Number *
                      </label>
                      <input
                        name="cardNumber"
                        type="text"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber')(e.target.value)}
                        onBlur={handleBlur('cardNumber')}
                        className={getFieldClassName('cardNumber', 'w-full px-3 py-2 border rounded-lg')}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {touched.cardNumber && errors.cardNumber && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.cardNumber}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Expiry Date *
                        </label>
                        <input
                          name="expiryDate"
                          type="text"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate')(e.target.value)}
                          onBlur={handleBlur('expiryDate')}
                          className={getFieldClassName('expiryDate', 'w-full px-3 py-2 border rounded-lg')}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {touched.expiryDate && errors.expiryDate && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.expiryDate}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          CVV *
                        </label>
                        <input
                          name="cvv"
                          type="text"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange('cvv')(e.target.value)}
                          onBlur={handleBlur('cvv')}
                          className={getFieldClassName('cvv', 'w-full px-3 py-2 border rounded-lg')}
                          placeholder="123"
                          maxLength={4}
                        />
                        {touched.cvv && errors.cvv && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.cvv}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Cardholder Name *
                      </label>
                      <input
                        name="cardholderName"
                        type="text"
                        value={formData.cardholderName}
                        onChange={(e) => handleInputChange('cardholderName')(e.target.value)}
                        onBlur={handleBlur('cardholderName')}
                        className={getFieldClassName('cardholderName', 'w-full px-3 py-2 border rounded-lg')}
                        placeholder="John Smith"
                      />
                      {touched.cardholderName && errors.cardholderName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.cardholderName}
                        </p>
                      )}
                    </div>
                  </div>
                ) : formData.paymentMethod === 'check' ? (
                  <div className="space-y-4">
                    <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-6">
                      <h4 className="font-bold text-teal-800 text-lg mb-4 flex items-center">
                        📮 Mail Your Check To:
                      </h4>
                      <div className="bg-white rounded-lg p-4 mb-4">
                        <div className="text-center font-medium text-slate-800">
                          <div className="text-lg font-bold">IBAM</div>
                          <div>PO Box 4323</div>
                          <div>Wheaton, IL 60189, USA</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-teal-700">
                        <div className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span><strong>Make check payable to:</strong> IBAM</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span><strong>Include gift details on separate piece of paper:</strong> Amount, frequency (monthly/one-time), and "For Jeff & Julie"</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-green-600 mr-2">✓</span>
                          <span><strong>Optional:</strong> Include your email below to track your gift on our progress board</span>
                        </div>
                        <div className="flex items-start">
                          <span className="text-blue-600 mr-2">ℹ️</span>
                          <span className="text-sm"><strong>Anonymous gifts welcome!</strong> Your gift will still count toward our goal even without contact info.</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Email Address (Optional - to track your gift on progress board)
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email')(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="john@example.com (optional)"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-800">Bank Account Information</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Account Type *
                        </label>
                        <select
                          value={formData.accountType}
                          onChange={(e) => handleInputChange('accountType')(e.target.value as DonationFormData['accountType'])}
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        >
                          <option value="checking">Checking</option>
                          <option value="savings">Savings</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Bank Name *
                        </label>
                        <input
                          name="bankName"
                          type="text"
                          value={formData.bankName}
                          onChange={(e) => handleInputChange('bankName')(e.target.value)}
                          onBlur={handleBlur('bankName')}
                          className={getFieldClassName('bankName', 'w-full px-3 py-2 border rounded-lg')}
                          placeholder="Wells Fargo"
                        />
                        {touched.bankName && errors.bankName && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.bankName}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Routing Number *
                        </label>
                        <input
                          name="routingNumber"
                          type="text"
                          value={formData.routingNumber}
                          onChange={(e) => handleInputChange('routingNumber')(e.target.value)}
                          onBlur={handleBlur('routingNumber')}
                          className={getFieldClassName('routingNumber', 'w-full px-3 py-2 border rounded-lg')}
                          placeholder="021000021"
                          maxLength={9}
                        />
                        {touched.routingNumber && errors.routingNumber && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.routingNumber}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          Account Number *
                        </label>
                        <input
                          name="accountNumber"
                          type="text"
                          value={formData.accountNumber}
                          onChange={(e) => handleInputChange('accountNumber')(e.target.value)}
                          onBlur={handleBlur('accountNumber')}
                          className={getFieldClassName('accountNumber', 'w-full px-3 py-2 border rounded-lg')}
                          placeholder="123456789"
                        />
                        {touched.accountNumber && errors.accountNumber && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.accountNumber}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Account Holder Name *
                      </label>
                      <input
                        name="accountHolderName"
                        type="text"
                        value={formData.accountHolderName}
                        onChange={(e) => handleInputChange('accountHolderName')(e.target.value)}
                        onBlur={handleBlur('accountHolderName')}
                        className={getFieldClassName('accountHolderName', 'w-full px-3 py-2 border rounded-lg')}
                        placeholder="John Smith"
                      />
                      {touched.accountHolderName && errors.accountHolderName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.accountHolderName}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {formData.paymentMethod !== 'check' && (
                  <div className="space-y-4">
                    <h4 className="font-medium text-slate-800">Billing Address</h4>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleInputChange('address')(e.target.value)}
                        onBlur={handleBlur('address')}
                        className={getFieldClassName('address', 'w-full px-3 py-2 border rounded-lg')}
                        placeholder="123 Main Street"
                      />
                      {touched.address && errors.address && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <span className="mr-1">⚠️</span>
                          {errors.address}
                        </p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          City *
                        </label>
                        <input
                          name="city"
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange('city')(e.target.value)}
                          onBlur={handleBlur('city')}
                          className={getFieldClassName('city', 'w-full px-3 py-2 border rounded-lg')}
                          placeholder="Anytown"
                        />
                        {touched.city && errors.city && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.city}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          State *
                        </label>
                        <select
                          name="state"
                          value={formData.state}
                          onChange={(e) => handleInputChange('state')(e.target.value)}
                          onBlur={handleBlur('state')}
                          className={getFieldClassName('state', 'w-full px-3 py-2 border rounded-lg')}
                        >
                          {US_STATES.map(state => (
                            <option key={state.value} value={state.value}>
                              {state.label}
                            </option>
                          ))}
                        </select>
                        {touched.state && errors.state && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.state}
                          </p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          name="zipCode"
                          type="text"
                          value={formData.zipCode}
                          onChange={(e) => handleInputChange('zipCode')(e.target.value)}
                          onBlur={handleBlur('zipCode')}
                          className={getFieldClassName('zipCode', 'w-full px-3 py-2 border rounded-lg')}
                          placeholder="12345"
                        />
                        {touched.zipCode && errors.zipCode && (
                          <p className="text-red-500 text-sm mt-1 flex items-center">
                            <span className="mr-1">⚠️</span>
                            {errors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {formData.paymentMethod === 'check' ? 'Prayer Request or Comments (Optional - Personal, only Jeff & Julie will see this)' : 'Prayer Request (Optional)'}
                  </label>
                  <textarea
                    value={formData.prayerRequest}
                    onChange={(e) => handleInputChange('prayerRequest')(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    rows={3}
                    placeholder={formData.paymentMethod === 'check' ? 'How can Jeff & Julie pray for you? (Include this on your separate paper if preferred)' : 'How can Jeff & Julie pray for you?'}
                  />
                  {formData.paymentMethod === 'check' && (
                    <p className="text-sm text-slate-500 mt-1">
                      🔒 This is personal and confidential - only Jeff & Julie will see your prayer request or comments.
                    </p>
                  )}
                </div>

                {formData.paymentMethod !== 'check' && (
                  <div className="bg-slate-50 rounded-lg p-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.coverFees}
                        onChange={(e) => handleInputChange('coverFees')(e.target.checked)}
                        className="w-4 h-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
                      />
                      <span className="text-sm font-medium text-slate-700">
                        Cover processing fees so 100% goes to ministry
                        {fee > 0 && ` (+${fee.toFixed(2)})`}
                      </span>
                    </label>
                    
                    {parseFloat(formData.amount) > 0 && (
                      <div className="mt-3 text-sm text-slate-600">
                        <div className="flex justify-between">
                          <span>Donation Amount:</span>
                          <span>${parseFloat(formData.amount).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Processing Fee:</span>
                          <span>${fee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-medium text-slate-800 border-t pt-1 mt-1">
                          <span>Total:</span>
                          <span>${total.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                    isSubmitting
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg hover:shadow-xl'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : formData.paymentMethod === 'check' ? (
                    '📮 Get Mailing Instructions'
                  ) : (
                    formData.frequency === 'monthly' 
                      ? `Start Monthly Support - ${total.toFixed(2)}`
                      : `Give ${formData.frequency === 'one-time' ? 'Today' : formData.frequency} - ${total.toFixed(2)}`
                  )}
                </button>

                <div className="text-center text-sm text-slate-600 pt-4 border-t">
                  <p>Questions? Contact Jeff & Julie at <a href="mailto:samfamteam@gmail.com" className="text-teal-600 hover:underline">samfamteam@gmail.com</a></p>
                  <p className="mt-1">Donations are tax-deductible • 501(c)(3) Organization</p>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* IBAM Footer */}
        <footer className="bg-slate-800 text-white py-8">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              
              {/* IBAM Logo and Branding */}
              <div className="flex items-center space-x-4">
                <div className="bg-white/10 rounded-full p-2">
                  <img
                    src="/donation-assets/logos/ibam-logo.png"
                    alt="IBAM Logo"
                    className="h-12 w-auto"
                  />
                </div>
                <div>
                  <div className="text-xl font-bold">IBAM</div>
                  <div className="text-sm text-slate-300">International Business as Mission</div>
                </div>
              </div>
              
              {/* Contact Information */}
              <div className="text-center md:text-right space-y-2">
                <div>
                  <a 
                    href="https://www.ibam.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-teal-400 hover:text-teal-300 font-medium"
                  >
                    www.ibam.org
                  </a>
                </div>
                <div className="text-sm text-slate-300">
                  Email: <a href="mailto:admin@ibam.org" className="text-teal-400 hover:text-teal-300">admin@ibam.org</a>
                </div>
                <div className="text-sm text-slate-300">
                  Phone: <a href="tel:+17036521226" className="text-teal-400 hover:text-teal-300">+1 (703) 652-IBAM (4226)</a>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  Administrative questions and general inquiries
                </div>
              </div>
              
            </div>
            
            {/* Mailing Address */}
            <div className="border-t border-slate-700 mt-6 pt-6 text-center">
              <div className="text-sm text-slate-300">
                <strong>Mailing Address:</strong> PO Box 4323, Wheaton, IL 60189, USA
              </div>
              <div className="text-xs text-slate-400 mt-2">
                Participate in projects that balance profit with purpose! • Designed to Thrive
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}