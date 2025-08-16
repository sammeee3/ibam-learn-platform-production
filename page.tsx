'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TestMagicLink() {
  const [email, setEmail] = useState('jsamuelson@ibam.org');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const testMagicLink = async () => {
    setLoading(true);
    setStatus('Sending magic link...');
    
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        setStatus(`❌ Error: ${error.message}`);
      } else {
        setStatus(`✅ Magic link sent! Check your email (${email})`);
      }
    } catch (err) {
      setStatus(`❌ Error: ${err}`);
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: '50px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🧪 Magic Link Test</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '10px', 
            fontSize: '16px',
            marginTop: '5px'
          }}
        />
      </div>
      
      <button 
        onClick={testMagicLink}
        disabled={loading}
        style={{ 
          padding: '10px 20px', 
          fontSize: '16px',
          backgroundColor: loading ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Sending...' : 'Send Magic Link'}
      </button>
      
      <div style={{ 
        marginTop: '20px', 
        padding: '20px', 
        backgroundColor: '#f5f5f5',
        borderRadius: '5px'
      }}>
        <strong>Status:</strong> {status || 'Ready to test'}
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3>What to check:</h3>
        <ol>
          <li>Click "Send Magic Link"</li>
          <li>Check your email inbox (and spam)</li>
          <li>The email should have a link</li>
          <li>Click the link - you should go to dashboard</li>
        </ol>
      </div>
    </div>
  );
}
