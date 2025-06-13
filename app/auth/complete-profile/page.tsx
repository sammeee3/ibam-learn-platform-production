'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CompleteProfile() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard for now
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Redirecting to dashboard...</div>
    </div>
  );
}
