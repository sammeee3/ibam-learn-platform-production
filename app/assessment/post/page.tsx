'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';

interface Question {
  id: number;
  category: string;
  question: string;
  description: string;
  scale_min: number;
  scale_max: number;
  scale_labels: {
    [key: string]: string;
  };
}

interface Assessment {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

interface AssessmentResponse {
  id: string;
  responses: { [key: number]: number };
  category_scores: { [category: string]: number };
  total_score: number;
  completed_at: string;
}

interface ComparisonData {
  category: string;
  pre_score: number;
  post_score: number;
  improvement: number;
  improvement_percentage: number;
}

export default function DatabasePostAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<{ [key: number]: number }>({});
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [preAssessment, setPreAssessment] = useState<AssessmentResponse | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const initializeAssessment = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          console.error('User not authenticated:', userError);
          router.push('/login');
          return;
        }
        setUser(user);

        // Check if user has completed pre-assessment
        const { data: preAssessmentData, error: preError } = await supabase
          .from('assessment_responses')
          .select('*')
          .eq('user_id', user.id)
          .eq('assessment_id', 'b77f4b69-8ad4-41aa-8656-6fd1c9e809c7') // Pre-course assessment ID
          .single();

        if (preError || !preAssessmentData) {
          console.error('Pre-assessment not found:', preError);
          alert('You must complete the pre-assessment first before taking the post-assessment.');
          router.push('/assessment/pre');
          return;
        }
        setPreAssessment(preAssessmentData);

        // Check if user has already completed post-assessment
        const { data: existingPostResponse, error: postResponseError } = await supabase
          .from('assessment_responses')
          .select('id')
          .eq('user_id', user.id)
          .eq('assessment_id', '4a70a585-ae69-4b93-92d0-a03ba789d853') // Post-course assessment ID
          .single();

        if (existingPostResponse && !postResponseError) {
          // User already completed post-assessment, show comparison
          setShowComparison(true);
          return;
        }

        // Fetch post-course assessment from database
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', '4a70a585-ae69-4b93-92d0-a03ba789d853') // Post-course assessment ID
          .eq('is_active', true)
          .single();

        if (assessmentError || !assessmentData) {
          console.error('Error fetching post-assessment:', assessmentError);
          return;
        }

        setAssessment(assessmentData);
      } catch (error) {
        console.error('Error initializing assessment:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAssessment();
  }, [router, supabase]);

  const handleResponse = (value: number) => {
    if (!assessment) return;

    const newResponses = {
      ...responses,
      [assessment.questions[currentQuestion].id]: value
    };
    setResponses(newResponses);

    // Auto-advance to next question after 500ms
    setTimeout(() => {
      if (currentQuestion < assessment.questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 500);
  };

  const calculateComparison = (postResponses: { [key: number]: number }) => {
    if (!assessment || !preAssessment) return [];

    const comparison: ComparisonData[] = [];
    
    assessment.questions.forEach(question => {
      const preScore = preAssessment.responses[question.id] || 0;
      const postScore = postResponses[question.id] || 0;
      const improvement = postScore - preScore;
      const improvementPercentage = preScore > 0 ? ((improvement / preScore) * 100) : 0;

      comparison.push({
        category: question.category,
        pre_score: preScore,
        post_score: postScore,
        improvement: improvement,
        improvement_percentage: improvementPercentage
      });
    });

    return comparison.sort((a, b) => b.improvement - a.improvement);
  };

  const handleSubmit = async () => {
    if (!assessment || !user || !preAssessment || submitting) return;

    setSubmitting(true);

    try {
      // Calculate total score and category scores
      const totalScore = Object.values(responses).reduce((sum, score) => sum + score, 0);
      
      const categoryScores: { [category: string]: number } = {};
      assessment.questions.forEach(question => {
        const response = responses[question.id];
        if (response) {
          categoryScores[question.category] = response;
        }
      });

      // Save post-assessment response to database
      const { data: postAssessmentResponse, error: postError } = await supabase
        .from('assessment_responses')
        .insert({
          user_id: user.id,
          assessment_id: assessment.id,
          responses: responses,
          total_score: totalScore,
          category_scores: categoryScores,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (postError) {
        console.error('Error saving post-assessment response:', postError);
        alert('Error saving assessment. Please try again.');
        return;
      }

      // Calculate comparison data
      const comparison = calculateComparison(responses);
      setComparisonData(comparison);

      // Calculate improvement metrics for storage
      const totalImprovement = totalScore - preAssessment.total_score;
      const overallImprovementPercentage = preAssessment.total_score > 0 
        ? ((totalImprovement / preAssessment.total_score) * 100) 
        : 0;

      const topImprovements = comparison
        .filter(item => item.improvement > 0)
        .slice(0, 3)
        .map(item => item.category);

      const improvementData = {
        total_improvement: totalImprovement,
        improvement_percentage: overallImprovementPercentage,
        top_improvement_categories: topImprovements,
        comparison_breakdown: comparison,
        pre_total_score: preAssessment.total_score,
        post_total_score: totalScore
      };

      // Create assessment comparison record
      const { error: comparisonError } = await supabase
        .from('assessment_comparisons')
        .insert({
          user_id: user.id,
          pre_assessment_response_id: preAssessment.id,
          post_assessment_response_id: postAssessmentResponse.id,
          improvement_data: improvementData
        });

      if (comparisonError) {
        console.error('Error saving comparison data:', comparisonError);
        // Continue anyway - the main assessment was saved
      }

      // Show comparison results
      setShowComparison(true);

    } catch (error) {
      console.error('Error submitting assessment:', error);
      alert('Error submitting assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (showComparison) {
    const totalImprovement = comparisonData.reduce((sum, item) => sum + item.improvement, 0);
    const avgImprovementPercentage = comparisonData.length > 0 
      ? comparisonData.reduce((sum, item) => sum + item.improvement_percentage, 0) / comparisonData.length 
      : 0;
    const topImprovements = comparisonData.filter(item => item.improvement > 0).slice(0, 3);

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Course Complete! 🎉</h1>
            <p className="text-xl text-gray-600 mb-6">
              Congratulations on completing the IBAM Learning Platform. Here's your growth summary:
            </p>
            
            {/* Overall Improvement */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 text-white">
                <div className="text-2xl font-bold">+{totalImprovement}</div>
                <div className="text-green-100">Total Points Gained</div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl p-4 text-white">
                <div className="text-2xl font-bold">{avgImprovementPercentage.toFixed(1)}%</div>
                <div className="text-blue-100">Average Improvement</div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 text-white">
                <div className="text-2xl font-bold">{topImprovements.length}</div>
                <div className="text-purple-100">Areas Improved</div>
              </div>
            </div>
          </div>

          {/* Top Improvements */}
          {topImprovements.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">🏆 Your Biggest Improvements</h2>
              <div className="space-y-4">
                {topImprovements.map((item, index) => (
                  <div key={item.category} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{item.category}</div>
                      <div className="text-sm text-gray-600">
                        Improved by {item.improvement} points ({item.improvement_percentage.toFixed(1)}% growth)
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{item.pre_score} → {item.post_score}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Comparison */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📊 Complete Before & After Analysis</h2>
            <div className="space-y-4">
              {comparisonData.map((item) => (
                <div key={item.category} className="border-b border-gray-100 pb-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-gray-800">{item.category}</h3>
                    <div className={`text-sm px-2 py-1 rounded ${
                      item.improvement > 0 ? 'bg-green-100 text-green-800' :
                      item.improvement < 0 ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {item.improvement > 0 ? '+' : ''}{item.improvement} 
                      {item.improvement !== 0 && ` (${item.improvement_percentage.toFixed(1)}%)`}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Before: {item.pre_score}/10</span>
                        <span>After: {item.post_score}/10</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="relative h-2 rounded-full overflow-hidden">
                          <div 
                            className="absolute left-0 top-0 h-full bg-gray-400 rounded-full"
                            style={{ width: `${(item.pre_score / 10) * 100}%` }}
                          ></div>
                          <div 
                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full"
                            style={{ width: `${(item.post_score / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">What's Next?</h2>
            <p className="text-gray-600 mb-6">
              Continue applying these faith-driven business principles in your marketplace ministry. 
              Remember, you're called to multiply disciples through excellent business practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-200"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => router.push('/business-planner')}
                className="bg-gradient-to-r from-teal-500 to-blue-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-teal-600 hover:to-blue-700 transition-all duration-200"
              >
                Create Business Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full mx-4">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Assessment Not Available</h2>
          <p className="text-gray-600 mb-4">Sorry, the post-course assessment could not be loaded.</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQ = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;
  const isComplete = Object.keys(responses).length === assessment.questions.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            {assessment.name}
          </h1>
          <p className="text-gray-600 text-lg">
            {assessment.description}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {assessment.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-indigo-600 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {!isComplete ? (
          /* Current Question */
          <div>
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-2">
                {currentQ.category}
              </h2>
              <p className="text-lg md:text-xl text-gray-700 mb-3">
                {currentQ.question}
              </p>
              <p className="text-gray-600">
                {currentQ.description}
              </p>
            </div>

            {/* Rating Scale */}
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{currentQ.scale_labels["1"]}</span>
                <span>{currentQ.scale_labels["10"]}</span>
              </div>
              
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {[...Array(10)].map((_, index) => {
                  const value = index + 1;
                  const isSelected = responses[currentQ.id] === value;
                  
                  return (
                    <button
                      key={value}
                      onClick={() => handleResponse(value)}
                      className={`
                        aspect-square rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105
                        ${isSelected 
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg transform scale-105' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }
                      `}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>

              {responses[currentQ.id] && (
                <div className="text-center">
                  <p className="text-purple-600 font-medium">
                    ✓ {currentQ.scale_labels[responses[currentQ.id].toString()] || `Selected: ${responses[currentQ.id]}`}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Assessment Complete */
          <div className="text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Assessment Complete!</h2>
              <p className="text-gray-600 text-lg">
                Thank you for completing the post-course assessment. Let's see how much you've grown!
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-8 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Calculating Growth...' : 'See Your Growth Results →'}
            </button>
          </div>
        )}

        {/* Navigation */}
        {!isComplete && currentQuestion > 0 && (
          <div className="mt-8 flex justify-between">
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Previous
            </button>
            
            {responses[currentQ.id] && currentQuestion < assessment.questions.length - 1 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion + 1)}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg hover:from-purple-600 hover:to-indigo-700 transition-all duration-200"
              >
                Next →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}