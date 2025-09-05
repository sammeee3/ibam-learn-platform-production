import React, { useState, useEffect } from 'react';
import { MessageSquare, Lightbulb, AlertCircle, BookOpen, CheckCircle, Send } from 'lucide-react';
import { generateSectionCoaching, getContextualBusinessCoaching } from '../../lib/business-planner-coaching';

const AICoaching = ({ section, formData, onCoachingResponse }) => {
  const [coachingResponses, setCoachingResponses] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [userMessage, setUserMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // Calculate completion percentage
  const calculateCompletion = () => {
    if (!formData || typeof formData !== 'object') return 0;
    const totalFields = Object.keys(formData).length;
    if (totalFields === 0) return 0;
    const completedFields = Object.values(formData).filter(value => 
      value && value.toString().trim() !== ''
    ).length;
    return Math.round((completedFields / totalFields) * 100);
  };

  // Generate coaching responses when section or formData changes
  useEffect(() => {
    if (section && formData) {
      const completion = calculateCompletion();
      const responses = generateSectionCoaching(section, formData, completion);
      setCoachingResponses(responses);
      
      // Initialize chat with welcome message
      if (chatHistory.length === 0) {
        setChatHistory([{
          type: 'ai',
          message: `Hi! I'm here to help you with your ${section} section. I can answer questions, provide guidance, and help you think through biblical business principles. What would you like to explore?`,
          timestamp: new Date()
        }]);
      }
    }
  }, [section, formData]);

  const getCoachingIcon = (type) => {
    switch (type) {
      case 'validation': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'biblical': return <BookOpen className="w-5 h-5 text-purple-600" />;
      case 'encouragement': return <Lightbulb className="w-5 h-5 text-blue-600" />;
      default: return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCoachingColor = (type) => {
    switch (type) {
      case 'validation': return 'bg-green-50 border-green-200 text-green-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'biblical': return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'encouragement': return 'bg-blue-50 border-blue-200 text-blue-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    // Add user message to chat
    const newUserMessage = {
      type: 'user',
      message: userMessage,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, newUserMessage]);
    setUserMessage('');
    setIsTyping(true);

    // Generate AI response
    setTimeout(() => {
      const aiResponse = getContextualBusinessCoaching(section, userMessage, formData);
      const newAiMessage = {
        type: 'ai',
        message: aiResponse,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, newAiMessage]);
      setIsTyping(false);
      
      // Callback to parent if provided
      if (onCoachingResponse) {
        onCoachingResponse(section, userMessage, aiResponse);
      }
    }, 1000);
  };

  const completion = calculateCompletion();

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Coaching Summary Cards */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-gray-800 flex items-center gap-2">
            🤖 AI Business Coach
            <span className="text-sm font-normal text-gray-600">({completion}% complete)</span>
          </h4>
          <button
            onClick={() => setShowChat(!showChat)}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            {showChat ? 'Hide Chat' : 'Ask Questions'}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>

        {/* Coaching Responses */}
        {coachingResponses.length > 0 && (
          <div className="space-y-3">
            {coachingResponses.map((response, index) => (
              <div key={index} className={`p-3 rounded-lg border ${getCoachingColor(response.type)}`}>
                <div className="flex items-start gap-2">
                  {getCoachingIcon(response.type)}
                  <div className="flex-1">
                    <div className="text-sm whitespace-pre-line">{response.message}</div>
                    
                    {response.actionItems && response.actionItems.length > 0 && (
                      <div className="mt-2">
                        <div className="font-medium text-xs mb-1">Action Items:</div>
                        <ul className="text-xs space-y-1">
                          {response.actionItems.map((item, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-gray-500">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {response.nextSteps && response.nextSteps.length > 0 && (
                      <div className="mt-2">
                        <div className="font-medium text-xs mb-1">Next Steps:</div>
                        <ul className="text-xs space-y-1">
                          {response.nextSteps.map((step, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-gray-500">→</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Interactive Chat */}
      {showChat && (
        <div className="p-4">
          <div className="h-64 overflow-y-auto border rounded-lg p-3 mb-3 bg-gray-50">
            {chatHistory.map((message, index) => (
              <div key={index} className={`mb-3 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-800 border'
                }`}>
                  <div className="whitespace-pre-line">{message.message}</div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="text-left mb-3">
                <div className="inline-block bg-white border px-3 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about pricing, customers, biblical principles..."
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!userMessage.trim() || isTyping}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Questions */}
          <div className="mt-3">
            <div className="text-xs font-medium text-gray-600 mb-2">Quick Questions:</div>
            <div className="flex flex-wrap gap-2">
              {[
                "How do I price this?",
                "Is this biblical?", 
                "What am I missing?",
                "Is this realistic?"
              ].map((question, index) => (
                <button
                  key={index}
                  onClick={() => setUserMessage(question)}
                  className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AICoaching;