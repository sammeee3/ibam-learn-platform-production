'use client';

import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, Book, Users, Heart, Target, ArrowRight, Edit, Save, X } from 'lucide-react';

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
      scripture: "Genesis 1:27"
    },
    {
      title: "Dominion Mandate",
      description: "God gave us authority to steward His creation through work",
      scripture: "Genesis 1:28"
    },
    {
      title: "Good Work",
      description: "God saw His work was good, and our work can reflect His character",
      scripture: "Genesis 1:31"
    },
    {
      title: "Provision Through Work",
      description: "God provides for our needs through productive labor",
      scripture: "2 Thessalonians 3:10"
    },
    {
      title: "Service to Others",
      description: "Business allows us to serve others and meet their needs",
      scripture: "Galatians 5:13"
    },
    {
      title: "Stewardship",
      description: "We are called to wisely manage the resources God has given us",
      scripture: "Matthew 25:14-30"
    },
    {
      title: "Witness and Ministry",
      description: "Business provides opportunities to share God's love",
      scripture: "Matthew 5:16"
    }
  ];

  useEffect(() => {
    // Check user authentication and admin status
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
        
        // Check if user is admin
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
      alert('Discipleship responses saved successfully!');
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
        alert('Session updated successfully!');
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
        <span 
          className="text-blue-600 hover:text-blue-800 cursor-pointer underline"
          onMouseEnter={() => setShowVerse(true)}
          onMouseLeave={() => setShowVerse(false)}
          onClick={() => setShowVerse(!showVerse)}
        >
          {reference}
        </span>
        {showVerse && (
          <div className="absolute z-10 w-96 p-4 bg-white border border-gray-300 rounded-lg shadow-lg -top-2 left-full ml-2">
            <p className="text-sm font-semibold mb-2">{reference} (ESV)</p>
            <p className="text-sm leading-relaxed">{scriptureVerses[reference]}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {editMode && isAdmin ? (
                <input
                  type="text"
                  value={sessionData.title}
                  onChange={(e) => setSessionData({...sessionData, title: e.target.value})}
                  className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 bg-transparent"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900">{sessionData.title}</h1>
              )}
              {editMode && isAdmin ? (
                <input
                  type="text"
                  value={sessionData.subtitle}
                  onChange={(e) => setSessionData({...sessionData, subtitle: e.target.value})}
                  className="text-lg text-gray-600 border-b border-gray-300 bg-transparent mt-1"
                />
              ) : (
                <p className="text-lg text-gray-600">{sessionData.subtitle}</p>
              )}
            </div>
            {isAdmin && (
              <div className="flex gap-2">
                {editMode ? (
                  <>
                    <button
                      onClick={saveSessionData}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Edit size={16} />
                    Edit
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
            <span>Module 1 • Session 1.1</span>
            <span>•</span>
            <span>{sessionData.duration}</span>
            <span>•</span>
            <span>Scripture: <ScriptureReference reference={sessionData.scripture_reference} /></span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Learning Objective */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Target className="text-blue-600 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Learning Objective</h3>
              {editMode && isAdmin ? (
                <textarea
                  value={sessionData.learning_objective}
                  onChange={(e) => setSessionData({...sessionData, learning_objective: e.target.value})}
                  className="w-full p-2 border border-blue-200 rounded bg-white"
                  rows="2"
                />
              ) : (
                <p className="text-blue-800">{sessionData.learning_objective}</p>
              )}
            </div>
          </div>
        </div>

        {/* Video Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Play className="text-green-600" size={24} />
              <h2 className="text-xl font-semibold">Session Video</h2>
              {videoCompleted && <CheckCircle className="text-green-500" size={20} />}
            </div>
            
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
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
                  <p className="text-gray-500">Video will be available soon</p>
                </div>
              )}
            </div>
            
            {!videoCompleted && (
              <button
                onClick={handleVideoComplete}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Mark Video as Complete
              </button>
            )}
          </div>
        </div>

        {/* Seven Biblical Principles */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <Book className="text-purple-600" size={24} />
            <h2 className="text-xl font-semibold">Seven Biblical Principles: Why Business is God's Good Gift</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {biblicalPrinciples.map((principle, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{principle.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{principle.description}</p>
                    <ScriptureReference reference={principle.scripture} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Section */}
        {videoCompleted && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <Target className="text-orange-600" size={24} />
              <h2 className="text-xl font-semibold">Knowledge Check Quiz</h2>
              {quizCompleted && <CheckCircle className="text-green-500" size={20} />}
            </div>

            {!quizCompleted ? (
              <div>
                {currentQuizQuestion < quizQuestions.length ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm text-gray-500">
                        Question {currentQuizQuestion + 1} of {quizQuestions.length}
                      </span>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((currentQuizQuestion + 1) / quizQuestions.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-4">
                      {quizQuestions[currentQuizQuestion].question}
                    </h3>
                    
                    <div className="space-y-2">
                      {quizQuestions[currentQuizQuestion].options.map((option, index) => (
                        <label key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="radio"
                            name={`question-${currentQuizQuestion}`}
                            value={index}
                            onChange={() => handleQuizAnswer(currentQuizQuestion, index)}
                            className="text-orange-500"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                    </div>
                    
                    <div className="flex justify-between mt-6">
                      <button
                        onClick={() => setCurrentQuizQuestion(Math.max(0, currentQuizQuestion - 1))}
                        disabled={currentQuizQuestion === 0}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      
                      {currentQuizQuestion === quizQuestions.length - 1 ? (
                        <button
                          onClick={submitQuiz}
                          disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50"
                        >
                          Submit Quiz
                        </button>
                      ) : (
                        <button
                          onClick={() => setCurrentQuizQuestion(currentQuizQuestion + 1)}
                          disabled={quizAnswers[currentQuizQuestion] === undefined}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2"
                        >
                          Next <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={submitQuiz}
                    className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                  >
                    Submit Quiz
                  </button>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-4">
                  <div className={`text-4xl font-bold ${quizScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                    {quizScore}%
                  </div>
                  <p className="text-gray-600">
                    {quizScore >= 70 ? 'Great job! You passed the quiz.' : 'Please review the material and try again.'}
                  </p>
                </div>
                
                {showQuizResults && (
                  <div className="text-left space-y-4 mt-6">
                    {quizQuestions.map((question, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <p className="font-medium mb-2">{question.question}</p>
                        <p className={`text-sm ${quizAnswers[index] === question.correct ? 'text-green-600' : 'text-red-600'}`}>
                          Your answer: {question.options[quizAnswers[index]] || 'Not answered'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Correct answer: {question.options[question.correct]}
                        </p>
                        <p className="text-sm text-blue-600 mt-1">{question.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 3/3 Discipleship Process */}
        {quizCompleted && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <Users className="text-green-600" size={24} />
              <h2 className="text-xl font-semibold">3/3 Discipleship Process</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Heart size={16} className="text-red-500" />
                  Look Back: How did God work in your life this week?
                </h3>
                <textarea
                  value={discipleshipResponses.lookBack}
                  onChange={(e) => setDiscipleshipResponses({
                    ...discipleshipResponses,
                    lookBack: e.target.value
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Reflect on God's faithfulness, answers to prayer, challenges overcome..."
                />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Book size={16} className="text-blue-500" />
                  Look Up: What did you learn from today's session?
                </h3>
                <textarea
                  value={discipleshipResponses.lookUp}
                  onChange={(e) => setDiscipleshipResponses({
                    ...discipleshipResponses,
                    lookUp: e.target.value
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Key insights, scripture that spoke to you, business principles..."
                />
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <Target size={16} className="text-green-500" />
                  Look Forward: How will you apply this in your business/life?
                </h3>
                <textarea
                  value={discipleshipResponses.lookForward}
                  onChange={(e) => setDiscipleshipResponses({
                    ...discipleshipResponses,
                    lookForward: e.target.value
                  })}
                  className="w-full p-3 border border-gray-300 rounded-lg"
                  rows="3"
                  placeholder="Specific actions, people to share with, business practices to change..."
                />
              </div>

              <button
                onClick={saveDiscipleshipResponses}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Save Responses
              </button>
            </div>
          </div>
        )}

        {/* Progress Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Session Progress</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className={videoCompleted ? 'text-green-500' : 'text-gray-300'} size={20} />
              <span className={videoCompleted ? 'text-green-700' : 'text-gray-500'}>
                Watch Session Video
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className={quizCompleted ? 'text-green-500' : 'text-gray-300'} size={20} />
              <span className={quizCompleted ? 'text-green-700' : 'text-gray-500'}>
                Complete Knowledge Quiz {quizCompleted && `(${quizScore}%)`}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className={discipleshipResponses.lookBack && discipleshipResponses.lookUp && discipleshipResponses.lookForward ? 'text-green-500' : 'text-gray-300'} size={20} />
              <span className={discipleshipResponses.lookBack && discipleshipResponses.lookUp && discipleshipResponses.lookForward ? 'text-green-700' : 'text-gray-500'}>
                Complete 3/3 Discipleship Process
              </span>
            </div>
          </div>
          
          {videoCompleted && quizCompleted && discipleshipResponses.lookBack && discipleshipResponses.lookUp && discipleshipResponses.lookForward && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold">🎉 Congratulations! You've completed Session 1.1</p>
              <p className="text-green-700 text-sm mt-1">Ready to move on to Session 1.2: Business Leaders Work Together with Church/Spiritual Leaders</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Session1_1_Complete;