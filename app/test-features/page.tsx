'use client';
import { useState, useEffect } from 'react';

export default function TestFeatures() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Get email from localStorage
    const email = localStorage.getItem('ibam-auth-email');
    setUserEmail(email);
    
    // Fetch profile if email exists
    if (email) {
      fetch(`/api/user/profile?email=${encodeURIComponent(email)}`)
        .then(res => res.json())
        .then(profile => {
          setUserProfile(profile);
          console.log('Profile loaded:', profile);
        })
        .catch(err => console.error('Error:', err));
    }
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🧪 Feature Test Page</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <h2>🔍 Debug Info:</h2>
        <p><strong>Email in localStorage:</strong> {userEmail || 'None'}</p>
        <p><strong>Profile loaded:</strong> {userProfile ? 'Yes' : 'No'}</p>
      </div>

      {userProfile && (
        <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <h2>👤 User Profile:</h2>
          <p><strong>Name:</strong> {userProfile.first_name} {userProfile.last_name}</p>
          <p><strong>Email:</strong> {userProfile.email}</p>
          <p><strong>Login Source:</strong> {userProfile.login_source}</p>
        </div>
      )}

      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>🎯 Header Test:</h2>
        <h1 style={{ color: 'teal' }}>
          Welcome Back, Entrepreneur{userProfile?.first_name ? `, ${userProfile.first_name}` : ''}!
        </h1>
      </div>

      <div style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
        <h2>📋 Menu Test:</h2>
        <p><strong>User Type:</strong> {userProfile?.login_source === 'systemio' ? 'System.io User' : 'Direct User'}</p>
        <p><strong>Should show:</strong></p>
        <ul>
          <li>Downloads ✅</li>
          {userProfile?.login_source !== 'systemio' && (
            <>
              <li>Account ✅</li>
              <li>Settings ✅</li>
            </>
          )}
          <li>Help ✅</li>
        </ul>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h2>🔗 Test Links:</h2>
        <p><a href="/api/auth/sso?email=demo-user@test.com&token=ibam-systeme-secret-2025">Login as System.io User (John Demo)</a></p>
        <p><a href="/dashboard">Go to Dashboard</a></p>
      </div>
    </div>
  );
}