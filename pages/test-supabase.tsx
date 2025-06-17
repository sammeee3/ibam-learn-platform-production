// pages/test-supabase.tsx
// Simple test page to diagnose Supabase connection issues

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function TestSupabase() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    runTests();
  }, []);

  const addResult = (test: string, status: 'success' | 'error' | 'info', message: string, details?: any) => {
    setResults(prev => [...prev, { test, status, message, details, timestamp: new Date().toISOString() }]);
  };

  const runTests = async () => {
    setResults([]);
    setLoading(true);

    // Test 1: Environment Variables
    addResult('Environment Variables', 'info', 'Checking environment variables...');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl) {
      addResult('Environment Variables', 'error', 'NEXT_PUBLIC_SUPABASE_URL is missing');
    } else {
      addResult('Environment Variables', 'success', `NEXT_PUBLIC_SUPABASE_URL found: ${supabaseUrl.substring(0, 30)}...`);
    }
    
    if (!supabaseKey) {
      addResult('Environment Variables', 'error', 'NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
    } else {
      addResult('Environment Variables', 'success', `NEXT_PUBLIC_SUPABASE_ANON_KEY found: ${supabaseKey.substring(0, 20)}...`);
    }

    // Test 2: Supabase Client Creation
    addResult('Client Creation', 'info', 'Testing Supabase client creation...');
    
    try {
      if (supabaseUrl && supabaseKey) {
        addResult('Client Creation', 'success', 'Supabase client created successfully');
      } else {
        addResult('Client Creation', 'error', 'Cannot create client due to missing environment variables');
        setLoading(false);
        return;
      }
    } catch (error) {
      addResult('Client Creation', 'error', `Failed to create Supabase client: ${error}`);
      setLoading(false);
      return;
    }

    // Test 3: Network Connection
    addResult('Network Connection', 'info', 'Testing network connection to Supabase...');
    
    try {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        addResult('Network Connection', 'error', `Network error: ${error.message}`, error);
      } else {
        addResult('Network Connection', 'success', 'Successfully connected to Supabase');
      }
    } catch (error) {
      addResult('Network Connection', 'error', `Network connection failed: ${error}`, error);
    }

    // Test 4: Database Connection
    addResult('Database Connection', 'info', 'Testing database connection...');
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('count')
        .limit(1);
      
      if (error) {
        addResult('Database Connection', 'error', `Database error: ${error.message}`, error);
      } else {
        addResult('Database Connection', 'success', 'Database connection successful');
      }
    } catch (error) {
      addResult('Database Connection', 'error', `Database connection failed: ${error}`, error);
    }

    // Test 5: Authentication Service
    addResult('Authentication Service', 'info', 'Testing authentication service...');
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: `test-${Date.now()}@example.com`,
        password: 'test-password-123',
      });
      
      if (error) {
        if (error.message.includes('User already registered') || error.message.includes('only production')) {
          addResult('Authentication Service', 'success', 'Authentication service is working (test signup blocked as expected)');
        } else {
          addResult('Authentication Service', 'error', `Auth service error: ${error.message}`, error);
        }
      } else {
        addResult('Authentication Service', 'success', 'Authentication service is working');
      }
    } catch (error) {
      addResult('Authentication Service', 'error', `Auth service failed: ${error}`, error);
    }

    // Test 6: Email Configuration
    addResult('Email Configuration', 'info', 'Testing email configuration...');
    
    try {
      // This will test if email service is configured
      const { error } = await supabase.auth.resetPasswordForEmail('test@example.com');
      
      if (error) {
        addResult('Email Configuration', 'error', `Email service error: ${error.message}`, error);
      } else {
        addResult('Email Configuration', 'success', 'Email service is configured');
      }
    } catch (error) {
      addResult('Email Configuration', 'error', `Email service failed: ${error}`, error);
    }

    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-50 border-green-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '○';
    }
  };

  const copyResults = () => {
    const text = results.map(r => `${getStatusIcon(r.status)} ${r.test}: ${r.message}`).join('\n');
    navigator.clipboard.writeText(text);
    alert('Test results copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              🔍 Supabase Connection Diagnostic
            </h1>
            <div className="flex space-x-2">
              <button
                onClick={runTests}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Testing...' : 'Run Tests Again'}
              </button>
              <button
                onClick={copyResults}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Copy Results
              </button>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3">System Information</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Environment:</strong> {process.env.NODE_ENV}
              </div>
              <div>
                <strong>Vercel Environment:</strong> {process.env.VERCEL_ENV || 'Not Vercel'}
              </div>
              <div>
                <strong>URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'SSR'}
              </div>
              <div>
                <strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent.substring(0, 50) + '...' : 'SSR'}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Test Results</h2>
            
            {loading && (
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Running diagnostic tests...</span>
              </div>
            )}

            {results.map((result, index) => (
              <div
                key={index}
                className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg">{getStatusIcon(result.status)}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{result.test}</h3>
                      <span className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="mt-1">{result.message}</p>
                    {result.details && (
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm underline">
                          Show details
                        </summary>
                        <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!loading && results.length > 0 && (
            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-medium mb-2">Next Steps:</h3>
              <div className="text-sm space-y-1">
                {results.some(r => r.status === 'error' && r.test === 'Environment Variables') && (
                  <p>🔧 Fix environment variables in Vercel dashboard first</p>
                )}
                {results.some(r => r.status === 'error' && r.test === 'Network Connection') && (
                  <p>🌐 Check Supabase project status and API endpoints</p>
                )}
                {results.some(r => r.status === 'error' && r.test === 'Database Connection') && (
                  <p>🗄️ Verify database schema and permissions</p>
                )}
                {results.some(r => r.status === 'error' && r.test === 'Authentication Service') && (
                  <p>🔐 Check authentication settings in Supabase dashboard</p>
                )}
                {results.some(r => r.status === 'error' && r.test === 'Email Configuration') && (
                  <p>📧 Configure email settings and check spam folder</p>
                )}
                {results.every(r => r.status === 'success') && (
                  <p className="text-green-600">✅ All tests passed! Your authentication should be working.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}