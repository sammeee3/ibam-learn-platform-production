// app/components/coaching/AIChatInterface.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, Send } from 'lucide-react';
import { aiCoachingResponses } from '../../lib/constants';
import type { AIMessage } from '../../lib/types';
import { IBAM_COACHING_KNOWLEDGE } from '../../lib/coaching-knowledge-base';
import { ASSESSMENT_COACHING_INTEGRATION } from '../../lib/assessment-coaching-integration';
import { AI_COACH_INTRODUCTION, getPersonalizedIntroduction } from '../../lib/ai-coach-introduction';
import { 
  generateContentAwareCoaching, 
  enhanceSessionCoaching, 
  getQuickContentCoaching,
  type SessionContentContext 
} from '../../lib/session-content-coaching';
import { IBAM_COMPREHENSIVE_KNOWLEDGE, QUICK_REFERENCE } from '../../lib/ibam-comprehensive-knowledge';

interface AIChatInterfaceProps {
  moduleId?: number;
  sessionId?: number;
  sessionTitle?: string;
  currentSection?: string;
  isMobile?: boolean;
  sessionData?: any; // Full session content for content-aware coaching
  userProgress?: {
    completedSections: Record<string, boolean>;
    quizScores?: Record<string, number>;
  };
}

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ 
  moduleId, 
  sessionId, 
  sessionTitle = "Current Session",
  currentSection = "session",
  isMobile = false,
  sessionData,
  userProgress 
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);

  // Initialize with personalized IBAM coaching introduction
  useEffect(() => {
    const initializeCoaching = async () => {
      // Create session context for content-aware coaching
      const sessionContext: SessionContentContext = {
        moduleId: moduleId || 1,
        sessionId: sessionId || 1,
        sessionTitle,
        currentContent: {
          reading: sessionData?.content?.written_curriculum?.main_content,
          scripture: sessionData?.content?.scripture,
          keyPrinciples: sessionData?.content?.key_principles,
          objectives: sessionData?.content?.objectives
        },
        userProgress: {
          completedSections: userProgress?.completedSections || {},
          quizScores: userProgress?.quizScores
        }
      };

      // SHORT, direct introduction
      let personalizedIntro = `Hi! I'm your IBAM Online Coach - ask me anything about business, biblical principles, or today's session.`;

      // Add session context - MUCH shorter
      const sessionContextText = sessionTitle 
        ? `\n\n**Today's Focus:** "${sessionTitle}"\n\nWhat questions do you have?`
        : "\n\nWhat questions do you have?";
      
      const fullGreeting = personalizedIntro + sessionContextText;
      
      setMessages([{ type: 'ai', content: fullGreeting }]);
    };
    
    initializeCoaching();
  }, [sessionTitle, sessionId, sessionData, userProgress]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // IBAM Discovery-Based Quick Prompts
  const getQuickPrompts = (sessionTitle: string) => {
    // Use our discovery questions for quick prompts
    return [
      "Who are you?", // Identity question
      "What's your biggest business challenge?", // Discovery approach
      "How do I apply today's lesson?", // Application focus
      "Do you have any questions for me?" // Open discovery prompt
    ];
  };

  const quickPrompts = getQuickPrompts(sessionTitle);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, { type: 'user', content: message }]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Call new AI coaching service with actual session context
      const response = await fetch('/api/coaching', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: message,
          sessionId: sessionId,
          moduleId: moduleId,
          previousMessages: messages.slice(-4).map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
          }))
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // Use AI response
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: data.response,
          source: data.source,
          sessionContext: data.sessionContext,
          scriptureReferences: data.scriptureReferences,
          followUpQuestions: data.followUpQuestions
        }]);
      } else {
        // Use fallback response if API fails
        setMessages(prev => [...prev, { 
          type: 'bot', 
          content: data.fallbackResponse || 'I apologize, but I encountered an error. Please try rephrasing your question.'
        }]);
      }
    } catch (error) {
      console.error('Coaching API error:', error);
      
      // Fallback to simple helpful response
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: `I apologize, but I encountered an error processing your question. However, I'm still here to help with your IBAM learning!

Your question: "${message}"

As your online coach, I can help you with:
- Biblical business principles and their practical application
- Course content questions and clarification  
- Business planning and development guidance
- Ethical business decision-making

Please try rephrasing your question, and I'll do my best to provide helpful guidance based on IBAM's biblical business approach.`
      }]);
    }
    
    setIsTyping(false);
    setConversationTurn(prev => prev + 1);
  };

  // Track conversation history
  const [conversationTurn, setConversationTurn] = useState(0);

  const chatHeight = isMobile ? "h-80" : "h-96";

  return (
    <div className="bg-white">
      <div className={`${chatHeight} overflow-y-auto p-4 space-y-3`}>
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.type === 'user' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              {message.scriptureReferences && message.scriptureReferences.length > 0 && (
                <div className="text-xs mt-2 pt-2 border-t border-gray-200">
                  <strong>Scripture:</strong> {message.scriptureReferences.join(', ')}
                </div>
              )}
              {message.followUpQuestions && message.followUpQuestions.length > 0 && (
                <div className="text-xs mt-2 pt-2 border-t border-gray-200">
                  <div className="font-semibold mb-1">Follow-up questions:</div>
                  {message.followUpQuestions.map((question, i) => (
                    <div key={i} className="text-xs opacity-75">• {question}</div>
                  ))}
                </div>
              )}
              {message.source && (
                <div className="text-xs mt-1 opacity-60">
                  Source: {message.source === 'ai' ? 'AI Coach' : 'Knowledge Base'}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 px-4 py-2 rounded-lg">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      <div className="px-4 py-2 border-t bg-gray-50">
        <div className="text-xs font-medium text-gray-600 mb-2">Quick Questions:</div>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => sendMessage(prompt)}
              className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
            placeholder="Ask about applying today's lesson to your business..."
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => sendMessage(inputMessage)}
            disabled={!inputMessage.trim() || isTyping}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatInterface;