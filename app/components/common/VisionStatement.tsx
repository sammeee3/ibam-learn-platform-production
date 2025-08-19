'use client';

import React from 'react';

const VisionStatement: React.FC = () => {
  return (
    <div className="relative mb-6 bg-gradient-to-r from-teal-400 to-slate-700 rounded-2xl p-6 md:p-8 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent animate-pulse"></div>
      </div>
      
      <div className="relative z-10 text-center">
        <div className="text-3xl md:text-4xl mb-4 animate-pulse">✨</div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 leading-tight">
          Multiplying followers of Jesus through excellent, Faith-Driven businesses.
        </h2>
        <p className="text-teal-100 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
          Your journey of faith-driven entrepreneurship transforms lives and communities
        </p>
      </div>
    </div>
  );
};

export default VisionStatement;