'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">IBAM Learning Platform</h1>
          <button 
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>
      
      <div className="container mx-auto p-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-3xl font-bold mb-4">Welcome to Your Learning Journey!</h2>
          <p className="text-gray-600 mb-6">
            Welcome, {user?.email}! You're now part of the IBAM community focused on 
            marketplace discipleship and Kingdom-impact business building.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">📚 Biblical Foundations for Business</h3>
              <p className="text-gray-600 mb-4">
                Learn how to integrate biblical principles into your business practices.
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Start Course
              </button>
            </div>
            
            <div className="border rounded-lg p-4">
              <h3 className="text-xl font-semibold mb-2">🎯 Business Planner</h3>
              <p className="text-gray-600 mb-4">
                AI-powered business planning tool with Kingdom focus.
              </p>
              <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                Open Planner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
