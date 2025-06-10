javascript
"use client";

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, CheckCircle, Circle, BookOpen, Target, Lightbulb, Heart, ArrowRight, Clock, Users } from 'lucide-react';

const Session11Component = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [reflectionAnswers, setReflectionAnswers] = useState({});

  const sections = [
    {
      id: 'welcome',
      title: 'Welcome to Your Journey',
      icon: <Heart className="w-6 h-6" />,
      type: 'intro'
    },
    {
      id: 'objectives',
      title: 'Learning Objectives',
      icon: <Target className="w-6 h-6" />,
      type: 'objectives'
    },
    {
      id: 'video',
      title: 'Core Teaching',
      icon: <Play className="w-6 h-6" />,
      type: 'video'
    },
    {
      id: 'principles',
      title: 'Biblical Principles',
      icon: <BookOpen className="w-6 h-6" />,
      type: 'content'
    },
    {
      id: 'reflection',
      title: 'Personal Reflection',
      icon: <Lightbulb className="w-6 h-6" />,
      type: 'interactive'
    },
    {
      id: 'application',
      title: 'Practical Application',
      icon: <CheckCircle className="w-6 h-6" />,
      type: 'application'
    }
  ];

  const markSectionComplete = (sectionIndex) => {
    setCompletedSections(prev => new Set([...prev, sectionIndex]));
  };

  const goToNextSection = () => {
    if (currentSection < sections.length - 1) {
      markSectionComplete(currentSection);
      setCurrentSection(currentSection + 1);
    }
  };

  const goToPreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleReflectionChange = (question, answer) => {
    setReflectionAnswers(prev => ({
      ...prev,
      [question]: answer
    }));
  };

  const renderWelcomeSection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Business is a Good Gift from God
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Discover how God designed business as a vehicle for His purposes and your calling to multiply disciples through the marketplace.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <Clock className="w-8 h-8 text-blue-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Session Length</h3>
          <p className="text-gray-600">15-20 minutes</p>
        </div>
        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
          <Users className="w-8 h-8 text-green-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Module 1 of 5</h3>
          <p className="text-gray-600">Foundational Principles</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
          <Target className="w-8 h-8 text-purple-600 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Session 1.1</h3>
          <p className="text-gray-600">Biblical Business Foundation</p>
        </div>
      </div>
    </div>
  );

  const renderObjectivesSection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full mb-6">
          <Target className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          What You'll Learn Today
        </h2>
      </div>

      <div className="grid gap-4">
        {[
          {
            title: "God's Original Design for Business",
            description: "Understand how business was part of God's plan from the beginning",
            verse: "Genesis 1:28"
          },
          {
            title: "Business as Kingdom Work",
            description: "See how your business can advance God's kingdom purposes",
            verse: "Colossians 3:23"
          },
          {
            title: "Stewardship and Multiplication",
            description: "Learn your role as a faithful steward of God's resources",
            verse: "Matthew 25:21"
          },
          {
            title: "Faith-Driven Business Principles",
            description: "Apply biblical principles to your business practices",
            verse: "Proverbs 16:3"
          }
        ].map((objective, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2">{objective.title}</h3>
                <p className="text-gray-600 mb-2">{objective.description}</p>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-200">
                  📖 {objective.verse}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVideoSection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full mb-6">
          <Play className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Core Teaching with Jeff
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Watch as Jeff shares 15 years of proven experience in biblical business principles
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video">
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
              className="flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all backdrop-blur-sm"
            >
              {isVideoPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </button>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-black bg-opacity-50 rounded-lg p-3 text-white">
              <p className="text-sm font-medium">Business is a Good Gift from God</p>
              <p className="text-xs opacity-80">Duration: 12:34 • Jeff's Teaching Series</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Key Teaching Points</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Genesis 1:28 - The cultural mandate for business</li>
                <li>• How entrepreneurship reflects God's creative nature</li>
                <li>• Business as a platform for discipleship multiplication</li>
                <li>• Stewardship principles for faithful business management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrinciplesSection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full mb-6">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Biblical Business Principles
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {[
          {
            title: "God's Creative Nature",
            verse: "Genesis 1:1",
            principle: "As image bearers, we are called to create value and solutions through business",
            application: "Your business ideas reflect God's creativity working through you"
          },
          {
            title: "The Cultural Mandate",
            verse: "Genesis 1:28",
            principle: "God commanded humanity to subdue and steward creation",
            application: "Business is a primary way we fulfill this divine calling"
          },
          {
            title: "Faithful Stewardship",
            verse: "Matthew 25:14-30",
            principle: "We are entrusted with resources to multiply for His kingdom",
            application: "Profits should be reinvested in kingdom purposes and discipleship"
          },
          {
            title: "Excellence in Work",
            verse: "Colossians 3:23",
            principle: "Whatever we do, work heartily as for the Lord",
            application: "Quality products and services honor God and attract others to Him"
          }
        ].map((principle, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="mb-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-50 text-indigo-700 border border-indigo-200 mb-3">
                📖 {principle.verse}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{principle.title}</h3>
            </div>
            <p className="text-gray-700 mb-4 font-medium">{principle.principle}</p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium text-gray-800">Application: </span>
                {principle.application}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReflectionSection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full mb-6">
          <Lightbulb className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Personal Reflection
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Take a moment to reflect on how these principles apply to your business journey
        </p>
      </div>

      <div className="space-y-6">
        {[
          {
            question: "How do you currently see God's hand in your business or business ideas?",
            placeholder: "Reflect on specific ways you've seen God's guidance, provision, or blessing..."
          },
          {
            question: "What specific ways could your business multiply disciples and advance God's kingdom?",
            placeholder: "Think about your customer relationships, employee discipleship, community impact..."
          },
          {
            question: "What areas of your business need to be surrendered more fully to God's purposes?",
            placeholder: "Consider financial decisions, hiring practices, business partnerships..."
          }
        ].map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-3">{item.question}</h3>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows="4"
              placeholder={item.placeholder}
              value={reflectionAnswers[item.question] || ''}
              onChange={(e) => handleReflectionChange(item.question, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
        <div className="flex items-start space-x-3">
          <Heart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">Remember</h4>
            <p className="text-blue-800">
              This is a journey of faith. God is not looking for perfection but for hearts willing to be shaped by His purposes. 
              Be honest in your reflections and trust the Holy Spirit to guide your business decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApplicationSection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Take Action This Week
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto">
          Transform today's learning into practical steps for your business
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">This Week's Actions</h3>
          {[
            {
              action: "Pray over your business",
              detail: "Spend 15 minutes asking God to reveal His purposes for your business",
              days: "Days 1-2"
            },
            {
              action: "Review your business practices",
              detail: "Identify one area where you can better align with biblical principles",
              days: "Days 3-4"
            },
            {
              action: "Share your vision",
              detail: "Tell someone about how God might use your business for His kingdom",
              days: "Days 5-7"
            }
          ].map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-green-600">{index + 1}</span>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium text-gray-900">{item.action}</h4>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{item.days}</span>
                  </div>
                  <p className="text-sm text-gray-600">{item.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-6 rounded-xl border border-purple-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Next Session Preview</h3>
          <div className="space-y-3">
            <h4 className="font-medium text-purple-900">Session 1.2: Business Leaders Work Together with Church Leaders</h4>
            <p className="text-purple-800 text-sm">
              Discover the powerful synergy between marketplace and ministry leadership, and how they can work together to multiply disciples.
            </p>
            <div className="flex items-center space-x-2 text-sm text-purple-700">
              <Clock className="w-4 h-4" />
              <span>15 minutes • Video + Interactive Elements</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
          Complete Session & Continue
          <ArrowRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );

  const renderCurrentSection = () => {
    switch (sections[currentSection].id) {
      case 'welcome': return renderWelcomeSection();
      case 'objectives': return renderObjectivesSection();
      case 'video': return renderVideoSection();
      case 'principles': return renderPrinciplesSection();
      case 'reflection': return renderReflectionSection();
      case 'application': return renderApplicationSection();
      default: return renderWelcomeSection();
    }
  };

  const progressPercentage = ((currentSection + 1) / sections.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Progress */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Module 1: Foundational Principles</h1>
                <p className="text-sm text-gray-500">Session 1.1 • Business is a Good Gift from God</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{Math.round(progressPercentage)}% Complete</p>
                <p className="text-xs text-gray-500">Section {currentSection + 1} of {sections.length}</p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => setCurrentSection(index)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  index === currentSection
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : completedSections.has(index)
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {completedSections.has(index) ? (
                  <CheckCircle className="w-4 h-4" />
                ) : index === currentSection ? (
                  React.cloneElement(section.icon, { className: "w-4 h-4" })
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                <span>{section.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {renderCurrentSection()}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousSection}
              disabled={currentSection === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentSection === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex space-x-2">
              {sections.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSection
                      ? 'bg-blue-600'
                      : completedSections.has(index)
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={goToNextSection}
              disabled={currentSection === sections.length - 1}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                currentSection === sections.length - 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-white bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Session11Component;