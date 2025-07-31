'use client';

import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

// ENHANCED VIMEO VIDEO COMPONENT
const VimeoVideo = ({ url, title }: { url: string; title: string }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  console.log(`🎥 VimeoVideo Component - ${title}:`, url);

  // Extract video ID and hash from various Vimeo URL formats
  const extractVimeoData = (vimeoUrl: string): { videoId: string; hash?: string } | null => {
    console.log('🔗 Processing Vimeo URL:', vimeoUrl);
    
    if (!vimeoUrl) {
      console.log('❌ No URL provided');
      return null;
    }
    
    // Handle different Vimeo URL formats
    const patterns = [
      { regex: /vimeo\.com\/(\d+)\/([\w\d]+)/, hasHash: true },  // with hash first (private videos)
      { regex: /vimeo\.com\/(\d+)/, hasHash: false },
      { regex: /player\.vimeo\.com\/video\/(\d+)/, hasHash: false },
      { regex: /vimeo\.com\/video\/(\d+)/, hasHash: false }
    ];

    for (const pattern of patterns) {
      const match = vimeoUrl.match(pattern.regex);
      if (match && match[1]) {
        const result = {
          videoId: match[1],
          hash: pattern.hasHash && match[2] ? match[2] : undefined
        };
        console.log('✅ Extracted video data:', result);
        return result;
      }
    }
    
    console.log('❌ Failed to match Vimeo URL pattern');
    return null;
  };

  const vimeoData = extractVimeoData(url);

  // If we can't extract video data, show error state
  if (!vimeoData || !vimeoData.videoId) {
    console.log('🚨 Video Configuration Error for:', title);
    return (
      <div className="relative w-full bg-red-100 border-2 border-red-300 rounded-lg" style={{ paddingBottom: '56.25%' }}>
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-red-700">
          <div className="text-center p-4">
            <AlertCircle className="w-16 h-16 mx-auto mb-4" />
            <p className="font-semibold text-lg mb-2">Video Configuration Error</p>
            <p className="text-sm mb-2">Could not load video from: {url}</p>
          </div>
        </div>
      </div>
    );
  }

  // Create proper Vimeo embed URL with hash if available (for private videos)
  const embedUrl = vimeoData.hash 
    ? `https://player.vimeo.com/video/${vimeoData.videoId}?h=${vimeoData.hash}&badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0`
    : `https://player.vimeo.com/video/${vimeoData.videoId}?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0`;
    
  if (vimeoData.hash) {
    console.log('🔐 Private video detected - using hash:', vimeoData.hash);
  }
  console.log('✅ Generated embed URL:', embedUrl);

  return (
    <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden shadow-lg" style={{ paddingBottom: '56.25%' }}>
      {/* Loading state */}
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 text-white z-10">
          <div className="text-center">
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
            <p className="font-semibold">Loading {title}...</p>
          </div>
        </div>
      )}
      
      {/* Error state */}
      {hasError && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-red-100 text-red-700 z-10">
          <div className="text-center p-4">
            <AlertCircle className="w-12 h-12 mx-auto mb-4" />
            <p className="font-semibold">Failed to Load Video</p>
            <p className="text-sm">Please check your internet connection</p>
            <button 
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
              }}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Vimeo iframe */}
      <iframe
        src={embedUrl}
        className="absolute top-0 left-0 w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        title={title}
        loading="lazy"
        onLoad={() => {
          console.log('✅ Video loaded successfully');
          setIsLoading(false);
        }}
        onError={() => {
          console.log('❌ Video failed to load');
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
};

export { VimeoVideo };
