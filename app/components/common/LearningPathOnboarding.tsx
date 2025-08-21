'use client';
import { useState } from 'react';
import { BookOpen, Zap, ArrowRight, X } from 'lucide-react';

interface LearningPathOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: 'depth' | 'overview', mode: 'individual' | 'group') => void;
}

const LearningPathOnboarding: React.FC<LearningPathOnboardingProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const [selectedPath, setSelectedPath] = useState<'depth' | 'overview' | null>(null);
  const [selectedMode, setSelectedMode] = useState<'individual' | 'group' | null>(null);

  const handleSelect = () => {
    if (selectedPath && selectedMode) {
      onSelect(selectedPath, selectedMode);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Customize Your Learning Experience</h2>
              <p className="text-gray-600 mt-1">Choose your ideal learning path and environment</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Learning Path Section */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 Learning Depth</h3>
            <div className="space-y-4">
              {/* Depth Learning Option */}
              <div 
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  selectedPath === 'depth' 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPath('depth')}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    selectedPath === 'depth' 
                      ? 'border-teal-500 bg-teal-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedPath === 'depth' && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="w-5 h-5 text-teal-600" />
                      <h3 className="text-lg font-medium text-gray-900">
                        Depth Learning (Recommended)
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-3">
                      Deep dive into each session with comprehensive reading, reflection, and application. 
                      Perfect for building a strong foundation in faith-driven business principles.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                        Full Content
                      </span>
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                        Scripture Integration
                      </span>
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                        Action Planning
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overview Learning Option */}
              <div 
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  selectedPath === 'overview' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedPath('overview')}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    selectedPath === 'overview' 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedPath === 'overview' && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Zap className="w-5 h-5 text-blue-600" />
                      <h3 className="text-lg font-medium text-gray-900">
                        Quick Overview
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-3">
                      Streamlined content focused on key concepts and practical applications. 
                      Ideal for busy entrepreneurs who want efficient learning.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        Key Points
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        Quick Actions
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        Time Efficient
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Mode Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">👥 Learning Environment</h3>
            <div className="space-y-4">
              {/* Individual Learning Option */}
              <div 
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  selectedMode === 'individual' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedMode('individual')}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    selectedMode === 'individual' 
                      ? 'border-blue-500 bg-blue-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedMode === 'individual' && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">🧘‍♂️</span>
                      <h4 className="font-medium text-gray-900">Individual Focus</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Learn at your own pace with personal reflection and self-directed study.
                    </p>
                  </div>
                </div>
              </div>

              {/* Group Learning Option */}
              <div 
                className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                  selectedMode === 'group' 
                    ? 'border-purple-500 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedMode('group')}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    selectedMode === 'group' 
                      ? 'border-purple-500 bg-purple-500' 
                      : 'border-gray-300'
                  }`}>
                    {selectedMode === 'group' && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-lg">👥</span>
                      <h4 className="font-medium text-gray-900">Small Group</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Collaborative learning with discussions and shared insights from peers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              I'll choose later
            </button>
            <button
              onClick={handleSelect}
              disabled={!selectedPath || !selectedMode}
              className="bg-teal-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
            >
              <span>Start Learning</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPathOnboarding;