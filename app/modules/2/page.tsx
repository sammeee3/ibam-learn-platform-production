'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Module2Redirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect directly to Session 1 - no need for module overview
    router.replace('/modules/2/sessions/1');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Taking you to Session 1...</p>
      </div>
    </div>
  );
}