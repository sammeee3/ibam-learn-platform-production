// app/components/scripture/EnhancedScriptureReference.tsx
'use client';

import { useState, useRef } from 'react';
import { BookOpen } from 'lucide-react';
import { enhancedBibleReferences } from '../../lib/constants';

interface EnhancedScriptureReferenceProps {
  reference: string;
  children?: React.ReactNode;
}

const EnhancedScriptureReference: React.FC<EnhancedScriptureReferenceProps> = ({ 
  reference, 
  children 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
  const elementRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = (e: React.MouseEvent) => {
    setIsHovered(true);
    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      setPopupPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    }
  };

  const verseText = enhancedBibleReferences[reference];

  return (
    <>
      <span
        ref={elementRef}
        className="relative inline-block cursor-pointer text-blue-600 font-semibold border-b-2 border-dotted border-blue-400 hover:text-blue-800 hover:border-blue-600 transition-all duration-200 px-1 py-0.5 rounded"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: isHovered ? 'linear-gradient(135deg, #EBF8FF 0%, #BEE3F8 100%)' : 'transparent'
        }}
      >
        {children || reference}
      </span>
      
      {isHovered && verseText && (
        <div 
          className="fixed z-50 transform -translate-x-1/2 -translate-y-full mb-2"
          style={{ 
            left: popupPosition.x,
            top: popupPosition.y,
            maxWidth: '400px'
          }}
        >
          <div className="bg-white border-2 border-blue-200 rounded-xl shadow-2xl p-6 relative">
            <div className="flex items-center mb-3 pb-2 border-b border-blue-100">
              <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
              <div className="font-bold text-blue-800 text-lg">{reference}</div>
            </div>
            <div className="text-gray-700 leading-relaxed italic text-base">
              "{verseText}"
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-blue-200"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default EnhancedScriptureReference;