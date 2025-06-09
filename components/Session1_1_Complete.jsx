'use client';

import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Book, Users, Heart, Target, ArrowRight, Edit, Save, X, Star, Award, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [showPrinciples, setShowPrinciples] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showDiscipleship, setShowDiscipleship] = useState(false);
  const [sessionData, setSessionData] = useState({
    title: 'Business is a Good Gift from God',
    subtitle: 'Understanding God\'s Original Design for Business',
    duration: '25 minutes',
    video_url: 'https://vimeo.com/491439739/02b678490d',
    scripture_reference: 'Genesis 1:26-31',
    learning_objective: 'Understand that business is part of God\'s original design and calling for humanity.'
  });

  // 3/3 Discipleship Responses
  const [discipleshipResponses, setDiscipleshipResponses] = useState({
    lookBack: '',
    lookUp: '',
    lookForward: ''
  });

  // Scripture verses database
  const scriptureVerses = {
    'Genesis 1:26-31': 'Then God said, "Let us make man in our image, after our likeness. And let them have dominion over the fish of the sea and over the birds of the heavens and over the livestock and over all the earth and over every creeping thing that creeps on the earth." So God created man in his own image, in the image of God he created him; male and female he created them. And God blessed them. And God said to them, "Be fruitful and multiply and fill the earth and subdue it, and have dominion over the fish of the sea and over the birds of the heavens and over every living thing that moves on the earth." And God said, "Behold, I have given you every plant yielding seed that is on the face of all the earth, and every tree with seed in its fruit. You shall have them for food. And to every beast of the earth and to every bird of the heavens and to everything that creeps on the earth, everything that has the breath of life, I have given every green plant for food." And it was so. And God saw everything that he had made, and behold, it was very good. And there was evening and there was morning, the sixth day.',
    'Genesis 1:27': 'So God created man in his own image, in the image of God he created him; male and female he created them.',
    'Genesis 1:28': 'And God blessed them. And God said to them, "Be fruitful and multiply and fill the earth and subdue it, and have dominion over the fish of the sea and over the birds of the heavens and over every living thing that moves on the earth."',
    'Genesis 1:31': 'And God saw everything that he had made, and behold, it was very good. And there was evening and there was morning, the sixth day.',
    '2 Thessalonians 3:10': 'For even when we were with you, we would give you this command: If anyone is not willing to work, let him not eat.',
    'Galatians 5:13': 'For you were called to freedom, brothers. Only do not use your freedom as an opportunity for the flesh, but through love serve one another.',
    'Matthew 25:14-30': 'For it will be like a man going on a journey, who called his servants and entrusted to them his property. To one he gave five talents, to another two, to another one, to each according to his ability. Then he went away.',
    'Matthew 5:16': 'In the same way, let your light shine before others, so that they may see your good works and give glory to your Father who is in heaven.',
    'Acts 16:14': 'One who heard us was a woman named Lydia, from the city of Thyatira, a seller of purple goods, who was a worshiper of God. The Lord opened her heart to pay attention to what was said by Paul.',
    'Acts 18:2-3': 'And he found a Jew named Aquila, a native of Pontus, recently come from Italy with his wife Priscilla, because Claudius had commanded all the Jews to leave Rome. And he went to see them, and because he was of the same trade he stayed with them and worked, for they were tentmakers by trade.'
  };

  // Quiz questions
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
    },
    {
      question: "Which of these best describes the biblical view of business?",
      options: [
        "A necessary evil for survival",
        "A distraction from spiritual matters",
        "Part of God's good design for human flourishing",
        "Only acceptable if you give all profits to charity"
      ],
      correct: 2,
      explanation: "Scripture shows business as part of God's good design for human productivity and stewardship."
    },
    {
      question: "The Sabbath principle applies to business by:",
      options: [
        "Requiring businesses to close on Sundays",
        "Promoting sustainable work-life balance",
        "Making profit on weekends immoral",
        "Only allowing religious businesses"
      ],
      correct: 1,
      explanation: "The Sabbath teaches us about rest, balance, and trusting God rather than overwork."
    },
    {
      question: "According to the session, business can be a form of:",
      options: [
        "Worldly compromise",
        "Worship and service to God",
        "Spiritual distraction",
        "Necessary but unspiritual work"
      ],
      correct: 1,
      explanation: "When done according to biblical principles, business becomes a form of worship and service."
    }
  ];

  // Seven Biblical Principles with IBAM turquoise theme
  const biblicalPrinciples = [
    {
      title: "God's Image Bearers",
      description: "We are created in God's image to be creative and productive",
      scripture: "Genesis 1:27",
      icon: "👑"
    },
    {
      title: "Dominion Mandate",
      description: "God gave us authority to steward His creation through work",
      scripture: "Genesis 1:28",
      icon: "🌍"
    },
    {
      title: "Good Work",
      description: "God saw His work was good, and our work can reflect His character",
      scripture: "Genesis 1:31",
      icon: "⭐"
    },
    {
      title: "Provision Through Work",
      description: "God provides for our needs through productive labor",
      scripture: "2 Thessalonians 3:10",
      icon: "🌾"
    },
    {
      title: "Service to Others",
      description: "Business allows us to serve others and meet their needs",
      scripture: "Galatians 5:13",
      icon: "🤝"
    },
    {
      title: "Stewardship",
      description: "We are called to wisely manage the resources God has given us",
      scripture: "Matthew 25:14-30",
      icon: "💼"
    },
    {
      title: "Witness and Ministry",
      description: "Business provides opportunities to share God's love",
      scripture: "Matthew 5:16",
      icon: "💡"
    }
  ];

  // IBAM Logo Component
  const IBAMLogo = ({ size = 64 }) => (
    <div className={`relative`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100" className="drop-shadow-lg">
        {/* Circular background with IBAM turquoise gradient */}
        <defs>
          <radialGradient id="ibamGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#0891b2" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#ibamGradient)" />
        
        {/* Three fish symbols in white */}
        <g fill="white" stroke="white" strokeWidth="2">
          {/* Top fish */}
          <ellipse cx="50" cy="25" rx="12" ry="6" />
          <circle cx="47" cy="25" r="1.5" fill="#0891b2" />
          
          {/* Bottom left fish */}
          <ellipse cx="35" cy="60" rx="12" ry="6" transform="rotate(-30 35 60)" />
          <circle cx="32" cy="58" r="1.5" fill="#0891b2" />
          
          {/* Bottom right fish */}
          <ellipse cx="65" cy="60" rx="12" ry="6" transform="rotate(30 65 60)" />
          <circle cx="68" cy="58" r="1.5" fill="#0891b2" />
        </g>
      </svg>
    </div>
  );

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
    setShowPrinciples(true);
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
    setShowDiscipleship(true);
    
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
      alert('Discipleship responses saved successfully! 🎉');
    } catch (error) {
      console.error('Failed to save discipleship responses:', error);
      alert('Failed to save responses. Please try again.');
    }
  };

  const saveSessionData = async () => {
    if (!isAdmin) return;

    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      
      if (response.ok) {
        setEditMode(false);
        alert('Session updated successfully! ✅');
      }
    } catch (error) {
      console.error('Failed to save session:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const ScriptureReference = ({ reference }) => {
    const [showVerse, setShowVerse] = useState(false);
    
    return (
      <div className="relative inline-block">
        <button 
          className="bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-500 hover:to-cyan-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          onClick={() => setShowVerse(!showVerse)}
          onMouseEnter={() => setShowVerse(true)}
          onMouseLeave={() => setShowVerse(false)}
        >
          📖 {reference}
        </button>
        {showVerse && (
          <div className="absolute z-50 w-96 p-6 bg-white border-2 border-cyan-200 rounded-2xl shadow-2xl -top-2 left-full ml-4 transform transition-all duration-300">
            <div className="absolute -left-2 top-6 w-4 h-4 bg-white border-l-2 border-t-2 border-cyan-200 transform rotate-45"></div>
            <p className="text-sm font-bold mb-3 text-slate-700 border-b border-cyan-100 pb-2">📖 {reference} (ESV)</p>
            <p className="text-sm leading-relaxed text-slate-600">{scriptureVerses[reference] || 'Scripture text loading...'}</p>
          </div>
        )}
      </div>
    );
  };

  const ExpandButton = ({ isOpen, onClick, children, icon }) => (
    <button
      onClick={onClick}
      className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white p-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-between group"
    >
      <div className="flex items-center gap-4">
        <span className="text-3xl">{icon}</span>
        <span className="text-xl font-bold">{children}</span>
      </div>
      {isOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-slate-50">
      {/* IBAM Header with Turquoise Branding */}
      <div className="bg-gradient-to-r from-cyan-500 via-cyan-600 to-slate-700 text-white shadow-2xl">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* IBAM Logo */}
              <IBAMLogo size={80} />
              <div>
                <div className="text-lg font-bold text-cyan-100 mb-2 tracking-wide">IBAM LEARNING PLATFORM</div>
                <div className="text-sm text-cyan-200 mb-3 font-medium">DESIGNED TO THRIVE</div>
                {editMode && isAdmin ? (
                  <input
                    type="text"
                    value={sessionData.title}
                    onChange={(e) => setSessionData({...sessionData, title: e.target.value})}
                    className="text-4xl font-bold bg-transparent border-b-2 border-white text-white placeholder-cyan-100 w-full"
                  />
                ) : (
                  <h1 className="text-4xl font-bold mb-2">{sessionData.title}</h1>
                )}
                {editMode && isAdmin ? (
                  <input
                    type="text"
                    value={sessionData.subtitle}
                    onChange={(e) => setSessionData({...sessionData, subtitle: e.target.value})}
                    className="text-xl text-cyan-100 bg-transparent border-b border-cyan-300 w-full"
                  />
                ) : (
                  <p className="text-xl text-cyan-100">{sessionData.subtitle}</p>
                )}
              </div>
            </div>
            {isAdmin && (
              <div className="flex gap-3">
                {editMode ? (
                  <>
                    <button
                      onClick={saveSessionData}
                      className="flex items-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <X size={18} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    <Edit size={18} />
                    Edit Content
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-6 mt-6 text-cyan-100">
            <div className="flex items-center gap-2">
              <Award size={18} />
              <span className="font-semibold">Module 1 • Session 1.1</span>
            </div>
            <div className="flex items-center gap-2">
              <Play size={18} />
              <span className="font-semibold">{sessionData.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Scripture Study:</span>
              <ScriptureReference reference={sessionData.scripture_reference} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Learning Objective */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-l-8 border-amber-400 p-8 rounded-2xl shadow-lg">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-amber-500 rounded-full flex items-center justify-center shadow-lg">
              <Target className="text-white" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-2xl text-amber-800 mb-3">🎯 Learning Objective</h3>
              {editMode && isAdmin ? (
                <textarea
                  value={sessionData.learning_objective}
                  onChange={(e) => setSessionData({...sessionData, learning_objective: e.target.value})}
                  className="w-full p-4 border-2 border-amber-200 rounded-xl bg-white text-lg"
                  rows="3"
                />
              ) : (
                <p className="text-amber-700 text-lg leading-relaxed">{sessionData.learning_objective}</p>
              )}
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <Play className="text-white" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">🎥 Session Video</h2>
                <p className="text-green-100">Watch and engage with today's content</p>
              </div>
              {videoCompleted && (
                <div className="ml-auto">
                  <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                    <CheckCircle className="text-white" size={20} />
                    <span className="font-semibold">Completed!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="p-8">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-inner">
              {sessionData.video_url ? (
                <iframe
                  src={sessionData.video_url.replace('vimeo.com/', 'player.vimeo.com/video/').replace(/\/[a-zA-Z0-9]+$/, '')}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  onEnded={handleVideoComplete}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Play className="text-gray-400 mx-auto mb-4" size={48} />
                    <p className="text-gray-500 text-lg">Video will be available soon</p>
                  </div>
                </div>
              )}
            </div>
            
            {!videoCompleted && (
              <div className="mt-6 text-center">
                <button
                  onClick={handleVideoComplete}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  ✅ Mark Video as Complete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Seven Biblical Principles - Expandable */}
        {videoCompleted && (
          <div className="space-y-4">
            <ExpandButton
              isOpen={showPrinciples}
              onClick={() => setShowPrinciples(!showPrinciples)}
              icon="📚"
            >
              Seven Biblical Principles: Why Business is God's Good Gift
            </ExpandButton>

            {showPrinciples && (
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-top duration-500">
                <div className="p-8">
                  <div className="grid lg:grid-cols-2 gap-6">
                    {biblicalPrinciples.map((principle, index) => (
                      <div key={index} className="group hover:scale-105 transition-all duration-300">
                        <div className="h-full border-2 border-cyan-100 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-cyan-50 hover:border-cyan-200">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full flex items-center justify-center text-2xl shadow-lg">
                              {principle.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="w-8 h-8 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold text-sm">
                                  {index + 1}
                                </span>
                                <h3 className="font-bold text-lg text-slate-800">{principle.title}</h3>
                              </div>
                              <p className="text-slate-600 mb-4 leading-relaxed">{principle.description}</p>
                              <ScriptureReference reference={principle.scripture} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setShowQuiz(true)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      🧠 Ready for the Quiz? Let's Test Your Knowledge!
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quiz Section - Expandable */}
        {showPrinciples && (
          <div className="space-y-4">
            <ExpandButton
              isOpen={showQuiz}
              onClick={() => setShowQuiz(!showQuiz)}
              icon="🧠"
            >
              Knowledge Check Quiz
            </ExpandButton>

            {showQuiz && (
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-top duration-500">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Target className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">🧠 Knowledge Check Quiz</h2>
                      <p className="text-orange-100">Test your understanding of today's content</p>
                    </div>
                    {quizCompleted && (
                      <div className="ml-auto">
                        <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                          <CheckCircle className="text-white" size={20} />
                          <span className="font-semibold">{quizScore}% Complete!</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-8">
                  {!quizCompleted ? (
                    <div>
                      {currentQuizQuestion < quizQuestions.length ? (
                        <div className="space-y-6">
                          <div className="flex justify-between items-center mb-6">
                            <span className="text-lg font-semibold text-gray-600">
                              Question {currentQuizQuestion + 1} of {quizQuestions.length}
                            </span>
                            <div className="w-48 bg-gray-200 rounded-full h-3 shadow-inner">
                              <div 
                                className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-500 shadow-sm"
                                style={{ width: `${((currentQuizQuestion + 1) / quizQuestions.length) * 100}%` }}
                              />
                            </div>
                          </div>
                          
                          <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border-2 border-gray-100">
                            <h3 className="font-bold text-xl mb-6 text-gray-800">
                              {quizQuestions[currentQuizQuestion].question}
                            </h3>
                            
                            <div className="space-y-3">
                              {quizQuestions[currentQuizQuestion].options.map((option, index) => (
                                <label key={index} className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:bg-cyan-50 hover:border-cyan-300 cursor-pointer transition-all duration-300 group">
                                  <input
                                    type="radio"
                                    name={`question-${currentQuizQuestion}`}
                                    value={index}
                                    onChange={() => handleQuizAnswer(currentQuizQuestion, index)}
                                    className="w-5 h-5 text-cyan-500 focus:ring-cyan-500"
                                  />
                                  <span className="text-lg group-hover:text-cyan-700 transition-colors duration-300">{option}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                          
                          <div className="flex justify-between mt-8">
                            <button
                              onClick={() => setCurrentQuizQuestion(Math.max(0, currentQuizQuestion - 1))}
                              disabled={currentQuizQuestion === 0}
                              className="px-6 py-3 border-2 border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 font-semibold transition-all duration-300"
                            >
                              ← Previous
                            </button>
                            
                            {currentQuizQuestion === quizQuestions.length - 1 ? (
                              <button
                                onClick={submitQuiz}
                                disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full font-semibold disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                              >
                                🎯 Submit Quiz
                              </button>
                            ) : (
                              <button
                                onClick={() => setCurrentQuizQuestion(currentQuizQuestion + 1)}
                                disabled={quizAnswers[currentQuizQuestion] === undefined}
                                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-full font-semibold disabled:opacity-50 flex items-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                              >
                                Next <ArrowRight size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <button
                            onClick={submitQuiz}
                            className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                          >
                            🎯 Submit Quiz
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="mb-6">
                        <div className={`text-6xl font-bold mb-2 ${quizScore >= 70 ? 'text-green-500' : 'text-red-500'}`}>
                          {quizScore}%
                        </div>
                        <p className="text-xl font-semibold text-gray-600">
                          {quizScore >= 70 ? '🎉 Outstanding! You passed the quiz!' : '📚 Please review the material and try again.'}
                        </p>
                      </div>
                      
                      {showQuizResults && (
                        <div className="text-left space-y-4 mt-8">
                          {quizQuestions.map((question, index) => (
                            <div key={index} className="border-2 border-gray-100 rounded-2xl p-6 bg-gradient-to-r from-white to-gray-50">
                              <p className="font-semibold text-lg mb-3 text-gray-800">{question.question}</p>
                              <p className={`text-sm mb-2 font-medium ${quizAnswers[index] === question.correct ? 'text-green-600' : 'text-red-600'}`}>
                                Your answer: {question.options[quizAnswers[index]] || 'Not answered'}
                              </p>
                              <p className="text-sm text-gray-600 mb-2">
                                Correct answer: {question.options[question.correct]}
                              </p>
                              <p className="text-sm text-cyan-600 bg-cyan-50 p-3 rounded-lg">{question.explanation}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {quizScore >= 70 && (
                        <div className="mt-8">
                          <button
                            onClick={() => setShowDiscipleship(true)}
                            className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                          >
                            🤝 Ready for Discipleship Reflection? Let's Apply What You've Learned!
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3/3 Discipleship Process - Expandable */}
        {quizCompleted && quizScore >= 70 && (
          <div className="space-y-4">
            <ExpandButton
              isOpen={showDiscipleship}
              onClick={() => setShowDiscipleship(!showDiscipleship)}
              icon="🤝"
            >
              3/3 Discipleship Process: Reflect, Learn, Apply
            </ExpandButton>

            {showDiscipleship && (
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in slide-in-from-top duration-500">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Users className="text-white" size={24} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">🤝 3/3 Discipleship Process</h2>
                      <p className="text-emerald-100">Reflect, Learn, and Apply God's Truth</p>
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border-2 border-red-200">
                    <h3 className="font-bold text-xl text-red-700 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-400 to-red-500 rounded-full flex items-center justify-center">
                        <Heart size={20} className="text-white" />
                      </div>
                      Look Back: How did God work in your life this week?
                    </h3>
                    <textarea
                      value={discipleshipResponses.lookBack}
                      onChange={(e) => setDiscipleshipResponses({
                        ...discipleshipResponses,
                        lookBack: e.target.value
                      })}
                      className="w-full p-4 border-2 border-red-200 rounded-xl focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all duration-300"
                      rows="4"
                      placeholder="Reflect on God's faithfulness, answers to prayer, challenges overcome..."
                    />
                  </div>

                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-6 rounded-2xl border-2 border-cyan-200">
                    <h3 className="font-bold text-xl text-cyan-700 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full flex items-center justify-center">
                        <Book size={20} className="text-white" />
                      </div>
                      Look Up: What did you learn from today's session?
                    </h3>
                    <textarea
                      value={discipleshipResponses.lookUp}
                      onChange={(e) => setDiscipleshipResponses({
                        ...discipleshipResponses,
                        lookUp: e.target.value
                      })}
                      className="w-full p-4 border-2 border-cyan-200 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all duration-300"
                      rows="4"
                      placeholder="Key insights, scripture that spoke to you, business principles..."
                    />
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                    <h3 className="font-bold text-xl text-green-700 mb-4 flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center">
                        <Target size={20} className="text-white" />
                      </div>
                      Look Forward: How will you apply this in your business/life?
                    </h3>
                    <textarea
                      value={discipleshipResponses.lookForward}
                      onChange={(e) => setDiscipleshipResponses({
                        ...discipleshipResponses,
                        lookForward: e.target.value
                      })}
                      className="w-full p-4 border-2 border-green-200 rounded-xl focus:border-green-400 focus:ring-2 focus:ring-green-100 transition-all duration-300"
                      rows="4"
                      placeholder="Specific actions, people to share with, business practices to change..."
                    />
                  </div>

                  <div className="text-center">
                    <button
                      onClick={saveDiscipleshipResponses}
                      className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                    >
                      💾 Save My Responses
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Progress Summary */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-cyan-500 to-slate-600 p-6 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Star className="text-white" size={28} />
              📊 Your Session Progress
            </h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${videoCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className={videoCompleted ? 'text-green-500' : 'text-gray-300'} size={24} />
                  <span className={`font-semibold ${videoCompleted ? 'text-green-700' : 'text-gray-500'}`}>
                    Watch Session Video
                  </span>
                </div>
                <p className="text-sm text-gray-600">Complete the video content</p>
              </div>
              
              <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${quizCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className={quizCompleted ? 'text-green-500' : 'text-gray-300'} size={24} />
                  <span className={`font-semibold ${quizCompleted ? 'text-green-700' : 'text-gray-500'}`}>
                    Complete Knowledge Quiz {quizCompleted && `(${quizScore}%)`}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Test your understanding</p>
              </div>
              
              <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${discipleshipResponses.lookBack && discipleshipResponses.lookUp && discipleshipResponses.lookForward ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className={discipleshipResponses.lookBack && discipleshipResponses.lookUp && discipleshipResponses.lookForward ? 'text-green-500' : 'text-gray-300'} size={24} />
                  <span className={`font-semibold ${discipleshipResponses.lookBack && discipleshipResponses.lookUp && discipleshipResponses.lookForward ? 'text-green-700' : 'text-gray-500'}`}>
                    3/3 Discipleship Process
                  </span>
                </div>
                <p className="text-sm text-gray-600">Reflect and apply learning</p>
              </div>
            </div>
            
            {videoCompleted && quizCompleted && discipleshipResponses.lookBack && discipleshipResponses.lookUp && discipleshipResponses.lookForward && (
              <div className="mt-8 p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl text-center">
                <div className="text-6xl mb-4">🎉</div>
                <p className="text-green-800 font-bold text-2xl mb-2">Congratulations!</p>
                <p className="text-green-700 text-lg mb-4">You've completed Session 1.1 with excellence!</p>
                <div className="bg-white p-4 rounded-xl border border-green-200">
                  <p className="text-green-600 font-semibold">🚀 Ready for Session 1.2:</p>
                  <p className="text-green-600">"Business Leaders Work Together with Church/Spiritual Leaders"</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* IBAM Footer */}
      <footer className="bg-gradient-to-r from-slate-800 via-slate-900 to-cyan-900 text-white mt-16">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <IBAMLogo size={60} />
                <div>
                  <h3 className="font-bold text-2xl">IBAM</h3>
                  <p className="text-cyan-300 font-semibold">DESIGNED TO THRIVE</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed">
                Empowering faith-driven business leaders to see their work as worship and their businesses as platforms for discipleship.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-cyan-300">Our Mission</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Integrate faith and business</li>
                <li>• Multiply disciples through marketplace ministry</li>
                <li>• Build God-honoring businesses</li>
                <li>• Transform communities through business</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4 text-cyan-300">Learning Modules</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Biblical Business Foundations</li>
                <li>• Leadership & Discipleship</li>
                <li>• Marketplace Ministry</li>
                <li>• Business Planning & Strategy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">
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