'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    // Check if coming from System.io
    const userId = searchParams?.get('userId');
    const authToken = searchParams?.get('authToken');
    
    if (userId || authToken) {
      setIsAuthorized(true);
      localStorage.setItem('ibam-auth', 'true');
    } else if (localStorage.getItem('ibam-auth') === 'true') {
      setIsAuthorized(true);
    }
  }, [searchParams]);

  // If not authorized, don't redirect - just show the dashboard anyway for System.io users
  if (!isAuthorized && typeof window !== 'undefined') {
    const fromSystemeIo = document.referrer.includes('ibam.org') || document.referrer.includes('systeme.io');
    if (fromSystemeIo) {
      setIsAuthorized(true);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">IBAM Learning Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5].map((moduleId) => (
            <Link
              key={moduleId}
              href={`/module/${moduleId}`}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2">Module {moduleId}</h2>
              <p className="text-gray-600">Click to access this module</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
