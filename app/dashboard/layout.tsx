'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    if (searchParams) {
      const userId = searchParams.get('userId');
      
      if (userId) {
        // Auto-login with userId
        handleAutoLogin(userId);
      }
    }
  }, [searchParams]);
  
  async function handleAutoLogin(userId: string) {
    // Create a session for this user
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Force login with the userId
      window.location.href = `/auth/auto-login?userId=${userId}&redirect=/dashboard`;
    }
  }
  
  return <>{children}</>;
}
