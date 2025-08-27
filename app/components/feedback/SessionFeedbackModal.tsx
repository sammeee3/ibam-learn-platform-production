'use client';

import { useState, useEffect } from 'react';
import { Star, X, Sparkles, Trophy, Send } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import confetti from 'canvas-confetti';

interface SessionFeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  moduleId: string;
  userId: string;
}

const SessionFeedbackModal: React.FC<SessionFeedbackModalProps> = ({
  isOpen,
  onClose,
  sessionId,
  moduleId,
  userId
}) => {
  const [responses, setResponses] = useState({
    content_effectiveness: 0,
    learning_format: 0,
    recommendation_likelihood: 0
  });
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [startTime] = useState(Date.now());
  const supabase = createClientComponentClient();

  // Questions with friendly phrasing
  const questions = [
    {
      key: 'content_effectiveness',
      emoji: '💎',
      question: 'How valuable was this session for your business journey?',
      lowLabel: 'Not helpful',
      highLabel: 'Game-changing!'
    },
    {
      key: 'learning_format',
      emoji: '🎯',
      question: 'How engaging was the way we presented this content?',
      lowLabel: 'Boring',
      highLabel: 'Loved it!'
    },
    {
      key: 'recommendation_likelihood',
      emoji: '🚀',
      question: 'Would you recommend this session to other entrepreneurs?',
      lowLabel: 'Unlikely',
      highLabel: 'Absolutely!'
    }
  ];

  const ratingEmojis = ['😕', '😐', '🙂', '😊', '🤩'];

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = async () => {
    // Validate at least one rating
    if (Object.values(responses).every(v => v === 0)) {
      // Gentle nudge animation
      const modal = document.getElementById('feedback-modal-content');
      modal?.classList.add('animate-pulse');
      setTimeout(() => modal?.classList.remove('animate-pulse'), 1000);
      return;
    }

    setIsSubmitting(true);
    const timeToComplete = Math.floor((Date.now() - startTime) / 1000);

    try {
      const { error } = await supabase
        .from('session_feedback')
        .insert({
          user_id: userId,
          session_id: sessionId,
          module_id: moduleId,
          content_effectiveness: responses.content_effectiveness || null,
          learning_format: responses.learning_format || null,
          recommendation_likelihood: responses.recommendation_likelihood || null,
          comments: comments || null,
          time_to_complete_seconds: timeToComplete,
          session_completion_percent: 100
        });

      if (error) throw error;

      // Trigger celebration
      setShowThankYou(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899']
      });

      // Close after celebration
      setTimeout(() => {
        onClose();
        setShowThankYou(false);
      }, 3000);

    } catch (error) {
      console.error('Error saving feedback:', error);
      // Still close on error but without celebration
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    // Soft skip - still track they saw it
    supabase
      .from('session_feedback')
      .insert({
        user_id: userId,
        session_id: sessionId,
        module_id: moduleId,
        comments: 'SKIPPED',
        time_to_complete_seconds: 0,
        session_completion_percent: 100
      })
      .then(() => onClose());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleSkip}
      />
      
      {/* Modal Content */}
      <div 
        id="feedback-modal-content"
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl transform transition-all animate-slideUp"
      >
        {showThankYou ? (
          // Thank You State
          <div className="p-12 text-center">
            <Trophy className="w-20 h-20 mx-auto text-yellow-500 mb-4 animate-bounce" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Thank You, Champion! 🎉
            </h2>
            <p className="text-gray-600 text-lg">
              Your feedback helps us empower more entrepreneurs worldwide!
            </p>
          </div>
        ) : (
          <>
            {/* Header with gradient */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Sparkles className="w-8 h-8 text-yellow-300 mr-3 animate-pulse" />
                  <div>
                    <h3 className="text-2xl font-bold text-white">Quick Feedback</h3>
                    <p className="text-blue-100">Help us make this training even better! 🚀</p>
                  </div>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-white/70 hover:text-white transition-colors"
                  title="Skip feedback"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Questions */}
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              {questions.map((q, qIndex) => (
                <div 
                  key={q.key}
                  className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-4 transform transition-all hover:scale-[1.02]"
                >
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="text-2xl mr-2">{q.emoji}</span>
                    {q.question}
                  </h4>
                  <div className="flex gap-2 justify-center mb-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setResponses(prev => ({ 
                          ...prev, 
                          [q.key]: rating 
                        }))}
                        className={`w-14 h-14 rounded-xl text-2xl transition-all transform ${
                          responses[q.key as keyof typeof responses] === rating
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg scale-110 border-2 border-white'
                            : 'bg-white hover:bg-gray-100 border-2 border-gray-200 hover:scale-105'
                        }`}
                      >
                        {ratingEmojis[rating - 1]}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{q.lowLabel}</span>
                    <span>{q.highLabel}</span>
                  </div>
                </div>
              ))}

              {/* Optional Comments */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="text-2xl mr-2">💬</span>
                  Any specific thoughts to share? (Optional)
                </h4>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Your insights help us improve..."
                  className="w-full p-3 border-2 border-green-200 rounded-lg resize-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                  rows={3}
                />
              </div>
            </div>

            {/* Footer with actions */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex justify-between items-center">
              <p className="text-sm text-gray-500">
                ⏱ Takes just 30 seconds • 🔒 Responses are anonymous
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleSkip}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Skip for now
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || Object.values(responses).every(v => v === 0)}
                  className={`px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-all transform hover:scale-105 ${
                    Object.values(responses).some(v => v > 0)
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Sending...' : 'Submit Feedback'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SessionFeedbackModal;

// Add these animations to your global CSS or Tailwind config:
// @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
// @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
// .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
// .animate-slideUp { animation: slideUp 0.3s ease-out; }