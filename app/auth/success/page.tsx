'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Get email from cookie and set in localStorage
    const cookies = document.cookie.split(';');
    const authCookie = cookies.find(c => c.trim().startsWith('ibam_auth_server='));
    
    if (authCookie) {
      const email = authCookie.split('=')[1];
      localStorage.setItem('ibam-auth-email', email);
      console.log('✅ Email set in localStorage:', email);
      
      // Redirect to dashboard after a brief moment
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } else {
      console.log('❌ No auth cookie found');
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <div style={{ 
      padding: '40px', 
      textAlign: 'center', 
      fontFamily: 'Arial',
      background: 'linear-gradient(to right, #14b8a6, #475569)',
      color: 'white',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          🎉 Login Successful!
        </h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>
          Redirecting to your dashboard...
        </p>
      </div>
    </div>
  );
}