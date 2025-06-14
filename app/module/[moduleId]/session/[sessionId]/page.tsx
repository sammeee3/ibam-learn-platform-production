'use client';

import { useParams } from 'next/navigation';

export default function SessionPage() {
  const params = useParams();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-600">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <h1 className="text-4xl font-bold text-blue-900 mb-4">
            Session: {params?.sessionId || "Loading..."}
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Module: {params?.moduleId || "Loading..."}
          </p>
        </div>
      </div>
    </div>
  );
}
