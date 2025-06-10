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
    <div className="space-y-10">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-8">
          <Heart className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Business is a Good Gift from God
        </h1>
        <p className="text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Discover how God designed business as a vehicle for His purposes and your calling to multiply disciples through the marketplace.
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-blue-50 p-8 rounded-xl border border-blue-100">
          <Clock className="w-10 h-10 text-blue-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Session Length</h3>
          <p className="text-base text-gray-600">15-20 minutes</p>
        </div>
        <div className="bg-green-50 p-8 rounded-xl border border-green-100">
          <Users className="w-10 h-10 text-green-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Module 1 of 5</h3>
          <p className="text-base text-gray-600">Foundational Principles</p>
        </div>
        <div className="bg-purple-50 p-8 rounded-xl border border-purple-100">
          <Target className="w-10 h-10 text-purple-600 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Session 1.1</h3>
          <p className="text-base text-gray-600">Biblical Business Foundation</p>
        </div>
      </div>
    </div>
  );

  const renderObjectivesSection = () => (
    <div className="space-y-10">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-full mb-8">
          <Target className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          What You'll Learn Today
        </h2>
      </div>

      <div className="grid gap-6">
        {[
          {
            title: "God's Original Design for Business",
            description: "Understand how business was part of God's plan from the beginning",
            verse: "Genesis 1:28",
            verseText: "God blessed them and said to them, 'Be fruitful and increase in number; fill the earth and subdue it. Rule over the fish in the sea and the birds in the sky and over every living creature that moves on the ground.'"
          },
          {
            title: "Business as Kingdom Work",
            description: "See how your business can advance God's kingdom purposes",
            verse: "Colossians 3:23",
            verseText: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters."
          },
          {
            title: "Stewardship and Multiplication",
            description: "Learn your role as a faithful steward of God's resources",
            verse: "Matthew 25:21",
            verseText: "His master replied, 'Well done, good and faithful servant! You have been faithful with a few things; I will put you in charge of many things. Come and share your master's happiness!'"
          },
          {
            title: "Faith-Driven Business Principles",
            description: "Apply biblical principles to your business practices",
            verse: "Proverbs 16:3",
            verseText: "Commit to the Lord whatever you do, and he will establish your plans."
          }
        ].map((objective, index) => (
          <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-blue-600">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-3">{objective.title}</h3>
                <p className="text-lg text-gray-700 mb-4 leading-relaxed">{objective.description}</p>
                <div className="relative group cursor-pointer inline-block">
                  <span className="inline-flex items-center px-4 py-2 rounded-full text-base bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors">
                    📖 {objective.verse}
                  </span>
                  <div className="absolute bottom-full left-0 mb-3 px-4 py-3 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 max-w-sm">
                    "{objective.verseText}"
                  </div>
                </div>
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
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full mb-6">
          <Play className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Core Teaching with Jeff
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Watch as Jeff shares 15 years of proven experience in biblical business principles
        </p>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="relative rounded-xl overflow-hidden aspect-video shadow-2xl">
          <iframe
            src="https://player.vimeo.com/video/491439739?h=02b67849d&badge=0&autopause=0&player_id=0&app_id=58479"
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title="Business is a Good Gift from God"
          ></iframe>
        </div>

        <div className="mt-8 bg-blue-50 p-6 rounded-xl border border-blue-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Key Teaching Points</h4>
              <ul className="text-base text-blue-800 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span className="relative group cursor-pointer hover:text-blue-900 transition-colors">
                    Genesis 1:28 - The cultural mandate for business
                    <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                      "God blessed them and said to them, 'Be fruitful and increase in number; fill the earth and subdue it.'"
                    </div>
                  </span>
                </li>
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
    <div className="space-y-10">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full mb-8">
          <BookOpen className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Biblical Business Principles
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {[
          {
            title: "God's Creative Nature",
            verse: "Genesis 1:1",
            verseText: "In the beginning God created the heavens and the earth.",
            principle: "As image bearers, we are called to create value and solutions through business",
            application: "Your business ideas reflect God's creativity working through you"
          },
          {
            title: "The Cultural Mandate",
            verse: "Genesis 1:28",
            verseText: "God blessed them and said to them, 'Be fruitful and increase in number; fill the earth and subdue it.'",
            principle: "God commanded humanity to subdue and steward creation",
            application: "Business is a primary way we fulfill this divine calling"
          },
          {
            title: "Faithful Stewardship",
            verse: "Matthew 25:14-30",
            verseText: "Again, it will be like a man going on a journey, who called his servants and entrusted his wealth to them.",
            principle: "We are entrusted with resources to multiply for His kingdom",
            application: "Profits should be reinvested in kingdom purposes and discipleship"
          },
          {
            title: "Excellence in Work",
            verse: "Colossians 3:23",
            verseText: "Whatever you do, work at it with all your heart, as working for the Lord, not for human masters.",
            principle: "Whatever we do, work heartily as for the Lord",
            application: "Quality products and services honor God and attract others to Him"
          }
        ].map((principle, index) => (
          <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all">
            <div className="mb-6">
              <div className="relative group cursor-pointer inline-block mb-4">
                <div className="inline-flex items-center px-4 py-2 rounded-full text-base bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors">
                  📖 {principle.verse}
                </div>
                <div className="absolute bottom-full left-0 mb-3 px-4 py-3 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 max-w-sm">
                  "{principle.verseText}"
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{principle.title}</h3>
            </div>
            <p className="text-lg text-gray-700 mb-6 font-medium leading-relaxed">{principle.principle}</p>
            <div className="bg-gray-50 p-6 rounded-xl">
              <p className="text-base text-gray-700 leading-relaxed">
                <span className="font-semibold text-gray-900">Application: </span>
                {principle.application}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReflectionSection = () => (
    <div className="space-y-10">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full mb-8">
          <Lightbulb className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Personal Reflection
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Take a moment to reflect on how these principles apply to your business journey
        </p>
      </div>

      <div className="space-y-8">
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
          <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 leading-relaxed">{item.question}</h3>
            <textarea
              className="w-full p-5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-base"
              rows="5"
              placeholder={item.placeholder}
              value={reflectionAnswers[item.question] || ''}
              onChange={(e) => handleReflectionChange(item.question, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="bg-blue-50 p-8 rounded-xl border border-blue-200">
        <div className="flex items-start space-x-4">
          <Heart className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="text-lg font-semibold text-blue-900 mb-3">Remember</h4>
            <p className="text-base text-blue-800 leading-relaxed">
              This is a journey of faith. God is not looking for perfection but for hearts willing to be shaped by His purposes. 
              Be honest in your reflections and trust the Holy Spirit to guide your business decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderApplicationSection = () => (
    <div className="space-y-10">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-8">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Take Action This Week
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Transform today's learning into practical steps for your business
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-gray-900">This Week's Actions</h3>
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
            <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold text-green-600">{index + 1}</span>
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{item.action}</h4>
                    <span className="text-sm px-3 py-1 bg-gray-100 text-gray-600 rounded-full">{item.days}</span>
                  </div>
                  <p className="text-base text-gray-600 leading-relaxed">{item.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-xl border border-purple-200">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Next Session Preview</h3>
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-purple-900">Session 1.2: Business Leaders Work Together with Church Leaders</h4>
            <p className="text-purple-800 text-base leading-relaxed">
              Discover the powerful synergy between marketplace and ministry leadership, and how they can work together to multiply disciples.
            </p>
            <div className="flex items-center space-x-3 text-base text-purple-700">
              <Clock className="w-5 h-5" />
              <span>15 minutes • Video + Interactive Elements</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
          Complete Session & Continue
          <ArrowRight className="w-6 h-6 ml-3" />
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