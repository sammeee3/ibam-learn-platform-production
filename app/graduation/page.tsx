'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Award, 
  Star, 
  ChevronRight, 
  BookOpen, 
  Users, 
  Target, 
  Heart,
  Briefcase,
  Crown,
  Gift
} from 'lucide-react';

// IBAM Logo Component (matching your existing branding)
interface IBAMLogoProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
  style?: React.CSSProperties;
}

const IBAMLogo: React.FC<IBAMLogoProps> = ({
  size = 'medium',
  className = '',
  style = {}
}: IBAMLogoProps) => {
  const sizeMap = {
    small: { width: '24px', height: 'auto' },
    medium: { width: '40px', height: 'auto' },
    large: { width: '60px', height: 'auto' },
    xlarge: { width: '120px', height: 'auto' }
  };

  const logoFile = size === 'small' 
    ? '/images/branding/mini-logo.png'
    : '/images/branding/ibam-logo.png';

  return (
    <img
      src={logoFile}
      alt="IBAM Logo"
      className={className}
      style={{ ...sizeMap[size], ...style }}
      onError={(e) => {
        e.currentTarget.src = '/images/branding/ibam-logo.png';
      }}
    />
  );
};

export default function GraduationPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-blue-600 to-teal-500">
      {/* Header with IBAM branding */}
      <div className="bg-white/10 backdrop-blur border-b border-white/20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <IBAMLogo size="medium" className="mr-3" />
              <div className="text-white">
                <div className="font-semibold">International Business As Mission</div>
                <div className="text-sm text-white/80">Learning Platform</div>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="text-white/80 hover:text-white transition-colors text-sm flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Dashboard
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Main Celebration Header */}
          <div className="text-center mb-12">
            <div className="text-8xl mb-6">🎉</div>
            <h1 className="text-6xl font-bold text-white mb-4 leading-tight">
              Congratulations!
            </h1>
            <p className="text-2xl text-white/90 mb-6 leading-relaxed">
              You've completed the entire IBAM Learning Platform
            </p>
            <p className="text-xl text-white/80">
              You're now equipped to build a Faith-Driven business that multiplies disciples
            </p>
          </div>

          {/* Achievement Certificate Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-10 mb-8 max-w-4xl mx-auto relative overflow-hidden">
            {/* Decorative corner elements */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-br-full opacity-10"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-indigo-400 to-indigo-500 rounded-tl-full opacity-10"></div>
            
            <div className="text-center relative z-10">
              <div className="flex items-center justify-center mb-8">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 p-4 rounded-full shadow-lg">
                  <Crown className="w-16 h-16 text-white" />
                </div>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-800 mb-4">
                🎓 IBAM Graduate
              </h2>
              
              <div className="bg-gradient-to-r from-indigo-50 to-teal-50 rounded-xl p-6 mb-8">
                <p className="text-lg text-gray-700 leading-relaxed">
                  You have successfully completed <strong>all 5 modules</strong> and <strong>22 sessions</strong> 
                  of comprehensive biblical business training. You're now equipped with the knowledge, 
                  tools, and biblical foundation to build a business that honors God and multiplies disciples.
                </p>
              </div>
              
              {/* Completion Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="bg-blue-100 p-4 rounded-xl mb-2">
                    <BookOpen className="w-8 h-8 text-blue-600 mx-auto" />
                  </div>
                  <div className="text-3xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-gray-600">Modules Completed</div>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 p-4 rounded-xl mb-2">
                    <Target className="w-8 h-8 text-green-600 mx-auto" />
                  </div>
                  <div className="text-3xl font-bold text-green-600">22</div>
                  <div className="text-sm text-gray-600">Sessions Finished</div>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 p-4 rounded-xl mb-2">
                    <Star className="w-8 h-8 text-purple-600 mx-auto" />
                  </div>
                  <div className="text-3xl font-bold text-purple-600">100%</div>
                  <div className="text-sm text-gray-600">Course Complete</div>
                </div>
                <div className="text-center">
                  <div className="bg-teal-100 p-4 rounded-xl mb-2">
                    <Heart className="w-8 h-8 text-teal-600 mx-auto" />
                  </div>
                  <div className="text-3xl font-bold text-teal-600">∞</div>
                  <div className="text-sm text-gray-600">Lives to Impact</div>
                </div>
              </div>
            </div>
          </div>

          {/* What You've Accomplished */}
          <div className="bg-white/15 backdrop-blur rounded-2xl p-8 mb-8">
            <h3 className="text-3xl font-bold text-white mb-6 text-center">
              🌟 What You've Accomplished
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">📚</div>
                <h4 className="font-bold text-white mb-2">Biblical Foundation</h4>
                <p className="text-white/90 text-sm">
                  Learned biblical principles for marketplace ministry and business excellence
                </p>
              </div>
              <div className="bg-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h4 className="font-bold text-white mb-2">Marketing Mastery</h4>
                <p className="text-white/90 text-sm">
                  Mastered ethical marketing strategies that build genuine relationships
                </p>
              </div>
              <div className="bg-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">💰</div>
                <h4 className="font-bold text-white mb-2">Financial Stewardship</h4>
                <p className="text-white/90 text-sm">
                  Gained biblical financial management and sustainable business practices
                </p>
              </div>
              <div className="bg-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">📋</div>
                <h4 className="font-bold text-white mb-2">Strategic Planning</h4>
                <p className="text-white/90 text-sm">
                  Developed comprehensive business planning and implementation skills
                </p>
              </div>
              <div className="bg-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">🚀</div>
                <h4 className="font-bold text-white mb-2">Scaling Systems</h4>
                <p className="text-white/90 text-sm">
                  Built scalable business systems for sustainable growth and impact
                </p>
              </div>
              <div className="bg-white/20 rounded-xl p-6 text-center">
                <div className="text-4xl mb-3">❤️</div>
                <h4 className="font-bold text-white mb-2">Kingdom Impact</h4>
                <p className="text-white/90 text-sm">
                  Equipped to multiply disciples through marketplace relationships
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-white/20 to-white/10 backdrop-blur rounded-2xl p-8 mb-8">
            <h3 className="text-3xl font-bold text-white mb-6 text-center">
              🚀 Your Next Steps
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <Briefcase className="w-8 h-8 text-indigo-600 mr-3" />
                  <h4 className="text-xl font-bold text-gray-800">Launch Your Business</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Apply everything you've learned to start or scale your Faith-Driven business. 
                  Use the business planner to create your strategic roadmap.
                </p>
                <button
                  onClick={() => router.push('/business-planner')}
                  className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center"
                >
                  <Briefcase className="w-5 h-5 mr-2" />
                  Open Business Planner
                </button>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <Users className="w-8 h-8 text-teal-600 mr-3" />
                  <h4 className="text-xl font-bold text-gray-800">Multiply Disciples</h4>
                </div>
                <p className="text-gray-600 mb-4">
                  Share this training with others and help multiply followers of Jesus through 
                  marketplace ministry. Your business can be a discipleship platform.
                </p>
                <button
                  onClick={() => window.open('https://www.ibam.org', '_blank')}
                  className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center"
                >
                  <Gift className="w-5 h-5 mr-2" />
                  Share IBAM Training
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center justify-center px-8 py-4 bg-white text-indigo-600 rounded-xl font-bold hover:bg-gray-50 transition-colors text-lg shadow-lg"
            >
              <ArrowLeft className="w-6 h-6 mr-3" />
              Return to Dashboard
            </button>
            
            <button
              onClick={() => router.push('/modules/1')}
              className="flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors text-lg shadow-lg"
            >
              <BookOpen className="w-6 h-6 mr-3" />
              Review Modules
            </button>
          </div>

          {/* Scripture Footer */}
          <div className="bg-white/10 backdrop-blur rounded-xl p-8 text-center">
            <div className="text-2xl mb-4">📖</div>
            <blockquote className="text-xl text-white font-medium mb-4 italic">
              "Whatever you do, work heartily, as for the Lord and not for men, 
              knowing that from the Lord you will receive the inheritance as your reward. 
              You are serving the Lord Christ."
            </blockquote>
            <cite className="text-white/80 text-lg">— Colossians 3:23-24</cite>
          </div>
        </div>
      </div>

      {/* IBAM Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <IBAMLogo size="medium" className="mr-3" />
              <div className="text-sm">
                <p className="font-semibold">International Business As Mission</p>
                <p>© 2025 IBAM. Multiplying Followers of Jesus through marketplace entrepreneurship.</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <a 
                href="https://www.ibam.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300 transition-colors text-sm block"
              >
                www.ibam.org
              </a>
              <p className="text-gray-400 text-xs mt-1">
                Continue your Faith-Driven business journey
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}