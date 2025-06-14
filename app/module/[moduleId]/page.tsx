'use client';

import { useParams } from 'next/navigation';

export default function ModulePage() {
  const params = useParams();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Module: {params?.moduleId || "Loading..."}
          </h1>
        </div>
      </div>
    </div>
  );
}

export const dynamic = 'force-dynamic';
