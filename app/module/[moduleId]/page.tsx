// app/module/[moduleId]/page.tsx
// Updated for Next.js 15 compatibility

import { supabase } from '../../../lib/supabase';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ moduleId: string }>;
}

export default async function ModulePage({ params }: PageProps) {
  const { moduleId } = await params;
  
  // Fetch module data
  const { data: module } = await supabase
    .from('modules')
    .select('*')
    .eq('id', moduleId)
    .single();

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('module_id', moduleId)
    .order('session_number');

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Module Not Found</h1>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-500">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-500">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-blue-600">IBAM Learning Platform</h1>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
            <h1 className="text-3xl font-bold text-white mb-2">
              Module {module.id}: {module.title}
            </h1>
            <p className="text-white/90">{module.description}</p>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sessions</h2>
            <div className="space-y-4">
              {sessions?.map((session: any) => (
                <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Session {session.session_number}: {session.title}
                      </h3>
                      <p className="text-gray-600 mt-1">{session.description}</p>
                    </div>
                    <Link
                      href={`/module/${moduleId}/session/${session.id}`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Start Session
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
export const dynamic = 'force-dynamic';
