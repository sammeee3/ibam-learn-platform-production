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
              <div className="bg-white p-4 rounded">
                <h5 className="font-semibold mb-3 flex items-center">
                  <Book className="w-5 h-5 mr-2" />
                  📖 Recommended Books
                </h5>
                <div className="space-y-3">
                  {(sessionData.resources?.books || [
                    { title: "Business for the Glory of God", author: "Wayne Grudem", url: "https://example.com/book1" },
                    { title: "The Purpose Driven Life", author: "Rick Warren", url: "https://example.com/book2" }
                  ]).map((book, index) => (
                    <div key={index} className="border-l-4 border-blue-400 pl-3 py-2">
                      <div className="font-medium">{book.title}</div>
                      <div className="text-sm text-gray-600">by {book.author}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white p-4 rounded">
                <h5 className="font-semibold mb-3 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  🌐 Helpful Websites
                </h5>
                <div className="space-y-3">
                  {(sessionData.resources?.websites || [
                    { title: "IBAM Resource Center", url: "https://ibam.org/resources" },
                    { title: "Faith-Driven Business Network", url: "https://faithdrivenbusiness.org" }
                  ]).map((site, index) => (
                    <div key={index} className="border-l-4 border-green-400 pl-3 py-2">
                      <div className="font-medium">{site.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionResourcesSection;