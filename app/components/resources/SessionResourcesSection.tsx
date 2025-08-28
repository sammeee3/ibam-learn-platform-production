// app/components/resources/SessionResourcesSection.tsx
'use client';

import { useState } from 'react';
import { Book, Star, ChevronDown, ChevronRight } from 'lucide-react';
import type { SessionData } from '../../lib/types';

interface SessionResourcesSectionProps {
  sessionData: SessionData;
}

const SessionResourcesSection: React.FC<SessionResourcesSectionProps> = ({ sessionData }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Debug: Log resources data in development
  if (process.env.NODE_ENV === 'development') {
    console.log('SessionResourcesSection - sessionData.resources:', sessionData.resources);
    console.log('SessionResourcesSection - Full sessionData:', sessionData);
  }

  // Show message if no resources available
  if (!sessionData.resources || (!sessionData.resources.books?.length && !sessionData.resources.websites?.length)) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div 
          className="bg-emerald-500 hover:bg-emerald-600 text-white p-6 cursor-pointer transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-3xl mr-4">📚</span>
              <div>
                <h3 className="text-2xl font-bold">Resources</h3>
                <p className="text-emerald-100">Further Learning</p>
              </div>
            </div>
            {isExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
          </div>
        </div>
        
        {isExpanded && (
          <div className="p-6 bg-emerald-50">
            <div className="text-center py-8">
              <p className="text-emerald-800 font-medium">Resources for this session are being updated.</p>
              <p className="text-emerald-600 text-sm mt-2">Please check back soon for comprehensive learning materials.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div 
        className="bg-emerald-500 hover:bg-emerald-600 text-white p-6 cursor-pointer transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-3xl mr-4">📚</span>
            <div>
              <h3 className="text-2xl font-bold">Resources</h3>
              <p className="text-emerald-100">Further Learning</p>
            </div>
          </div>
          {isExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-6 bg-emerald-50">
          <div className="bg-emerald-50 p-6 rounded-lg border-l-4 border-emerald-400">
            <h4 className="font-bold text-emerald-800 mb-3">📚 Additional Resources & Further Reading</h4>
            <div className="grid md:grid-cols-2 gap-6">
              {sessionData.resources.books && sessionData.resources.books.length > 0 && (
                <div className="bg-white p-4 rounded">
                  <h5 className="font-semibold mb-3 flex items-center">
                    <Book className="w-5 h-5 mr-2" />
                    📖 Recommended Books ({sessionData.resources.books.length})
                  </h5>
                  <div className="space-y-3">
                    {sessionData.resources.books.map((book, index) => (
                      <div key={index} className="border-l-4 border-blue-400 pl-3 py-2">
                        <div className="font-medium">{book.title}</div>
                        <div className="text-sm text-gray-600">by {book.author}</div>
                        {(book as any).description && (
                          <div className="text-xs text-gray-500 mt-1">{(book as any).description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {sessionData.resources.websites && sessionData.resources.websites.length > 0 && (
                <div className="bg-white p-4 rounded">
                  <h5 className="font-semibold mb-3 flex items-center">
                    <Star className="w-5 h-5 mr-2" />
                    🌐 Helpful Websites ({sessionData.resources.websites.length})
                  </h5>
                  <div className="space-y-3">
                    {sessionData.resources.websites.map((site, index) => (
                      <div key={index} className="border-l-4 border-green-400 pl-3 py-2">
                        <div className="font-medium">{site.title}</div>
                        {(site as any).description && (
                          <div className="text-xs text-gray-500 mt-1">{(site as any).description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sessionData.resources.videos && sessionData.resources.videos.length > 0 && (
                <div className="bg-white p-4 rounded">
                  <h5 className="font-semibold mb-3 flex items-center">
                    <span className="w-5 h-5 mr-2">🎥</span>
                    Videos ({sessionData.resources.videos.length})
                  </h5>
                  <div className="space-y-3">
                    {sessionData.resources.videos.map((video, index) => (
                      <div key={index} className="border-l-4 border-purple-400 pl-3 py-2">
                        <div className="font-medium">{video.title}</div>
                        {(video as any).description && (
                          <div className="text-xs text-gray-500 mt-1">{(video as any).description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sessionData.resources.downloads && sessionData.resources.downloads.length > 0 && (
                <div className="bg-white p-4 rounded">
                  <h5 className="font-semibold mb-3 flex items-center">
                    <span className="w-5 h-5 mr-2">📥</span>
                    Downloads ({sessionData.resources.downloads.length})
                  </h5>
                  <div className="space-y-3">
                    {sessionData.resources.downloads.map((download, index) => (
                      <div key={index} className="border-l-4 border-orange-400 pl-3 py-2">
                        <div className="font-medium">{download.title}</div>
                        {(download as any).description && (
                          <div className="text-xs text-gray-500 mt-1">{(download as any).description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionResourcesSection;