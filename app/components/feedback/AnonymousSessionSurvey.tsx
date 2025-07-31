// app/components/feedback/AnonymousSessionSurvey.tsx
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';

const AnonymousSessionSurvey: React.FC = () => {
  const [surveyResponses, setSurveyResponses] = useState({
    content_effectiveness: 0,
    learning_format: 0,
    recommendation: 0
  });
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const submitSurvey = () => {
    // In production, this would send to analytics/feedback system
    console.log('Anonymous Survey Submitted:', { surveyResponses, comments });
    setSubmitted(true);
    setTimeout(() => {
      alert('Thank you for your anonymous feedback! This helps us improve the training for future participants. 🙏');
    }, 500);
  };

  const resetSurvey = () => {
    setSurveyResponses({ content_effectiveness: 0, learning_format: 0, recommendation: 0 });
    setComments('');
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <div className="text-center">
          <div className="text-4xl mb-3">🙏</div>
          <h4 className="text-xl font-bold text-green-800 mb-2">Thank You!</h4>
          <p className="text-green-700 mb-4">Your anonymous feedback has been submitted and will help us improve this training.</p>
          <button 
            onClick={resetSurvey}
            className="text-green-600 hover:text-green-800 underline text-sm"
          >
            Submit Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
      <h4 className="text-xl font-bold mb-3 flex items-center">
        <Star className="w-6 h-6 mr-2" />
        📊 Anonymous Session Feedback
      </h4>
      <p className="text-pink-100 mb-6">Help us improve! Your responses are completely anonymous and help us enhance the training experience.</p>
      
      <div className="space-y-6">
        {/* Question 1: Content Effectiveness */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <h5 className="font-semibold text-white mb-3">💎 How effective was today's content for your business growth?</h5>
          <div className="flex gap-3 justify-center">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setSurveyResponses(prev => ({ ...prev, content_effectiveness: rating }))}
                className={`w-12 h-12 rounded-full text-2xl transition-all ${
                  surveyResponses.content_effectiveness === rating
                    ? 'bg-yellow-400 text-gray-800 transform scale-110 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {rating === 1 ? '😕' : rating === 2 ? '😐' : rating === 3 ? '🙂' : rating === 4 ? '😊' : '🤩'}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-pink-200 mt-2">
            <span>Not helpful</span>
            <span>Extremely valuable</span>
          </div>
        </div>

        {/* Question 2: Learning Format */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <h5 className="font-semibold text-white mb-3">🎯 How engaging was the learning format (videos, activities, interactions)?</h5>
          <div className="flex gap-3 justify-center">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setSurveyResponses(prev => ({ ...prev, learning_format: rating }))}
                className={`w-12 h-12 rounded-full text-2xl transition-all ${
                  surveyResponses.learning_format === rating
                    ? 'bg-green-400 text-gray-800 transform scale-110 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {rating === 1 ? '💤' : rating === 2 ? '😴' : rating === 3 ? '👍' : rating === 4 ? '🚀' : '⚡'}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-pink-200 mt-2">
            <span>Boring</span>
            <span>Highly engaging</span>
          </div>
        </div>

        {/* Question 3: Recommendation */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <h5 className="font-semibold text-white mb-3">🤝 How likely are you to recommend this session to other Christian entrepreneurs?</h5>
          <div className="flex gap-3 justify-center">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setSurveyResponses(prev => ({ ...prev, recommendation: rating }))}
                className={`w-12 h-12 rounded-full text-2xl transition-all ${
                  surveyResponses.recommendation === rating
                    ? 'bg-blue-400 text-gray-800 transform scale-110 shadow-lg'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {rating === 1 ? '👎' : rating === 2 ? '🤷' : rating === 3 ? '👌' : rating === 4 ? '👏' : '🙌'}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-pink-200 mt-2">
            <span>Would not recommend</span>
            <span>Absolutely recommend!</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <h5 className="font-semibold text-white mb-3">💬 Additional Comments or Suggestions (Optional)</h5>
          <textarea
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder="Share any specific feedback, suggestions for improvement, or what you found most valuable..."
            className="w-full p-3 bg-white/20 backdrop-blur rounded-lg text-white placeholder-white/70 border border-white/30 resize-none"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        {Object.values(surveyResponses).every(rating => rating > 0) && (
          <div className="text-center">
            <button
              onClick={submitSurvey}
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-bold hover:bg-purple-50 transition-colors shadow-lg"
            >
              🙏 Submit Anonymous Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnonymousSessionSurvey;