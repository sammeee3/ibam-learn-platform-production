'use client';

import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Book, Users, Heart, Target, ArrowRight, Edit, Save, X, Star, Award, ChevronDown, ChevronUp, Lock, Unlock, Clock, Trophy, Zap, Lightbulb, Video, Brain, MessageCircle } from 'lucide-react';

const Session1_1_Complete = ({ sessionId = 1 }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showQuizResults, setShowQuizResults] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeSection, setActiveSection] = useState('video');
  const [sessionData, setSessionData] = useState({
    title: 'Business is a Good Gift from God',
    subtitle: 'Understanding God\'s Original Design for Business',
    duration: '25 minutes',
    video_url: 'https://vimeo.com/491439739/02b678490d',
    scripture_reference: 'Genesis 1:26-31',
    learning_objective: 'Understand that business is part of God\'s original design and calling for humanity.'
  });

  const [discipleshipResponses, setDiscipleshipResponses] = useState({
    lookBack: '',
    lookUp: '',
    lookForward: ''
  });

  const scriptureVerses = {
    'Genesis 1:26-31': 'Then God said, "Let us make man in our image, after our likeness. And let them have dominion over the fish of the sea and over the birds of the heavens and over the livestock and over all the earth and over every creeping thing that creeps on the earth." So God created man in his own image, in the image of God he created him; male and female he created them.',
    'Genesis 1:27': 'So God created man in his own image, in the image of God he created him; male and female he created them.',
    'Genesis 1:28': 'And God blessed them. And God said to them, "Be fruitful and multiply and fill the earth and subdue it."',
    'Genesis 1:31': 'And God saw everything that he had made, and behold, it was very good.',
    '2 Thessalonians 3:10': 'For even when we were with you, we would give you this command: If anyone is not willing to work, let him not eat.',
    'Galatians 5:13': 'For you were called to freedom, brothers. Only do not use your freedom as an opportunity for the flesh, but through love serve one another.',
    'Matthew 25:14-30': 'For it will be like a man going on a journey, who called his servants and entrusted to them his property.',
    'Matthew 5:16': 'In the same way, let your light shine before others, so that they may see your good works and give glory to your Father who is in heaven.',
    'Acts 16:14': 'One who heard us was a woman named Lydia, from the city of Thyatira, a seller of purple goods, who was a worshiper of God.',
    'Acts 18:2-3': 'And he found a Jew named Aquila, a native of Pontus, recently come from Italy with his wife Priscilla.'
  };

  const quizQuestions = [
    {
      question: "According to Genesis 1:26-31, God's original design for humanity included:",
      options: [
        "Only spiritual activities like worship and prayer",
        "Dominion over creation and subduing the earth",
        "Avoiding all material concerns",
        "Focusing solely on personal salvation"
      ],
      correct: 1,
      explanation: "God designed us to be productive stewards of His creation, which includes business and entrepreneurship."
    },
    {
      question: "The Bible contains many examples of godly businesspeople who were praised for their work.",
      options: ["True", "False"],
      correct: 0,
      explanation: "Lydia, Aquila and Priscilla, Joseph, the Proverbs 31 woman, and even Jesus were all involved in business activities."
    },
    {
      question: "How many biblical principles show why business is God's good gift?",
      options: ["Five", "Six", "Seven", "Eight"],
      correct: 2,
      explanation: "The seven principles demonstrate God's comprehensive design for business in human life."
    }
  ];

  const biblicalPrinciples = [
    {
      title: "God's Image Bearers",
      description: "We are created in God's image to be creative and productive",
      scripture: "Genesis 1:27",
      icon: "👑",
      color: "from-purple-600 to-purple-800"
    },
    {
      title: "Dominion Mandate", 
      description: "God gave us authority to steward His creation through work",
      scripture: "Genesis 1:28",
      icon: "🌍",
      color: "from-green-600 to-green-800"
    },
    {
      title: "Good Work",
      description: "God saw His work was good, and our work can reflect His character",
      scripture: "Genesis 1:31",
      icon: "⭐",
      color: "from-yellow-500 to-orange-700"
    },
    {
      title: "Provision Through Work",
      description: "God provides for our needs through productive labor",
      scripture: "2 Thessalonians 3:10",
      icon: "🌾",
      color: "from-amber-600 to-orange-700"
    },
    {
      title: "Service to Others",
      description: "Business allows us to serve others and meet their needs",
      scripture: "Galatians 5:13",
      icon: "🤝",
      color: "from-blue-600 to-blue-800"
    },
    {
      title: "Stewardship",
      description: "We are called to wisely manage the resources God has given us",
      scripture: "Matthew 25:14-30",
      icon: "💼",
      color: "from-indigo-600 to-indigo-800"
    },
    {
      title: "Witness and Ministry",
      description: "Business provides opportunities to share God's love",
      scripture: "Matthew 5:16",
      icon: "💡",
      color: "from-pink-600 to-pink-800"
    }
  ];

  useEffect(() => {
    checkUserAuth();
    loadSessionData();
    loadUserProgress();
  }, []);

  const checkUserAuth = async () => {
    try {
      const response = await fetch('/api/auth/session');
      if (response.ok) {
        const session = await response.json();
        setUser(session.user);
        if (session.user?.email === 'jsamuelson@ibam.org') {
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
    }
  };

  const loadSessionData = async () => {
    try {
      const response = await fetch(`/api/sessions/${sessionId}`);
      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
      }
    } catch (error) {
      console.error('Failed to load session data:', error);
    }
  };

  const loadUserProgress = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/progress?sessionId=${sessionId}&userId=${user.id}`);
      if (response.ok) {
        const progress = await response.json();
        setVideoCompleted(progress.video_watched || false);
        setQuizCompleted(progress.quiz_completed || false);
        setQuizScore(progress.quiz_score || 0);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  const handleVideoComplete = async () => {
    setVideoCompleted(true);
    setActiveSection('principles');
    await saveProgress({ videoWatched: true });
  };

  const saveProgress = async (updates) => {
    if (!user) return;
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId: user.id,
          ...updates
        })
      });
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleQuizAnswer = (questionIndex, answerIndex) => {
    setQuizAnswers({
      ...quizAnswers,
      [questionIndex]: answerIndex
    });
  };

  const submitQuiz = async () => {
    let score = 0;
    quizQuestions.forEach((question, index) => {
      if (quizAnswers[index] === question.correct) {
        score++;
      }
    });
    
    const percentage = Math.round((score / quizQuestions.length) * 100);
    setQuizScore(percentage);
    setQuizCompleted(true);
    setShowQuizResults(true);
    setActiveSection('discipleship');
    
    await saveProgress({ 
      quizCompleted: true, 
      quizScore: percentage 
    });
  };

  const saveDiscipleshipResponses = async () => {
    if (!user) return;
    try {
      await fetch('/api/discipleship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          userId: user.id,
          ...discipleshipResponses
        })
      });
      alert('🎉 Discipleship responses saved successfully!');
    } catch (error) {
      console.error('Failed to save discipleship responses:', error);
      alert('Failed to save responses. Please try again.');
    }
  };

  const ScriptureReference = ({ reference }) => {
    const [showVerse, setShowVerse] = useState(false);
    
    return (
      <div className="relative inline-block">
        <button 
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          onClick={() => setShowVerse(!showVerse)}
        >
          📖 {reference}
        </button>
        {showVerse && (
          <div className="absolute z-50 w-96 p-6 bg-white border-2 border-cyan-300 rounded-xl shadow-2xl -top-2 left-full ml-4">
            <p className="text-sm font-bold mb-3 text-gray-800">📖 {reference} (ESV)</p>
            <p className="text-sm leading-relaxed text-gray-700">{scriptureVerses[reference] || 'Scripture text loading...'}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      {/* STUNNING HEADER */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <img 
                src="https://images.squarespace-cdn.com/content/v1/5d3f8b5e4b49e10001d5f3e1/1625851877786-QR3ZXJV8Y1OYXQHQXZJY/IBAM+Logo+Horizontal+Reverse.png" 
                alt="IBAM - Designed to Thrive"
                className="h-20 w-auto drop-shadow-lg"
              />
              <div>
                <h1 className="text-5xl font-black mb-3">{sessionData.title}</h1>
                <p className="text-2xl text-purple-200 font-semibold">{sessionData.subtitle}</p>
              </div>
            </div>
            
            {isAdmin && (
              <button className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full font-bold transition-all duration-300 backdrop-blur-sm">
                <Edit size={20} />
                Admin
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-8 mt-8 text-purple-200">
            <div className="flex items-center gap-3">
              <Award size={24} />
              <span className="text-xl font-bold">Module 1 • Session 1.1</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={24} />
              <span className="text-xl font-bold">{sessionData.duration}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold">Scripture Study:</span>
              <ScriptureReference reference={sessionData.scripture_reference} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-16">
        {/* MODERN PROGRESS CARDS */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className={`p-8 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 ${
            videoCompleted 
              ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white' 
              : 'bg-white border-4 border-gray-200'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                videoCompleted ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {videoCompleted ? (
                  <CheckCircle className="text-white" size={32} />
                ) : (
                  <Video className="text-gray-500" size={32} />
                )}
              </div>
              <div>
                <h4 className={`text-xl font-bold ${videoCompleted ? 'text-white' : 'text-gray-700'}`}>
                  Watch Video
                </h4>
                <p className={`${videoCompleted ? 'text-green-100' : 'text-gray-500'}`}>
                  Complete the session content
                </p>
              </div>
            </div>
          </div>

          <div className={`p-8 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 ${
            quizCompleted 
              ? 'bg-gradient-to-br from-orange-400 to-red-600 text-white' 
              : 'bg-white border-4 border-gray-200'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                quizCompleted ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {quizCompleted ? (
                  <CheckCircle className="text-white" size={32} />
                ) : (
                  <Brain className="text-gray-500" size={32} />
                )}
              </div>
              <div>
                <h4 className={`text-xl font-bold ${quizCompleted ? 'text-white' : 'text-gray-700'}`}>
                  Knowledge Quiz {quizCompleted && `(${quizScore}%)`}
                </h4>
                <p className={`${quizCompleted ? 'text-orange-100' : 'text-gray-500'}`}>
                  Test your understanding
                </p>
              </div>
            </div>
          </div>

          <div className={`p-8 rounded-3xl shadow-2xl transform transition-all duration-500 hover:scale-105 ${
            discipleshipResponses.lookBack && discipleshipResponses.lookUp && discipleshipResponses.lookForward
              ? 'bg-gradient-to-br from-blue-400 to-purple-600 text-white' 
              : 'bg-white border-4 border-gray-200'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                discipleshipResponses.lookBack && discipleshipResponses.lookUp && discipleshipResponses.lookForward ? 'bg-white/20' : 'bg-gray-100'
              }`}>
                {discipleshipResponses.lookBack && discipleshipResponses.lookUp && discipleshipResponses.lookForward ? (
                  <CheckCircle className="text-white" size={32} />
                ) : (
                  <MessageCircle className="text-gray-500" size={32} />
                )}
              </div>
              <div>
                <h4 className={`text-xl font-bold ${discipleshipResponses.lookBack && discipleshipResponses.lookUp && discipleshipResponses.lookForward ? 'text-white' : 'text-gray-700'}`}>
                  3/3 Discipleship
                </h4>
                <p className={`${discipleshipResponses.lookBack && discipleshipResponses.lookUp && discipleshipResponses.lookForward ? 'text-blue-100' : 'text-gray-500'}`}>
                  Reflect and apply learning
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* LEARNING OBJECTIVE */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl p-12 mb-16 shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
          <div className="flex items-start gap-8 text-white">
            <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
              <Target size={40} />
            </div>
            <div>
              <h3 className="text-4xl font-black mb-6">🎯 Learning Objective</h3>
              <p className="text-2xl leading-relaxed opacity-95 font-semibold">{sessionData.learning_objective}</p>
            </div>
          </div>
        </div>

        {/* VIDEO SECTION */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16 transform hover:scale-[1.01] transition-all duration-500">
          <button
            onClick={() => setActiveSection(activeSection === 'video' ? '' : 'video')}
            className="w-full p-12 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 text-white hover:from-green-600 hover:via-emerald-700 hover:to-teal-700 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                  <Play size={40} />
                </div>
                <div className="text-left">
                  <h3 className="text-4xl font-black mb-2">🎥 Session Video</h3>
                  <p className="text-2xl opacity-90 font-semibold">Watch and engage with today's content</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                {videoCompleted && (
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <CheckCircle size={32} />
                  </div>
                )}
                <ChevronDown className={`transition-transform duration-300 ${activeSection === 'video' ? 'rotate-180' : ''}`} size={32} />
              </div>
            </div>
          </button>
          
          {activeSection === 'video' && (
            <div className="p-12 animate-in slide-in-from-top duration-500">
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl overflow-hidden shadow-2xl border-8 border-gray-800" style={{ minHeight: '600px' }}>
                {sessionData.video_url ? (
                  <iframe
                    src={sessionData.video_url.replace('vimeo.com/', 'player.vimeo.com/video/').replace(/\/[a-zA-Z0-9]+$/, '')}
                    className="w-full h-full"
                    style={{ minHeight: '600px' }}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    onEnded={handleVideoComplete}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white">
                    <div className="text-center">
                      <Play className="mx-auto mb-8" size={100} />
                      <p className="text-3xl font-bold">Video will be available soon</p>
                    </div>
                  </div>
                )}
              </div>
              
              {!videoCompleted && (
                <div className="mt-12 text-center">
                  <button
                    onClick={handleVideoComplete}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-16 py-6 rounded-full font-black text-2xl transition-all duration-300 shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-2 hover:scale-110"
                  >
                    ✅ Mark Video as Complete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* BIBLICAL PRINCIPLES */}
        {videoCompleted && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16 transform hover:scale-[1.01] transition-all duration-500">
            <button
              onClick={() => setActiveSection(activeSection === 'principles' ? '' : 'principles')}
              className="w-full p-12 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white hover:from-purple-700 hover:via-purple-800 hover:to-indigo-800 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                    <Book size={40} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-4xl font-black mb-2">📚 Seven Biblical Principles</h3>
                    <p className="text-2xl opacity-90 font-semibold">Why Business is God's Good Gift</p>
                  </div>
                </div>
                <ChevronDown className={`transition-transform duration-300 ${activeSection === 'principles' ? 'rotate-180' : ''}`} size={32} />
              </div>
            </button>

            {activeSection === 'principles' && (
              <div className="p-12 animate-in slide-in-from-top duration-500">
                <div className="grid lg:grid-cols-2 gap-8">
                  {biblicalPrinciples.map((principle, index) => (
                    <div
                      key={index}
                      className="group hover:scale-105 transition-all duration-500 cursor-pointer"
                    >
                      <div className={`h-full rounded-3xl p-8 bg-gradient-to-br ${principle.color} text-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-4 border-white/20`}>
                        <div className="flex items-start gap-6">
                          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-3xl backdrop-blur-sm font-bold">
                            {principle.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-black text-lg backdrop-blur-sm">
                                {index + 1}
                              </span>
                              <h3 className="font-black text-2xl">{principle.title}</h3>
                            </div>
                            <p className="text-white/90 mb-6 leading-relaxed text-lg font-semibold">{principle.description}</p>
                            <ScriptureReference reference={principle.scripture} />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-12 text-center">
                  <button
                    onClick={() => setActiveSection('quiz')}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-16 py-6 rounded-full font-black text-2xl transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 transform hover:-translate-y-2 hover:scale-110"
                  >
                    🧠 Ready for the Quiz? Test Your Knowledge!
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* QUIZ SECTION */}
        {videoCompleted && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16 transform hover:scale-[1.01] transition-all duration-500">
            <button
              onClick={() => setActiveSection(activeSection === 'quiz' ? '' : 'quiz')}
              className="w-full p-12 bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 text-white hover:from-orange-600 hover:via-red-600 hover:to-pink-700 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                    <Trophy size={40} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-4xl font-black mb-2">🧠 Knowledge Check Quiz</h3>
                    <p className="text-2xl opacity-90 font-semibold">Test your understanding of today's content</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  {quizCompleted && (
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="font-black text-lg">{quizScore}%</span>
                    </div>
                  )}
                  <ChevronDown className={`transition-transform duration-300 ${activeSection === 'quiz' ? 'rotate-180' : ''}`} size={32} />
                </div>
              </div>
            </button>

            {activeSection === 'quiz' && (
              <div className="p-12 animate-in slide-in-from-top duration-500">
                {!quizCompleted ? (
                  <div>
                    {currentQuizQuestion < quizQuestions.length ? (
                      <div className="space-y-8">
                        <div className="flex justify-between items-center">
                          <span className="text-3xl font-black text-gray-700">
                            Question {currentQuizQuestion + 1} of {quizQuestions.length}
                          </span>
                          <div className="w-80 bg-gray-200 rounded-full h-6 shadow-inner">
                            <div 
                              className="bg-gradient-to-r from-orange-500 to-red-600 h-6 rounded-full transition-all duration-500 shadow-lg"
                              style={{ width: `${((currentQuizQuestion + 1) / quizQuestions.length) * 100}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-gray-50 to-white p-12 rounded-3xl border-4 border-gray-200 shadow-xl">
                          <h3 className="font-black text-3xl mb-12 text-gray-800">
                            {quizQuestions[currentQuizQuestion].question}
                          </h3>
                          
                          <div className="space-y-6">
                            {quizQuestions[currentQuizQuestion].options.map((option, index) => (
                              <label key={index} className="flex items-center gap-6 p-8 border-4 border-gray-200 rounded-3xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 hover:border-cyan-400 cursor-pointer transition-all duration-500 group shadow-lg hover:shadow-xl transform hover:scale-105">
                                <input
                                  type="radio"
                                  name={`question-${currentQuizQuestion}`}
                                  value={index}
                                  onChange={() => handleQuizAnswer(currentQuizQuestion, index)}
                                  className="w-8 h-8 text-cyan-600 focus:ring-cyan-500 focus:ring-4"
                                />
                                <span className="text-2xl group-hover:text-cyan-700 transition-colors duration-300 font-bold">{option}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          <button
                            onClick={() => setCurrentQuizQuestion(Math.max(0, currentQuizQuestion - 1))}
                            disabled={currentQuizQuestion === 0}
                            className="px-12 py-6 border-4 border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 font-black text-2xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 disabled:transform-none"
                          >
                            ← Previous
                          </button>
                          
                          {currentQuizQuestion === quizQuestions.length - 1 ? (
                            <button
                              onClick={submitQuiz}
                              disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                              className="px-16 py-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full font-black text-2xl disabled:opacity-50 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 transform hover:-translate-y-2 hover:scale-110 disabled:transform-none"
                            >
                              🎯 Submit Quiz
                            </button>
                          ) : (
                            <button
                              onClick={() => setCurrentQuizQuestion(currentQuizQuestion + 1)}
                              disabled={quizAnswers[currentQuizQuestion] === undefined}
                              className="px-12 py-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-full font-black text-2xl disabled:opacity-50 flex items-center gap-4 transition-all duration-300 shadow-2xl hover:shadow-orange-500/25 transform hover:-translate-y-2 hover:scale-110 disabled:transform-none"
                            >
                              Next <ArrowRight size={24} />
                            </button>
                          )}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="mb-12">
                      <div className={`text-9xl font-black mb-6 ${quizScore >= 70 ? 'text-green-500' : 'text-red-500'}`}>
                        {quizScore}%
                      </div>
                      <p className="text-3xl font-black text-gray-700">
                        {quizScore >= 70 ? '🎉 Outstanding! You passed the quiz!' : '📚 Please review the material and try again.'}
                      </p>
                    </div>
                    
                    {quizScore >= 70 && (
                      <button
                        onClick={() => setActiveSection('discipleship')}
                        className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-16 py-6 rounded-full font-black text-2xl transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 transform hover:-translate-y-2 hover:scale-110"
                      >
                        🤝 Continue to Discipleship Reflection
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* DISCIPLESHIP SECTION */}
        {quizCompleted && quizScore >= 70 && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-16 transform hover:scale-[1.01] transition-all duration-500">
            <button
              onClick={() => setActiveSection(activeSection === 'discipleship' ? '' : 'discipleship')}
              className="w-full p-12 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white hover:from-emerald-600 hover:via-teal-700 hover:to-cyan-700 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
                    <Users size={40} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-4xl font-black mb-2">🤝 3/3 Discipleship Process</h3>
                    <p className="text-2xl opacity-90 font-semibold">Reflect, Learn, and Apply God's Truth</p>
                  </div>
                </div>
                <ChevronDown className={`transition-transform duration-300 ${activeSection === 'discipleship' ? 'rotate-180' : ''}`} size={32} />
              </div>
            </button>

            {activeSection === 'discipleship' && (
              <div className="p-12 space-y-12 animate-in slide-in-from-top duration-500">
                <div className="bg-gradient-to-br from-red-100 to-pink-100 p-12 rounded-3xl border-4 border-red-300 shadow-xl">
                  <h3 className="font-black text-3xl text-red-700 mb-8 flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-xl">
                      <Heart size={32} className="text-white" />
                    </div>
                    Look Back: How did God work in your life this week?
                  </h3>
                  <textarea
                    value={discipleshipResponses.lookBack}
                    onChange={(e) => setDiscipleshipResponses({
                      ...discipleshipResponses,
                      lookBack: e.target.value
                    })}
                    className="w-full p-8 border-4 border-red-300 rounded-3xl focus:border-red-500 focus:ring-8 focus:ring-red-200 transition-all duration-300 text-xl font-semibold"
                    rows="5"
                    placeholder="Reflect on God's faithfulness, answers to prayer, challenges overcome..."
                  />
                </div>

                <div className="bg-gradient-to-br from-cyan-100 to-blue-100 p-12 rounded-3xl border-4 border-cyan-300 shadow-xl">
                  <h3 className="font-black text-3xl text-cyan-700 mb-8 flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-3xl flex items-center justify-center shadow-xl">
                      <Lightbulb size={32} className="text-white" />
                    </div>
                    Look Up: What did you learn from today's session?
                  </h3>
                  <textarea
                    value={discipleshipResponses.lookUp}
                    onChange={(e) => setDiscipleshipResponses({
                      ...discipleshipResponses,
                      lookUp: e.target.value
                    })}
                    className="w-full p-8 border-4 border-cyan-300 rounded-3xl focus:border-cyan-500 focus:ring-8 focus:ring-cyan-200 transition-all duration-300 text-xl font-semibold"
                    rows="5"
                    placeholder="Key insights, scripture that spoke to you, business principles..."
                  />
                </div>

                <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-12 rounded-3xl border-4 border-green-300 shadow-xl">
                  <h3 className="font-black text-3xl text-green-700 mb-8 flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-3xl flex items-center justify-center shadow-xl">
                      <Zap size={32} className="text-white" />
                    </div>
                    Look Forward: How will you apply this in your business/life?
                  </h3>
                  <textarea
                    value={discipleshipResponses.lookForward}
                    onChange={(e) => setDiscipleshipResponses({
                      ...discipleshipResponses,
                      lookForward: e.target.value
                    })}
                    className="w-full p-8 border-4 border-green-300 rounded-3xl focus:border-green-500 focus:ring-8 focus:ring-green-200 transition-all duration-300 text-xl font-semibold"
                    rows="5"
                    placeholder="Specific actions, people to share with, business practices to change..."
                  />
                </div>

                <div className="text-center">
                  <button
                    onClick={saveDiscipleshipResponses}
                    className="px-16 py-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full font-black text-2xl transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 transform hover:-translate-y-2 hover:scale-110"
                  >
                    💾 Save My Responses
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* COMPLETION CELEBRATION */}
        {videoCompleted && quizCompleted && discipleshipResponses.lookBack && discipleshipResponses.lookUp && discipleshipResponses.lookForward && (
          <div className="p-16 bg-gradient-to-br from-green-200 to-emerald-200 border-8 border-green-400 rounded-3xl text-center shadow-2xl transform hover:scale-105 transition-all duration-500">
            <div className="text-9xl mb-8">🎉</div>
            <h2 className="text-5xl font-black text-green-800 mb-6">Congratulations!</h2>
            <p className="text-3xl text-green-700 mb-12 font-bold">You've completed Session 1.1 with excellence!</p>
            <div className="bg-white p-12 rounded-3xl border-4 border-green-300 shadow-xl">
              <p className="text-green-600 font-black text-2xl mb-4">🚀 Ready for Session 1.2:</p>
              <p className="text-green-600 text-xl font-bold">"Business Leaders Work Together with Church/Spiritual Leaders"</p>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-gradient-to-r from-slate-900 via-gray-900 to-indigo-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-8 py-16">
          <div className="grid md:grid-cols-3 gap-16">
            <div>
              <div className="mb-8">
                <img 
                  src="https://images.squarespace-cdn.com/content/v1/5d3f8b5e4b49e10001d5f3e1/1625851877786-QR3ZXJV8Y1OYXQHQXZJY/IBAM+Logo+Horizontal+Reverse.png" 
                  alt="IBAM - Designed to Thrive"
                  className="h-16 w-auto drop-shadow-lg"
                />
              </div>
              <p className="text-gray-300 leading-relaxed text-xl font-semibold">
                Empowering faith-driven business leaders to see their work as worship and their businesses as platforms for discipleship.
              </p>
            </div>
            
            <div>
              <h4 className="font-black text-2xl mb-8 text-cyan-300">Our Mission</h4>
              <ul className="space-y-4 text-gray-300 text-xl font-semibold">
                <li>• Integrate faith and business</li>
                <li>• Multiply disciples through marketplace ministry</li>
                <li>• Build God-honoring businesses</li>
                <li>• Transform communities through business</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-black text-2xl mb-8 text-cyan-300">Learning Modules</h4>
              <ul className="space-y-4 text-gray-300 text-xl font-semibold">
                <li>• Biblical Business Foundations</li>
                <li>• Leadership & Discipleship</li>
                <li>• Marketplace Ministry</li>
                <li>• Business Planning & Strategy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-16 pt-12 text-center">
            <p className="text-gray-400 text-xl font-semibold">
              © 2025 IBAM Learning Platform. All rights reserved. | 
              <span className="text-cyan-400"> Transforming business through faith-driven leadership</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Session1_1_Complete;