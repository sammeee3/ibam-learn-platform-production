"use client";
import React, { useState, useEffect } from 'react';
import { ChevronDown, Play, Download, Save, Trash2, CheckCircle, BookOpen, Target, Users, Clock, Star, Trophy } from 'lucide-react';

// Scripture Reference Component with ESV Hover
const ScriptureReference = ({ reference, children, className = "" }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // ESV Scripture Database
  const scriptureTexts = {
    "Genesis 1:26-27": "Then God said, \"Let us make man in our image, after our likeness. And let them have dominion over the fish of the sea and the birds of the heavens and over the livestock and over all the earth and over every creeping thing that creeps on the earth.\" So God created man in his own image, in the image of God he created him; male and female he created them.",
    
    "Genesis 1:26-31": "Then God said, \"Let us make man in our image, after our likeness. And let them have dominion over the fish of the sea and the birds of the heavens and over the livestock and over all the earth and over every creeping thing that creeps on the earth.\" So God created man in his own image, in the image of God he created him; male and female he created them. And God blessed them. And God said to them, \"Be fruitful and multiply and fill the earth and subdue it, and have dominion over the fish of the sea and the birds of the heavens and over every living creature that moves on the earth.\" And God said, \"Behold, I have given you every plant yielding seed that is on the face of all the earth, and every tree with seed in its fruit. You shall have them for food. And to every beast of the earth and to every bird of the heavens and to everything that creeps on the earth, everything that has the breath of life, I have given every green plant for food.\" And it was so. And God saw everything that he had made, and behold, it was very good. And there was evening and there was morning, the sixth day.",
    
    "Genesis 1:28": "And God blessed them. And God said to them, \"Be fruitful and multiply and fill the earth and subdue it, and have dominion over the fish of the sea and the birds of the heavens and over every living creature that moves on the earth.\"",
    
    "Acts 16:14": "One who heard us was a woman named Lydia, from the city of Thyatira, a seller of purple goods, who was a worshiper of God. The Lord opened her heart to pay attention to what was said by Paul.",
    
    "Acts 18:2-3": "And he found a Jew named Aquila, a native of Pontus, recently come from Italy with his wife Priscilla, because Claudius had commanded all the Jews to leave Rome. And he went to see them, and because he was of the same trade he stayed with them and worked, for they were tentmakers by trade.",
    
    "Ephesians 2:10": "For we are his workmanship, created in Christ Jesus for good works, which God prepared beforehand, that we should walk in them.",
    
    "Proverbs 16:1-9": "The plans of the heart belong to man, but the answer of the tongue is from the Lord. All the ways of a man are pure in his own eyes, but the Lord weighs the spirit. Commit your work to the Lord, and your plans will be established. The Lord has made everything for its purpose, even the wicked for the day of trouble. Everyone who is arrogant in heart is an abomination to the Lord; be assured, he will not go unpunished. By steadfast love and faithfulness iniquity is atoned for, and by the fear of the Lord one turns away from evil. When a man's ways please the Lord, he makes even his enemies to be at peace with him. Better is a little with righteousness than great revenues with injustice. The heart of man plans his way, but the Lord establishes his steps.",
    
    "Colossians 3:23": "Whatever you do, work heartily, as for the Lord and not for men.",
    
    "Matthew 25:21": "His master said to him, 'Well done, good and faithful servant. You were faithful over a little; I will set you over much. Enter into the joy of your master.'",
    
    "Proverbs 16:3": "Commit your work to the Lord, and your plans will be established."
  };

  const scriptureText = scriptureTexts[reference] || "Scripture text not available";

  return (
    <span 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="text-blue-600 font-semibold underline cursor-pointer hover:text-blue-800 transition-colors">
        {children || reference}
      </span>
      
      {showTooltip && (
        <div 
          className="absolute z-50 w-80 p-4 bg-white border-2 border-blue-200 rounded-lg shadow-2xl text-sm leading-relaxed"
          style={{
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '8px',
            maxWidth: '90vw'
          }}
        >
          <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
            <div className="font-bold text-blue-900 mb-2">{reference} (ESV)</div>
            <div className="text-gray-800 italic">"{scriptureText}"</div>
          </div>
          {/* Tooltip Arrow */}
          <div 
            className="absolute w-3 h-3 bg-white border-r-2 border-b-2 border-blue-200 transform rotate-45"
            style={{
              top: '100%',
              left: '50%',
              marginLeft: '-6px',
              marginTop: '-7px'
            }}
          ></div>
        </div>
      )}
    </span>
  );
};

const Session1_1_Complete = ({ sessionData, userProgress, onProgress, onSave }) => {
  // State management
  const [activeSections, setActiveSections] = useState(new Set(['looking-back', 'warm-up']));
  const [activeTab, setActiveTab] = useState('video');
  const [answers, setAnswers] = useState({});
  const [quizAnswers, setQuizAnswers] = useState({});
  const [confidenceRating, setConfidenceRating] = useState(0);
  const [saveStatuses, setSaveStatuses] = useState({});
  const [videoWatched, setVideoWatched] = useState(false);
  const [completedSections, setCompletedSections] = useState(new Set());

  // Session configuration - will be dynamic from props
  const sessionConfig = sessionData || {
    session_id: '1.1',
    session_title: 'Business is a Good Gift from God',
    module: 'Biblical Foundations for Business',
    video_url: 'https://player.vimeo.com/video/491439739?h=02b678490d&badge=0&autopause=0&player_id=0&app_id=58479',
    discipleship_video_url: 'https://player.vimeo.com/video/1071429083?h=c59adff869&title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479',
    duration: '25 minutes',
    learning_objective: 'Understand that business is part of God\'s original design and calling for humanity.'
  };

  // Load saved data on component mount
  useEffect(() => {
    loadSavedData();
    if (userProgress) {
      setAnswers(userProgress.answers || {});
      setVideoWatched(userProgress.videoWatched || false);
      setCompletedSections(new Set(userProgress.completedSections || []));
    }
  }, [userProgress]);

  const loadSavedData = () => {
    if (typeof window !== 'undefined') {
      try {
        // Load answers
        const savedAnswers = JSON.parse(localStorage.getItem('ibam_answers') || '{}');
        setAnswers(savedAnswers);

        // Load quiz answers
        const savedQuizAnswers = JSON.parse(localStorage.getItem('ibam_quiz_answers') || '{}');
        setQuizAnswers(savedQuizAnswers);

        // Load confidence rating
        const savedRating = localStorage.getItem('ibam_confidence_poll');
        if (savedRating) {
          setConfidenceRating(parseInt(savedRating));
        }
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  };

  const toggleSection = (sectionId) => {
    setActiveSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const showTab = (tabName) => {
    setActiveTab(tabName);
  };

  const saveAnswer = (answerId) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ibam_answers', JSON.stringify(answers));
        setSaveStatuses(prev => ({ ...prev, [answerId]: true }));
        
        // Call parent save function if provided
        if (onSave) {
          onSave({
            answerId,
            answer: answers[answerId],
            sessionId: sessionConfig.session_id
          });
        }
        
        setTimeout(() => {
          setSaveStatuses(prev => ({ ...prev, [answerId]: false }));
        }, 2000);
      } catch (error) {
        console.error('Error saving answer:', error);
      }
    }
  };

  const downloadAnswer = (answerId, filename) => {
    const answerText = answers[answerId];
    if (!answerText?.trim()) {
      alert('Please write something before downloading!');
      return;
    }

    const content = `IBAM Session ${sessionConfig.session_id} - ${sessionConfig.session_title}\n${filename}\nDate: ${new Date().toLocaleDateString()}\n\n${answerText}\n\n---\nThis is part of my IBAM Faith-Driven Business Training journey.`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const clearAnswer = (answerId) => {
    if (confirm('Are you sure you want to clear this answer? This cannot be undone.')) {
      setAnswers(prev => ({ ...prev, [answerId]: '' }));
    }
  };

  const updateAnswer = (answerId, value) => {
    setAnswers(prev => ({ ...prev, [answerId]: value }));
  };

  const setRating = (rating) => {
    setConfidenceRating(rating);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('ibam_confidence_poll', rating.toString());
      } catch (error) {
        console.error('Error saving confidence rating:', error);
      }
    }
  };

  const markVideoWatched = () => {
    setVideoWatched(true);
    setCompletedSections(prev => new Set([...prev, 'video']));
    if (onProgress) {
      onProgress({
        sessionId: sessionConfig.session_id,
        videoWatched: true,
        completedSections: Array.from(completedSections)
      });
    }
  };

  const ratingLabels = {
    1: "Not Confident",
    2: "Slightly Confident", 
    3: "Moderately Confident",
    4: "Very Confident",
    5: "Extremely Confident"
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto p-5 bg-white shadow-xl rounded-lg">
        {/* Session Header */}
        <div 
          className="text-white p-8 rounded-lg mb-8 text-left"
          style={{ background: 'linear-gradient(135deg, #2c5aa0, #4a7bc8)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm opacity-90">Module 1 • Session 1</div>
                <h1 className="text-3xl font-bold leading-tight">
                  {sessionConfig.session_title}
                </h1>
              </div>
            </div>
            
            {/* Progress Indicator */}
            <div className="text-right">
              <div className="text-sm opacity-90">Progress</div>
              <div className="text-2xl font-bold">
                {Math.round((completedSections.size / 8) * 100)}%
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-6 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{sessionConfig.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Faith-Driven Foundations</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>Individual & Group</span>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-400 p-6 rounded-lg mb-6">
          <div className="flex items-start space-x-3">
            <Target className="w-6 h-6 text-green-600 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-green-900 mb-2">Learning Objective</h4>
              <p className="text-green-800 leading-relaxed">
                {sessionConfig.learning_objective}
              </p>
            </div>
          </div>
        </div>

        {/* Key Scripture Focus */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 p-6 rounded-lg mb-8">
          <div className="flex items-start space-x-3">
            <BookOpen className="w-6 h-6 text-blue-600 mt-1" />
            <div>
              <h4 className="text-lg font-bold text-blue-900 mb-2">Key Scripture</h4>
              <p className="text-blue-800 italic leading-relaxed">
                "Then God said, 'Let us make man in our image, after our likeness. And let them have dominion 
                over the fish of the sea and over the birds of the heavens and over the livestock and over all 
                the earth and over every creeping thing that creeps on the earth.'" - {' '}
                <ScriptureReference reference="Genesis 1:26-27">
                  <strong className="text-blue-900">Genesis 1:26-27</strong>
                </ScriptureReference>
              </p>
            </div>
          </div>
        </div>

        {/* Three-Thirds Discipleship Structure */}
        
        {/* LOOKING BACK Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('looking-back')}
            className="w-full text-left p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">👈</span>
              </div>
              <div>
                <div className="text-xl font-bold">LOOKING BACK</div>
                <div className="text-blue-100">Celebration & Reflection</div>
              </div>
            </div>
            <ChevronDown 
              className={`w-6 h-6 transition-transform duration-300 ${
                activeSections.has('looking-back') ? 'rotate-180' : ''
              }`} 
            />
          </button>
          
          {activeSections.has('looking-back') && (
            <div className="bg-white border-2 border-blue-200 border-t-0 rounded-b-lg p-6">
              {/* Warm-Up Section */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                  🔥 Warm-Up & Opening Prayer
                </h3>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-6">
                  <p className="text-blue-900 mb-4">
                    <strong>Opening Prayer:</strong> "Lord, open our hearts and minds to understand Your design 
                    for work and business. Help us see entrepreneurship through Your eyes and discover how our 
                    calling to create and serve can honor You and bless others. Amen."
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 rounded-lg p-5">
                    <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-blue-800">
                      👥 For Groups
                    </h4>
                    <p className="mb-2"><strong>Quick Icebreaker:</strong> "Business Word Association"</p>
                    <p className="mb-2 text-sm">
                      Go around the circle and have each person share <strong>one word</strong> that comes to 
                      mind when they hear "Faith-driven business owner."
                    </p>
                    <p className="text-sm"><strong>Follow-up:</strong> "What do you notice about our responses?"</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-gray-50 to-purple-50 border-2 border-gray-200 rounded-lg p-5">
                    <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-purple-800">
                      👤 For Individuals
                    </h4>
                    <p className="mb-2"><strong>Personal Reflection:</strong> Journal writing (3 minutes)</p>
                    <p className="mb-2 text-sm">
                      <strong>Prompt:</strong> "When I think about starting my own business, I feel..." 
                    </p>
                    <p className="text-sm"><strong>Consider:</strong> What emotions came up? Excitement? Fear? Guilt?</p>
                  </div>
                </div>

                {/* Confidence Rating */}
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-6 text-center">
                  <h4 className="text-lg font-bold text-yellow-800 mb-3 flex items-center justify-center gap-2">
                    <Star className="w-5 h-5" />
                    Quick Confidence Poll
                  </h4>
                  <p className="mb-4 text-yellow-800"><strong>Rate yourself (1-5 scale):</strong></p>
                  <p className="mb-4 text-yellow-900">"How confident do I feel about starting a Faith-Driven business that honors God?"</p>
                  
                  <div className="flex justify-center items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setRating(rating)}
                        className={`text-4xl transition-all duration-200 hover:scale-110 ${
                          rating <= confidenceRating 
                            ? 'text-yellow-400 scale-110 drop-shadow-lg' 
                            : 'text-gray-300 hover:text-yellow-300'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  
                  {confidenceRating > 0 && (
                    <div className="bg-white/50 rounded-lg p-3">
                      <p className="font-bold text-yellow-800">
                        {ratingLabels[confidenceRating]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* LOOKING UP Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('looking-up')}
            className="w-full text-left p-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">☝️</span>
              </div>
              <div>
                <div className="text-xl font-bold">LOOKING UP</div>
                <div className="text-green-100">Learning from God's Word</div>
              </div>
            </div>
            <ChevronDown 
              className={`w-6 h-6 transition-transform duration-300 ${
                activeSections.has('looking-up') ? 'rotate-180' : ''
              }`} 
            />
          </button>
          
          {activeSections.has('looking-up') && (
            <div className="bg-white border-2 border-green-200 border-t-0 rounded-b-lg p-6">
              {/* Video Section */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                  🎥 Teaching Video: "Business is a Good Gift from God"
                </h3>
                
                <div className="bg-black rounded-lg overflow-hidden mb-4">
                  <div className="relative pb-[56.25%] h-0">
                    <iframe
                      src={sessionConfig.video_url}
                      className="absolute top-0 left-0 w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                      title={sessionConfig.session_title}
                    ></iframe>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {sessionConfig.duration}
                    </span>
                  </div>
                  <button
                    onClick={markVideoWatched}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      videoWatched 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {videoWatched ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Completed
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" />
                        Mark as Watched
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Scripture Study */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h4 className="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                  📖 Scripture Study & Reflection
                </h4>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <h5 className="font-semibold text-blue-800 mb-2">Key Passages:</h5>
                    <ul className="space-y-2 text-sm">
                      <li>• <ScriptureReference reference="Genesis 1:26-31">Genesis 1:26-31</ScriptureReference> - God's original design for work</li>
                      <li>• <ScriptureReference reference="Acts 16:14">Acts 16:14</ScriptureReference> - Lydia the businesswoman</li>
                      <li>• <ScriptureReference reference="Acts 18:2-3">Acts 18:2-3</ScriptureReference> - Aquila and Priscilla's business</li>
                      <li>• <ScriptureReference reference="Ephesians 2:10">Ephesians 2:10</ScriptureReference> - Created for good works</li>
                    </ul>
                  </div>
                </div>

                <textarea
                  className="w-full min-h-32 p-4 border border-blue-300 rounded-lg resize-y text-sm"
                  placeholder="What do these scriptures teach you about business and calling?

Genesis 1:26-31:

Acts 16:14 (Lydia):

Acts 18:2-3 (Aquila & Priscilla):

Ephesians 2:10:

How do these apply to your life?"
                  value={answers['scripture-reflections'] || ''}
                  onChange={(e) => updateAnswer('scripture-reflections', e.target.value)}
                />
                
                <div className="flex gap-2 mt-3 flex-wrap">
                  <button
                    onClick={() => saveAnswer('scripture-reflections')}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={() => downloadAnswer('scripture-reflections', 'Scripture-Reflections')}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  {saveStatuses['scripture-reflections'] && (
                    <span className="flex items-center gap-1 text-green-600 font-medium text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Saved!
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* LOOKING FORWARD Section */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('looking-forward')}
            className="w-full text-left p-6 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">👉</span>
              </div>
              <div>
                <div className="text-xl font-bold">LOOKING FORWARD</div>
                <div className="text-purple-100">Action Steps & Commitments</div>
              </div>
            </div>
            <ChevronDown 
              className={`w-6 h-6 transition-transform duration-300 ${
                activeSections.has('looking-forward') ? 'rotate-180' : ''
              }`} 
            />
          </button>
          
          {activeSections.has('looking-forward') && (
            <div className="bg-white border-2 border-purple-200 border-t-0 rounded-b-lg p-6">
              {/* Action Steps and Commitments content will go here */}
              <p className="text-gray-600">Action steps and commitments section content.</p>
            </div>
          )}
        </div>

        {/* Session Complete */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-8 rounded-lg text-center">
          <Trophy className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">Session Complete!</h3>
          <p className="text-green-100 mb-6">
            You've taken the first step in your Faith-Driven Business journey. 
            Remember: God has called you to use business as a platform for His glory.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors">
              Next Session
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-green-600 transition-colors">
              Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Session1_1_Complete;