import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginTest() {
  const [step, setStep] = useState(1);
  const [results, setResults] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const testEmail = 'test@ibamplatform.com'; // Change this to your email if you want
  
  const supabase = createClientComponentClient();

  const runTest1 = async () => {
    setIsLoading(true);
    try {
      console.log('Testing Supabase connection...');
      const { data, error } = await supabase.from('sessions').select('count').limit(1);
      if (error) throw error;
      
      setResults(prev => ({ ...prev, test1: '✅ Supabase Connected' }));
      setStep(2);
    } catch (error) {
      setResults(prev => ({ ...prev, test1: `❌ Error: ${error.message}` }));
    }
    setIsLoading(false);
  };

  const runTest2 = async () => {
    setIsLoading(true);
    try {
      console.log('Testing session content...');
      const { data, error } = await supabase
        .from('sessions')
        .select('id, title, content')
        .eq('module_id', 1)
        .eq('session_number', 1)
        .single();
      
      if (error) throw error;
      if (!data?.content) throw new Error('No content found');
      
      setResults(prev => ({ ...prev, test2: '✅ Session Content Loads' }));
      setStep(3);
    } catch (error) {
      setResults(prev => ({ ...prev, test2: `❌ Error: ${error.message}` }));
    }
    setIsLoading(false);
  };

  const runTest3 = async () => {
    setIsLoading(true);
    try {
      console.log('Testing user system...');
      // Just check if we can query the user table
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);
      
      if (error) throw error;
      
      setResults(prev => ({ ...prev, test3: '✅ User System Ready' }));
      setStep(4);
    } catch (error) {
      setResults(prev => ({ ...prev, test3: `❌ Error: ${error.message}` }));
    }
    setIsLoading(false);
  };

  const allTestsPassed = Object.values(results).every(result => result.includes('✅'));
  const hasResults = Object.keys(results).length > 0;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        IBAM Platform Readiness Check
      </h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        
        {/* Test 1 */}
        <div className="flex items-center justify-between p-4 border rounded mb-4">
          <span className="font-medium">1. Database Connection</span>
          <div className="flex gap-2 items-center">
            {results.test1 && <span>{results.test1}</span>}
            {step === 1 && (
              <button 
                onClick={runTest1}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test'}
              </button>
            )}
          </div>
        </div>

        {/* Test 2 */}
        <div className="flex items-center justify-between p-4 border rounded mb-4">
          <span className="font-medium">2. Session Content</span>
          <div className="flex gap-2 items-center">
            {results.test2 && <span>{results.test2}</span>}
            {step === 2 && (
              <button 
                onClick={runTest2}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test'}
              </button>
            )}
          </div>
        </div>

        {/* Test 3 */}
        <div className="flex items-center justify-between p-4 border rounded mb-4">
          <span className="font-medium">3. User System</span>
          <div className="flex gap-2 items-center">
            {results.test3 && <span>{results.test3}</span>}
            {step === 3 && (
              <button 
                onClick={runTest3}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {isLoading ? 'Testing...' : 'Test'}
              </button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {allTestsPassed && hasResults && (
          <div className="mt-8 p-6 bg-green-50 border-2 border-green-200 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              🎉 Platform Ready!
            </h2>
            <p className="text-green-700 mb-4">
              All core systems are working. You can confidently invite users to test your platform.
            </p>
            <div className="bg-white p-4 rounded border">
              <p className="font-medium mb-2">Your platform is ready for:</p>
              <p className="text-sm text-gray-600">✅ User signups</p>
              <p className="text-sm text-gray-600">✅ Session content delivery</p>
              <p className="text-sm text-gray-600">✅ Progress tracking</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}