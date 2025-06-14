'use client';

// app/auth/signup/page.tsx
// Enhanced signup page with tier system integration

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEnhancedAuth, SubscriptionTier, getTierBadge, formatCurrency } from '@/lib/enhanced-auth';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedTier, setSelectedTier] = useState('trial');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tiers, setTiers] = useState<SubscriptionTier[]>([]);
  const router = useRouter();
  const auth = useEnhancedAuth();

  // Load available tiers
  useEffect(() => {
    const loadTiers = async () => {
      const availableTiers = await auth.getAllTiers();
      setTiers(availableTiers);
      // Default to trial tier
      if (availableTiers.length > 0) {
        const trialTier = availableTiers.find(t => t.tier_key === 'trial');
        if (trialTier) {
          setSelectedTier(trialTier.tier_key);
        }
      }
    };
    loadTiers();
  }, []);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Sign up with Supabase auth
      const { data, error: signUpError } = await auth.signUp(email, password, {
        full_name: fullName
      });
      
      if (signUpError) {
        throw new Error(signUpError.message);
      }

      if (data.user) {
        // Create user profile with selected tier
        const profileResult = await auth.createUserProfile(data.user, selectedTier);
        
        if (profileResult.success) {
          console.log('✅ User created with tier:', selectedTier);
          // Redirect to dashboard or onboarding
          router.push('/dashboard?welcome=true');
        } else {
          throw new Error(profileResult.error || 'Failed to create user profile');
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError(error instanceof Error ? error.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Join IBAM
          </h1>
          <p className="text-lg text-gray-600">
            Start your faith-driven entrepreneurship journey
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSignup} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Choose a password"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Confirm your password"
                  />
                </div>
              </div>
            </div>

            {/* Membership Tier Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Choose Your Membership</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tiers.map((tier) => {
                  const badge = getTierBadge(tier);
                  const isSelected = selectedTier === tier.tier_key;
                  
                  return (
                    <div
                      key={tier.tier_key}
                      className={`relative rounded-lg border-2 p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedTier(tier.tier_key)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {tier.display_name}
                            </h4>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.color}`}>
                              {tier.tier_level === 1 ? 'FREE' : formatCurrency(tier.monthly_price)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {tier.description}
                          </p>
                          
                          {/* Features preview */}
                          <div className="space-y-1">
                            {tier.features?.modules && (
                              <p className="text-xs text-gray-500">
                                ✓ Access to {tier.features.modules === 'all' ? 'all' : tier.features.modules.length} modules
                              </p>
                            )}
                            {tier.features?.ai_interactions && (
                              <p className="text-xs text-gray-500">
                                ✓ AI coaching assistance
                              </p>
                            )}
                            {tier.features?.coaching && (
                              <p className="text-xs text-gray-500">
                                ✓ Human coaching sessions
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <input
                          type="radio"
                          name="tier"
                          value={tier.tier_key}
                          checked={isSelected}
                          onChange={(e) => setSelectedTier(e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <Link 
                href="/auth/login" 
                className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By creating an account, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:text-blue-500">Terms of Service</a>
            {' '}and{' '}
            <a href="/privacy" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}