'use client';

import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Book, Users, Heart, Target, ArrowRight, Edit, Save, X, Star, Award, ChevronDown, ChevronUp, Lock, Unlock, Clock, Trophy, Zap, Lightbulb } from 'lucide-react';

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

  // Seven Biblical Principles
  const biblicalPrinciples = [
    {
      title: "God's Image Bearers",
      description: "We are created in God's image to be creative and productive",
      scripture: "Genesis 1:27",
      icon: "👑",
      color: "from-purple-500 to-purple-700"
    },
    {
      title: "Dominion Mandate", 
      description: "God gave us authority to steward His creation through work",
      scripture: "Genesis 1:28",
      icon: "🌍",
      color: "from-green-500 to-green-700"
    },
    {
      title: "Good Work",
      description: "God saw His work was good, and our work can reflect His character",
      scripture: "Genesis 1:31",
      icon: "⭐",
      color: "from-yellow-500 to-orange-600"
    },
    {
      title: "Provision Through Work",
      description: "God provides for our needs through productive labor",
      scripture: "2 Thessalonians 3:10",
      icon: "🌾",
      color: "from-amber-500 to-orange-600"
    },
    {
      title: "Service to Others",
      description: "Business allows us to serve others and meet their needs",
      scripture: "Galatians 5:13",
      icon: "🤝",
      color: "from-blue-500 to-blue-700"
    },
    {
      title: "Stewardship",
      description: "We are called to wisely manage the resources God has given us",
      scripture: "Matthew 25:14-30",
      icon: "💼",
      color: "from-indigo-500 to-indigo-700"
    },
    {
      title: "Witness and Ministry",
      description: "Business provides opportunities to share God's love",
      scripture: "Matthew 5:16",
      icon: "💡",
      color: "from-pink-500 to-pink-700"
    }
  ];

  // IBAM Logo Component - Using actual logo
  const IBAMLogo = ({ size = 80 }) => (
    <div className={`relative flex items-center`} style={{ height: size }}>
      <img 
        src="https://images.squarespace-cdn.com/content/v1/5d3f8b5e4b49e10001d5f3e1/1625851877786-QR3ZXJV8Y1OYXQHQXZJY/IBAM+Logo+Horizontal+Reverse.png" 
        alt="IBAM - Designed to Thrive"
        className="h-full w-auto drop-shadow-lg"
        style={{ height: size }}
      />
    </div>
  );

  const ProgressCard = ({ completed, title, description, icon }) => (
    <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${
      completed 
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-lg' 
        : 'bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200'
    }`}>
      <div className="flex items-center gap-3">
        {completed ? (
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <CheckCircle className="text-white" size={20} />
          </div>
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            {icon}
          </div>
        )}
        <div>
          <h4 className={`font-semibold ${completed ? 'text-green-800' : 'text-gray-600'}`}>
            {title}
          </h4>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );

  const SectionCard = ({ 
    id, 
    title, 
    subtitle, 
    icon, 
    isLocked, 
    isCompleted, 
    isActive, 
    color, 
    onClick, 
    children 
  }) => (
    <div className={`rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 ${
      isActive ? 'ring-4 ring-cyan-300 ring-opacity-50' : ''
    }`}>
      <button
        onClick={onClick}
        disabled={isLocked}
        className={`w-full p-8 text-left transition-all duration-300 ${
          isLocked 
            ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed' 
            : `bg-gradient-to-r ${color} hover:scale-[1.02] cursor-pointer`
        }`}
      >
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              {isLocked ? <Lock size={32} /> : icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">{title}</h3>
              <p className="text-lg opacity-90">{subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isCompleted && (
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle size={24} />
              </div>
            )}
            {isLocked ? (
              <Lock size={24} />
            ) : (
              <ChevronDown className={`transition-transform duration-300 ${isActive ? 'rotate-180' : ''}`} size={24} />
            )}
          </div>
        </div>
      </button>
      
      {isActive && !isLocked && (
        <div className="bg-white animate-in slide-in-from-top duration-500">
          {children}
        </div>
      )}
    </div>
  );

  const ScriptureReference = ({ reference }) => {
    const [showVerse, setShowVerse] = useState(false);
    
    return (
      <div className="relative inline-block">
        <button 
          className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 hover:scale-105"
          onClick={() => setShowVerse(!showVerse)}
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

  // Initialize functions
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
        alert('✅ Session updated successfully!');
      }
    } catch (error) {
      console.error('Failed to save session:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <IBAMLogo size={100} />
              <div>
                <h1 className="text-4xl font-bold mb-2">{sessionData.title}</h1>
                <p className="text-xl text-indigo-100">{sessionData.subtitle}</p>
              </div>
            </div>
            
            {isAdmin && (
              <button
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm"
              >
                <Edit size={18} />
                Admin
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-8 mt-6 text-indigo-100">
            <div className="flex items-center gap-2">
              <Award size={18} />
              <span className="font-semibold">Module 1 • Session 1.1</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span className="font-semibold">{sessionData.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Scripture Study:</span>
              <ScriptureReference reference={sessionData.scripture_reference} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Progress Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <ProgressCard
            completed={videoCompleted}
            title="Watch Video"
            description="Complete the session content"
            icon={<Play size={20} className="text-gray-500" />}
          />
          <ProgressCard
            completed={quizCompleted}
            title={`Knowledge Quiz ${quizCompleted ? `(${quizScore}%)` : ''}`}
            description="Test your understanding"
            icon={<Trophy size={20} className="text-gray-500" />}
          />
          <ProgressCard
            completed={discipleshipResponses.lookBack && discipleshipResponses.lookUp && discipleshipResponses.lookForward}
            title="3/3 Discipleship"
            description="Reflect and apply learning"
            icon={<Heart size={20} className="text-gray-500" />}
          />
        </div>

        {/* Learning Objective Card */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-8 mb-12 shadow-2xl">
          <div className="flex items-start gap-6 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Target size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-4">🎯 Learning Objective</h3>
              <p className="text-xl leading-relaxed opacity-95">{sessionData.learning_objective}</p>
            </div>
          </div>
        </div>

        {/* Interactive Learning Sections */}
        <div className="space-y-8">
          {/* Video Section */}
          <SectionCard
            id="video"
            title="🎥 Session Video"
            subtitle="Watch and engage with today's content"
            icon={<Play size={32} />}
            isLocked={false}
            isCompleted={videoCompleted}
            isActive={activeSection === 'video'}
            color="from-green-500 to-emerald-600"
            onClick={() => setActiveSection(activeSection === 'video' ? '' : 'video')}
          >
            <div className="p-12">
              <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-gray-700" style={{ minHeight: '500px' }}>
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
                    <div className="text-center text-white">
                      <Play className="mx-auto mb-6" size={80} />
                      <p className="text-2xl">Video will be available soon</p>
                    </div>
                  </div>
                )}
              </div>
              
              {!videoCompleted && (
                <div className="mt-12 text-center">
                  <button
                    onClick={handleVideoComplete}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-16 py-6 rounded-full font-bold text-xl transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                  >
                    ✅ Mark Video as Complete
                  </button>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Biblical Principles Section */}
          <SectionCard
            id="principles"
            title="📚 Seven Biblical Principles"
            subtitle="Why Business is God's Good Gift"
            icon={<Book size={32} />}
            isLocked={!videoCompleted}
            isCompleted={videoCompleted}
            isActive={activeSection === 'principles'}
            color="from-purple-500 to-purple-700"
            onClick={() => videoCompleted && setActiveSection(activeSection === 'principles' ? '' : 'principles')}
          >
            <div className="p-8">
              <div className="grid lg:grid-cols-2 gap-6">
                {biblicalPrinciples.map((principle, index) => (
                  <div
                    key={index}
                    className="group hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    <div className={`h-full rounded-2xl p-6 bg-gradient-to-br ${principle.color} text-white shadow-xl hover:shadow-2xl transition-all duration-300`}>
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
                          {principle.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center font-bold text-sm backdrop-blur-sm">
                              {index + 1}
                            </span>
                            <h3 className="font-bold text-xl">{principle.title}</h3>
                          </div>
                          <p className="text-white/90 mb-4 leading-relaxed">{principle.description}</p>
                          <ScriptureReference reference={principle.scripture} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {videoCompleted && (
                <div className="mt-8 text-center">
                  <button
                    onClick={() => setActiveSection('quiz')}
                    className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                  >
                    🧠 Ready for the Quiz? Test Your Knowledge!
                  </button>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Quiz Section */}
          <SectionCard
            id="quiz"
            title="🧠 Knowledge Check Quiz"
            subtitle="Test your understanding of today's content"
            icon={<Trophy size={32} />}
            isLocked={!videoCompleted}
            isCompleted={quizCompleted}
            isActive={activeSection === 'quiz'}
            color="from-orange-500 to-red-600"
            onClick={() => videoCompleted && setActiveSection(activeSection === 'quiz' ? '' : 'quiz')}
          >
            <div className="p-8">
              {!quizCompleted ? (
                <div>
                  {currentQuizQuestion < quizQuestions.length ? (
                    <div className="space-y-8">
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-gray-700">
                          Question {currentQuizQuestion + 1} of {quizQuestions.length}
                        </span>
                        <div className="w-64 bg-gray-200 rounded-full h-4 shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-600 h-4 rounded-full transition-all duration-500 shadow-lg"
                            style={{ width: `${((currentQuizQuestion + 1) / quizQuestions.length) * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-slate-50 to-gray-100 p-8 rounded-2xl border-2 border-gray-200 shadow-lg">
                        <h3 className="font-bold text-2xl mb-8 text-gray-800">
                          {quizQuestions[currentQuizQuestion].question}
                        </h3>
                        
                        <div className="space-y-4">
                          {quizQuestions[currentQuizQuestion].options.map((option, index) => (
                            <label key={index} className="flex items-center gap-4 p-6 border-2 border-gray-200 rounded-2xl hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 hover:border-cyan-300 cursor-pointer transition-all duration-300 group shadow-sm hover:shadow-md">
                              <input
                                type="radio"
                                name={`question-${currentQuizQuestion}`}
                                value={index}
                                onChange={() => handleQuizAnswer(currentQuizQuestion, index)}
                                className="w-6 h-6 text-cyan-600 focus:ring-cyan-500 focus:ring-2"
                              />
                              <span className="text-lg group-hover:text-cyan-700 transition-colors duration-300 font-medium">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <button
                          onClick={() => setCurrentQuizQuestion(Math.max(0, currentQuizQuestion - 1))}
                          disabled={currentQuizQuestion === 0}
                          className="px-8 py-4 border-2 border-gray-300 rounded-full hover:bg-gray-50 disabled:opacity-50 font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          ← Previous
                        </button>
                        
                        {currentQuizQuestion === quizQuestions.length - 1 ? (
                          <button
                            onClick={submitQuiz}
                            disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                            className="px-12 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-full font-bold text-lg disabled:opacity-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none"
                          >
                            🎯 Submit Quiz
                          </button>
                        ) : (
                          <button
                            onClick={() => setCurrentQuizQuestion(currentQuizQuestion + 1)}
                            disabled={quizAnswers[currentQuizQuestion] === undefined}
                            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-full font-bold text-lg disabled:opacity-50 flex items-center gap-2 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none"
                          >
                            Next <ArrowRight size={20} />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-8">
                    <div className={`text-8xl font-bold mb-4 ${quizScore >= 70 ? 'text-green-500' : 'text-red-500'}`}>
                      {quizScore}%
                    </div>
                    <p className="text-2xl font-bold text-gray-700">
                      {quizScore >= 70 ? '🎉 Outstanding! You passed the quiz!' : '📚 Please review the material and try again.'}
                    </p>
                  </div>
                  
                  {quizScore >= 70 && (
                    <button
                      onClick={() => setActiveSection('discipleship')}
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-12 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                    >
                      🤝 Continue to Discipleship Reflection
                    </button>
                  )}
                </div>
              )}
            </div>
          </SectionCard>

          {/* 3/3 Discipleship Section */}
          <SectionCard
            id="discipleship"
            title="🤝 3/3 Discipleship Process"
            subtitle="Reflect, Learn, and Apply God's Truth"
            icon={<Users size={32} />}
            isLocked={!quizCompleted || quizScore < 70}
            isCompleted={discipleshipResponses.lookBack && discipleshipResponses.lookUp && discipleshipResponses.lookForward}
            isActive={activeSection === 'discipleship'}
            color="from-emerald-500 to-teal-600"
            onClick={() => (quizCompleted && quizScore >= 70) && setActiveSection(activeSection === 'discipleship' ? '' : 'discipleship')}
          >
            <div className="p-8 space-y-8">
              <div className="bg-gradient-to-br from-red-50 to-pink-50 p-8 rounded-2xl border-2 border-red-200 shadow-lg">
                <h3 className="font-bold text-2xl text-red-700 mb-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Heart size={24} className="text-white" />
                  </div>
                  Look Back: How did God work in your life this week?
                </h3>
                <textarea
                  value={discipleshipResponses.lookBack}
                  onChange={(e) => setDiscipleshipResponses({
                    ...discipleshipResponses,
                    lookBack: e.target.value
                  })}
                  className="w-full p-6 border-2 border-red-200 rounded-2xl focus:border-red-400 focus:ring-4 focus:ring-red-100 transition-all duration-300 text-lg"
                  rows="4"
                  placeholder="Reflect on God's faithfulness, answers to prayer, challenges overcome..."
                />
              </div>

              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-2xl border-2 border-cyan-200 shadow-lg">
                <h3 className="font-bold text-2xl text-cyan-700 mb-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Lightbulb size={24} className="text-white" />
                  </div>
                  Look Up: What did you learn from today's session?
                </h3>
                <textarea
                  value={discipleshipResponses.lookUp}
                  onChange={(e) => setDiscipleshipResponses({
                    ...discipleshipResponses,
                    lookUp: e.target.value
                  })}
                  className="w-full p-6 border-2 border-cyan-200 rounded-2xl focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 transition-all duration-300 text-lg"
                  rows="4"
                  placeholder="Key insights, scripture that spoke to you, business principles..."
                />
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-200 shadow-lg">
                <h3 className="font-bold text-2xl text-green-700 mb-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Zap size={24} className="text-white" />
                  </div>
                  Look Forward: How will you apply this in your business/life?
                </h3>
                <textarea
                  value={discipleshipResponses.lookForward}
                  onChange={(e) => setDiscipleshipResponses({
                    ...discipleshipResponses,
                    lookForward: e.target.value
                  })}
                  className="w-full p-6 border-2 border-green-200 rounded-2xl focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-lg"
                  rows="4"
                  placeholder="Specific actions, people to share with, business practices to change..."
                />
              </div>

              <div className="text-center">
                <button
                  onClick={saveDiscipleshipResponses}
                  className="px-12 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                >
                  💾 Save My Responses
                </button>
              </div>
            </div>
          </SectionCard>
        </div>

        {/* Completion Celebration */}
        {videoCompleted && quizCompleted && discipleshipResponses.lookBack && discipleshipResponses.lookUp && discipleshipResponses.lookForward && (
          <div className="mt-12 p-12 bg-gradient-to-br from-green-100 to-emerald-100 border-4 border-green-300 rounded-3xl text-center shadow-2xl">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-4xl font-bold text-green-800 mb-4">Congratulations!</h2>
            <p className="text-2xl text-green-700 mb-8">You've completed Session 1.1 with excellence!</p>
            <div className="bg-white p-8 rounded-2xl border-2 border-green-200 shadow-lg">
              <p className="text-green-600 font-bold text-xl mb-2">🚀 Ready for Session 1.2:</p>
              <p className="text-green-600 text-lg">"Business Leaders Work Together with Church/Spiritual Leaders"</p>
            </div>
          </div>
        )}
      </div>

      {/* Modern Footer */}
      <footer className="bg-gradient-to-r from-slate-800 via-slate-900 to-cyan-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <IBAMLogo size={64} />
                <div>
                  <h3 className="font-bold text-2xl">IBAM</h3>
                  <p className="text-cyan-300 font-semibold">DESIGNED TO THRIVE</p>
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                Empowering faith-driven business leaders to see their work as worship and their businesses as platforms for discipleship.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-xl mb-6 text-cyan-300">Our Mission</h4>
              <ul className="space-y-3 text-gray-300 text-lg">
                <li>• Integrate faith and business</li>
                <li>• Multiply disciples through marketplace ministry</li>
                <li>• Build God-honoring businesses</li>
                <li>• Transform communities through business</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-xl mb-6 text-cyan-300">Learning Modules</h4>
              <ul className="space-y-3 text-gray-300 text-lg">
                <li>• Biblical Business Foundations</li>
                <li>• Leadership & Discipleship</li>
                <li>• Marketplace Ministry</li>
                <li>• Business Planning & Strategy</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400 text-lg">
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