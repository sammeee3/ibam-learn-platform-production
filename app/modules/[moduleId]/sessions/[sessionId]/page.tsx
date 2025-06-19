'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

// Session data structure - dynamic content per session
const sessionData: Record<string, Record<string, any>> = {
  "1": {
    "1": {
      title: "Business is a Good Gift from God",
      module: "Foundational Principles",
      scripture: {
        reference: "Genesis 1:26",
        text: "Then God said, 'Let us make mankind in our image, in our likeness, so that they may rule over the fish in the sea and the birds in the sky, over the livestock and all the wild animals, and over all the creatures that move along the ground.'"
      },
      videoUrl: "https://vimeo.com/your-video-id",
      writtenMaterial: "God designed humans to be creative, productive, and to exercise dominion over creation. Business is not a necessary evil or distraction from spiritual matters - it's a reflection of God's image in us. When we create value, serve others, and steward resources well, we mirror our Creator's character.",
      reflection: "How does viewing business as a reflection of God's image change your perspective on your work?",
      becomingGodsEntrepreneur: {
        content: "As God's entrepreneur, you're called to blend excellence with integrity, profit with purpose, and success with service.",
        questions: [
          "What would change in your business if you truly believed it was a gift from God?",
          "How can your business reflect God's creativity and generosity?"
        ]
      },
      caseStudy: "Sarah owns a local bakery. She started viewing her business as ministry when she realized that providing excellent bread and pastries was serving her community. She began praying over her work, treating employees as family, and donating day-old goods to the homeless shelter.",
      faqQuestions: [
        "Q: Can I really make money and still honor God? A: Yes! God desires us to prosper while maintaining integrity.",
        "Q: What if my business isn't explicitly Christian? A: Your character and excellence can reflect Christ in any business.",
        "Q: How do I balance profit and generosity? A: Sustainable generosity requires profitable operations."
      ],
      businessPlanQuestions: [
        "How will your business reflect God's character and values?",
        "What impact do you want your business to have on your community?",
        "How can your business serve as a platform for spiritual conversations?"
      ]
    },
    "2": {
      title: "Business Leaders Work Together with Church/Spiritual Leaders",
      module: "Foundational Principles",
      scripture: {
        reference: "1 Corinthians 12:12-14",
        text: "Just as a body, though one, has many parts, but all its many parts form one body, so it is with Christ. For we were all baptized by one Spirit so as to form one body—whether Jews or Gentiles, slave or free—and we were all given the one Spirit to drink. Even so the body is not made up of one part but of many."
      },
      videoUrl: "https://vimeo.com/your-video-id-2",
      writtenMaterial: "The church and marketplace are not separate kingdoms but different parts of God's single kingdom. Business leaders bring resources, organizational skills, and community connections. Church leaders bring spiritual wisdom, pastoral care, and theological grounding. Together, they can accomplish kingdom work neither could achieve alone.",
      reflection: "What unique strengths do you bring as a business leader that could benefit your local church or community ministry?",
      becomingGodsEntrepreneur: {
        content: "God's entrepreneurs understand they're part of a larger body, working in harmony with spiritual leaders to advance God's kingdom.",
        questions: [
          "How can you partner with church leaders without compromising your business integrity?",
          "What kingdom projects could benefit from your business skills and resources?"
        ]
      },
      caseStudy: "Mark, a construction company owner, partnered with his pastor to build homes for single mothers. The church provided spiritual care and community support while Mark's business provided construction expertise and materials at cost.",
      faqQuestions: [
        "Q: What if my pastor doesn't understand business? A: Start small, build trust, and educate gently.",
        "Q: How do I avoid being seen as just a source of money? A: Offer your skills and expertise, not just finances.",
        "Q: What if business and church priorities conflict? A: Seek wisdom through prayer and trusted advisors."
      ],
      businessPlanQuestions: [
        "What partnerships could you develop between your business and local church/ministry leaders?",
        "How can your business skills serve kingdom purposes beyond just financial giving?",
        "What community needs could be addressed through business-ministry collaboration?"
      ]
    },
    "3": {
      title: "Integrity in Business Practices",
      module: "Foundational Principles", 
      scripture: {
        reference: "Proverbs 11:1",
        text: "The Lord detests dishonest scales, but accurate weights find favor with him."
      },
      videoUrl: "https://vimeo.com/your-video-id-3",
      writtenMaterial: "Integrity in business means more than just avoiding obvious fraud - it means complete honesty in all dealings, fair treatment of employees and customers, and transparency in communication. God cares about the details of how we conduct business because our character is revealed in small decisions as much as large ones.",
      reflection: "What areas of your business practices need greater alignment with biblical integrity standards?",
      becomingGodsEntrepreneur: {
        content: "God's entrepreneurs build their reputation on trustworthiness, knowing that integrity is the foundation of sustainable business relationships.",
        questions: [
          "How can you demonstrate integrity even when it costs you short-term profit?",
          "What systems can you put in place to ensure honest practices throughout your business?"
        ]
      },
      caseStudy: "Tom's auto repair shop built a loyal customer base by providing honest estimates, explaining all work performed, and standing behind their repairs with genuine warranties. While competitors cut corners, Tom's integrity-based approach led to sustainable growth.",
      faqQuestions: [
        "Q: What if being completely honest hurts my competitiveness? A: Long-term trust builds stronger business than short-term deception.",
        "Q: How detailed should I be about problems or limitations? A: Transparent communication builds credibility.",
        "Q: What if my industry standard practices seem questionable? A: Be the example of a better way to do business."
      ],
      businessPlanQuestions: [
        "What specific integrity standards will guide your business decisions?",
        "How will you communicate your commitment to honesty with customers and employees?",
        "What accountability measures will you implement to maintain high integrity standards?"
      ]
    },
    "4": {
      title: "Stewardship and Resource Management",
      module: "Foundational Principles",
      scripture: {
        reference: "Luke 16:10",
        text: "Whoever is faithful in very little is also faithful in much, and whoever is dishonest in very little is also dishonest in much."
      },
      videoUrl: "https://vimeo.com/your-video-id-4",
      writtenMaterial: "Everything we have - money, time, talents, opportunities - ultimately belongs to God. We are stewards, not owners. This perspective changes how we make decisions about spending, investing, hiring, and growing our businesses. Good stewardship means maximizing the return on God's investment in us while serving others and advancing His kingdom.",
      reflection: "How does viewing yourself as a steward rather than an owner change your approach to business decisions?",
      becomingGodsEntrepreneur: {
        content: "God's entrepreneurs recognize their role as stewards of divine resources, making decisions that honor the true Owner while serving others effectively.",
        questions: [
          "What would change in your financial decisions if you truly believed everything belongs to God?",
          "How can you balance wise business growth with generous kingdom investment?"
        ]
      },
      caseStudy: "Maria's consulting firm implemented a stewardship model: 10% of profits go to kingdom work, employees receive profit sharing, and business decisions prioritize long-term value creation over short-term gains. This approach attracted top talent and loyal clients.",
      faqQuestions: [
        "Q: Does stewardship mean I can't build wealth? A: Good stewards can build wealth responsibly while serving others.",
        "Q: How much should I give away vs. reinvest in business? A: Seek God's guidance for your specific situation and season.",
        "Q: What if I disagree with how others think I should use 'my' resources? A: You're accountable to God first, but wisdom seeks godly counsel."
      ],
      businessPlanQuestions: [
        "How will you demonstrate faithful stewardship in your business operations?",
        "What percentage of profits will you allocate to kingdom advancement?",
        "How will you balance reinvestment, personal income, and generosity in your financial planning?"
      ]
    }
  },
  // Add Module 5, Session 3 data for final session
  "5": {
    "3": {
      title: "Implementation and Launch Strategy",
      module: "Business Planning",
      scripture: {
        reference: "Jeremiah 29:11",
        text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future."
      },
      videoUrl: "https://vimeo.com/your-video-id-final",
      writtenMaterial: "Congratulations! You've completed an incredible journey through Faith-Driven Business principles. This final session focuses on implementing everything you've learned and launching your business with biblical foundations. Remember, this is not an ending but a beginning of your marketplace ministry.",
      reflection: "How has your understanding of business as ministry evolved throughout this course?",
      becomingGodsEntrepreneur: {
        content: "As you launch your Faith-Driven business, remember that you're equipped to multiply disciples through your marketplace influence.",
        questions: [
          "What are your top 3 action steps for implementing these principles?",
          "How will you measure success in both business and kingdom impact?"
        ]
      },
      caseStudy: "David launched his consulting firm with clear kingdom values, prayer-based decision making, and intentional discipleship relationships with clients and employees. Within two years, he was mentoring 12 other business leaders and supporting 3 church plants.",
      faqQuestions: [
        "Q: How do I maintain these principles under business pressure? A: Build accountability systems and regular spiritual disciplines.",
        "Q: What if my business faces major challenges? A: Trust God's sovereignty while taking wise action.",
        "Q: How do I continue growing as a Faith-Driven entrepreneur? A: Stay connected to other kingdom business leaders and continue learning."
      ],
      businessPlanQuestions: [
        "What specific steps will you take in the next 30 days to implement your Faith-Driven business plan?",
        "How will you continue your growth as a kingdom entrepreneur?",
        "What legacy do you want your business to leave for God's kingdom?"
      ]
    }
  }
};

// Module configuration for navigation
const moduleConfig = {
  "1": { name: "Foundational Principles", totalSessions: 4 },
  "2": { name: "Success and Failure Factors", totalSessions: 4 },
  "3": { name: "Marketing", totalSessions: 5 },
  "4": { name: "Finance", totalSessions: 4 },
  "5": { name: "Business Planning", totalSessions: 3 }
};

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params?.moduleId as string;
  const sessionId = params?.sessionId as string;
  
  const session = sessionData[moduleId]?.[sessionId] || {
    title: "Session Content Loading...",
    module: "Module Loading...",
    scripture: { reference: "Loading...", text: "Content being prepared..." },
    videoUrl: "",
    writtenMaterial: "Content loading...",
    reflection: "Content loading...",
    becomingGodsEntrepreneur: { content: "Loading...", questions: ["Loading..."] },
    caseStudy: "Loading...",
    faqQuestions: ["Loading..."],
    businessPlanQuestions: ["Loading..."]
  };

  const currentModule = moduleConfig[moduleId as keyof typeof moduleConfig];
  const totalSessions = currentModule?.totalSessions || 4;

  const [currentSection, setCurrentSection] = useState<'lookback' | 'lookup' | 'lookforward'>('lookback');
  const [userProgress, setUserProgress] = useState({
    lookBackComplete: false,
    lookUpComplete: false,
    lookForwardComplete: false,
    writtenMaterialRead: false,
    videoWatched: false,
    quizAnswer: null as number | null,
    personalReflection: '',
    faqReviewed: false,
    keyTruthReflection: '',
    actionStatement1: '',
    businessPlanAnswer1: '',
    surveyRating1: null as number | null,
    surveyRating2: null as number | null,
    surveyRating3: null as number | null,
    // Add post-assessment tracking for final session
    postAssessmentRequired: false,
    postAssessmentCompleted: false
  });

  // Check if this is the final session and set post-assessment requirement
  useEffect(() => {
    if (isFinalCourseSession()) {
      setUserProgress(prev => ({ ...prev, postAssessmentRequired: true }));
    }
  }, [moduleId, sessionId]);

  // Navigation functions
  const navigateToNextSession = () => {
    const nextSessionId = parseInt(sessionId) + 1;
    
    // Check if this is the end of Module 5 (Course completion)
    if (moduleId === "5" && sessionId === "3" && userProgress.lookForwardComplete) {
      localStorage.setItem('ibam-course-completed', 'true');
      console.log('🎉 Course completed! Redirecting to post-assessment...');
      router.push('/assessment/post');
      return;
    }
    
    // Normal navigation
    if (nextSessionId <= totalSessions) {
      router.push(`/modules/${moduleId}/sessions/${nextSessionId}`);
    } else {
      const nextModuleId = parseInt(moduleId) + 1;
      if (nextModuleId <= 5) {
        router.push(`/modules/${nextModuleId}/sessions/1`);
      }
    }
  };

  const isFinalCourseSession = () => {
    return moduleId === "5" && sessionId === "3";
  };

  const updateProgress = (updates: Partial<typeof userProgress>) => {
    setUserProgress(prev => {
      const newProgress = {...prev, ...updates};
      
      // Auto-check completion
      newProgress.lookBackComplete = true; // Simplified for now
      newProgress.lookUpComplete = !!(
        newProgress.writtenMaterialRead &&
        newProgress.videoWatched &&
        newProgress.quizAnswer !== null &&
        newProgress.personalReflection &&
        newProgress.faqReviewed
      );
      
      // For final session, require post-assessment acknowledgment
      if (isFinalCourseSession()) {
        newProgress.lookForwardComplete = !!(
          newProgress.keyTruthReflection &&
          newProgress.actionStatement1 &&
          newProgress.businessPlanAnswer1 &&
          newProgress.surveyRating1 !== null &&
          newProgress.surveyRating2 !== null &&
          newProgress.surveyRating3 !== null &&
          newProgress.postAssessmentRequired
        );
      } else {
        newProgress.lookForwardComplete = !!(
          newProgress.keyTruthReflection &&
          newProgress.actionStatement1 &&
          newProgress.businessPlanAnswer1 &&
          newProgress.surveyRating1 !== null &&
          newProgress.surveyRating2 !== null &&
          newProgress.surveyRating3 !== null
        );
      }
      
      return newProgress;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div style={{background: 'linear-gradient(135deg, #4ECDC4 0%, #2C3E50 100%)'}}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-white">
            <h1 className="text-2xl font-bold mb-2">{session.title}</h1>
            <p className="opacity-90">Module {moduleId}: {session.module}</p>
            {isFinalCourseSession() && (
              <div className="mt-3 bg-yellow-500 bg-opacity-20 border border-yellow-300 rounded-lg p-3">
                <p className="text-yellow-100 font-semibold">🎉 Final Session - Post-Assessment Required for Completion</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            {[
              { key: 'lookback', label: 'Look Back', icon: '👀' },
              { key: 'lookup', label: 'Look Up', icon: '📖' },
              { key: 'lookforward', label: 'Look Forward', icon: '🎯' }
            ].map((section) => (
              <button
                key={section.key}
                onClick={() => setCurrentSection(section.key as any)}
                className={`flex-1 py-6 text-center ${
                  currentSection === section.key ? 'border-b-4 border-blue-500 bg-blue-50' : ''
                }`}
              >
                <div className="text-4xl mb-2">{section.icon}</div>
                <div className="font-semibold">{section.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Look Back Section */}
        {currentSection === 'lookback' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Opening Prayer</h3>
              <p className="text-gray-700 italic mb-4">
                {isFinalCourseSession() 
                  ? "Lord, as I complete this incredible journey, help me reflect on all You've taught me and prepare my heart for the transformation assessment ahead. Amen."
                  : "Lord, as I look back on my recent journey, help me learn from my experiences and be open to Your guidance. Amen."
                }
              </p>
            </div>
            
            {/* Final Session Reflection */}
            {isFinalCourseSession() && (
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg shadow p-6">
                <h3 className="text-xl font-bold mb-4">🌟 Course Journey Reflection</h3>
                <p className="text-gray-700 mb-4">
                  You've completed an amazing 20-session journey through Faith-Driven Business principles. Take a moment to reflect on:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  <li>How your understanding of business as ministry has evolved</li>
                  <li>The specific biblical principles you'll implement in your business</li>
                  <li>The relationships and partnerships you want to develop</li>
                  <li>Your vision for kingdom impact through your marketplace influence</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Look Up Section */}
        {currentSection === 'lookup' && (
          <div className="space-y-8">
            {/* Scripture */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">📖 Biblical Foundation</h3>
              <div className="font-bold text-blue-600 mb-2">{session.scripture.reference}</div>
              <div className="text-gray-700 italic">"{session.scripture.text}"</div>
            </div>

            {/* Written Material */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">📝 Written Material</h3>
                <button
                  onClick={() => updateProgress({writtenMaterialRead: true})}
                  className={`px-4 py-2 rounded ${
                    userProgress.writtenMaterialRead ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }`}
                >
                  {userProgress.writtenMaterialRead ? '✓ Read' : 'Mark as Read'}
                </button>
              </div>
              <p className="text-gray-700">{session.writtenMaterial}</p>
            </div>

            {/* Video */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">📺 Training Video</h3>
                <button
                  onClick={() => updateProgress({videoWatched: true})}
                  className={`px-4 py-2 rounded ${
                    userProgress.videoWatched ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}
                >
                  {userProgress.videoWatched ? '✓ Watched' : 'Mark as Watched'}
                </button>
              </div>
              <div className="bg-gray-100 rounded aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">▶️</div>
                  <p>Video content will be embedded here</p>
                </div>
              </div>
            </div>

            {/* Quiz */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">🧠 Knowledge Check</h3>
              <p className="mb-4">
                {isFinalCourseSession() 
                  ? "What is the ultimate goal of a Faith-Driven business?"
                  : "What is the primary biblical foundation for business?"
                }
              </p>
              <div className="space-y-2">
                {isFinalCourseSession() ? [
                  "Maximum financial profit",
                  "Personal success and recognition",
                  "Multiplying disciples and advancing God's kingdom",
                  "Building the largest possible business"
                ] : [
                  "Business is a necessary evil",
                  "Business reflects God's image and calling",
                  "Business should be separate from faith",
                  "Business is only acceptable if explicitly Christian"
                ]}.map((option, index) => (
                  <label key={index} className="flex items-center gap-2 p-3 border rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name="quiz"
                      checked={userProgress.quizAnswer === index}
                      onChange={() => updateProgress({quizAnswer: index})}
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reflection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">💭 Personal Reflection</h3>
              <p className="mb-4">{session.reflection}</p>
              <textarea
                value={userProgress.personalReflection}
                onChange={(e) => updateProgress({personalReflection: e.target.value})}
                className="w-full h-32 p-3 border rounded"
                placeholder="Write your reflection here..."
              />
            </div>

            {/* FAQ */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">❓ FAQ</h3>
                <button
                  onClick={() => updateProgress({faqReviewed: true})}
                  className={`px-4 py-2 rounded ${
                    userProgress.faqReviewed ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'
                  }`}
                >
                  {userProgress.faqReviewed ? '✓ Reviewed' : 'Mark as Reviewed'}
                </button>
              </div>
              <div className="space-y-3">
                {session.faqQuestions.map((faq: string, index: number) => (
                  <div key={index} className="bg-gray-50 p-3 rounded">
                    <p>{faq}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Look Forward Section */}
        {currentSection === 'lookforward' && (
          <div className="space-y-8">
            {/* Key Truth */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">💡 Key Truth Reflection</h3>
              <textarea
                value={userProgress.keyTruthReflection}
                onChange={(e) => updateProgress({keyTruthReflection: e.target.value})}
                className="w-full h-32 p-3 border rounded"
                placeholder={isFinalCourseSession() 
                  ? "What are the most important insights from your entire Faith-Driven Business journey?"
                  : "What are the key insights from this session?"
                }
              />
            </div>

            {/* Action Statement */}
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">🎯 Action Statement</h3>
              <textarea
                value={userProgress.actionStatement1}
                onChange={(e) => updateProgress({actionStatement1: e.target.value})}
                className="w-full h-24 p-3 border rounded"
                placeholder={isFinalCourseSession() 
                  ? "What are your top 3 implementation steps for launching your Faith-Driven business?"
                  : "What specific action will you take before the next session?"
                }
              />
            </div>

            {/* Business Plan */}
            <div className="bg-orange-50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">💼 Business Plan Integration</h3>
              <p className="mb-3">{session.businessPlanQuestions[0]}</p>
              <textarea
                value={userProgress.businessPlanAnswer1}
                onChange={(e) => updateProgress({businessPlanAnswer1: e.target.value})}
                className="w-full h-24 p-3 border rounded"
                placeholder="Your response will be integrated into your business plan..."
              />
            </div>

            {/* POST-ASSESSMENT SECTION - Only for Final Session */}
            {isFinalCourseSession() && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 text-orange-700">⭐ Final Assessment Required</h3>
                <div className="bg-white rounded p-4 mb-4">
                  <p className="text-gray-700 mb-3">
                    <strong>Before completing this course, you must take the post-assessment to:</strong>
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 mb-4">
                    <li>Measure your transformation and growth</li>
                    <li>Compare your progress from the beginning</li>
                    <li>Demonstrate the course's impact on your thinking</li>
                    <li>Earn your Faith-Driven Business certificate</li>
                  </ul>
                  <p className="text-orange-600 font-semibold">
                    The post-assessment will be automatically launched when you complete this session.
                  </p>
                </div>
                <label className="flex items-center gap-3 p-3 bg-white rounded border">
                  <input
                    type="checkbox"
                    checked={userProgress.postAssessmentRequired}
                    onChange={(e) => updateProgress({postAssessmentRequired: e.target.checked})}
                    className="w-5 h-5"
                  />
                  <span className="font-semibold">
                    I understand that I need to complete the post-assessment to finish the course and earn my certificate.
                  </span>
                </label>
              </div>
            )}

            {/* Survey */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">📊 Session Feedback</h3>
              {[
                isFinalCourseSession() ? "How valuable was this entire course?" : "How valuable was this session?",
                "How clear was the material?",
                "How likely are you to apply what you learned?"
              ].map((question, index) => (
                <div key={index} className="mb-6">
                  <p className="mb-3">{question}</p>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => updateProgress({[`surveyRating${index + 1}`]: rating})}
                        className={`w-12 h-12 rounded-full font-bold ${
                          userProgress[`surveyRating${index + 1}` as keyof typeof userProgress] === rating
                            ? 'bg-blue-500 text-white' : 'bg-gray-200'
                        }`}
                      >
                        {rating}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Complete Button */}
            {userProgress.lookForwardComplete && (
              <div className={`${
                isFinalCourseSession() ? 'bg-gradient-to-r from-green-500 to-blue-500' : 'bg-green-500'
              } text-white rounded-lg p-6 text-center`}>
                <h3 className="text-xl font-bold mb-2">
                  {isFinalCourseSession() ? '🎉 Ready for Post-Assessment!' : '🏆 Session Complete!'}
                </h3>
                <p className="mb-4">
                  {isFinalCourseSession() 
                    ? 'Congratulations! You\'ve completed all 20 sessions. Time to measure your transformation and earn your certificate!' 
                    : 'Great work! Ready for the next session?'
                  }
                </p>
                <button 
                  onClick={navigateToNextSession}
                  className={`${
                    isFinalCourseSession() ? 'bg-white text-blue-600' : 'bg-white text-green-500'
                  } px-6 py-3 rounded-lg font-bold text-lg`}
                >
                  {isFinalCourseSession() ? '📊 Take Post-Assessment & Get Certificate' : 'Next Session →'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}