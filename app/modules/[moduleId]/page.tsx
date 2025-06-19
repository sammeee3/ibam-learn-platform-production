'use client';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BookOpen, Clock, CheckCircle, PlayCircle } from 'lucide-react';

export default function ModulePage({ params }: { params: { moduleId: string } }) {
  const router = useRouter();

  const moduleData = {
    '1': {
      title: 'Foundational Principles',
      description: 'Business as God\'s gift - Understanding how business can be a calling and mission field for faithful disciples.',
      sessions: [
        { id: '1', title: 'Business is a Good Gift from God', time: '15-20 min' },
        { id: '2', title: 'Business Leaders Work with Church Leaders', time: '15-20 min' },
        { id: '3', title: 'Integrity in Business Practices', time: '15-20 min' },
        { id: '4', title: 'Stewardship and Resource Management', time: '15-20 min' }
      ]
    }
  };

  const module = moduleData[params.moduleId as keyof typeof moduleData] || moduleData['1'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-blue-600 text-white py-8">
        <div className="max-w-4xl mx-auto px-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center text-white/80 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-full p-3">
              <BookOpen className="h-8 w-8" />
            </div>
            <div>
              <p className="text-white/80 text-sm font-medium">Module {params.moduleId}</p>
              <h1 className="text-3xl md:text-4xl font-bold">{module.title}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Module Overview */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Module Overview</h2>
          <p className="text-lg text-gray-700 mb-6">{module.description}</p>
        </div>

        {/* Sessions List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Course Sessions</h2>
          
          <div className="space-y-4">
            {module.sessions.map((session, index) => (
              <div
                key={session.id}
                onClick={() => router.push(`/modules/${params.moduleId}/sessions/${session.id}`)}
                className="border rounded-xl p-4 hover:border-teal-300 hover:shadow-md cursor-pointer transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <PlayCircle className="h-5 w-5 text-teal-500" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Session {session.id}: {session.title}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-600">
                      {session.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
