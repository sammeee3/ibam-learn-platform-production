// app/components/coaching/AIChatInterface.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, Send } from 'lucide-react';
import { aiCoachingResponses } from '../../lib/constants';
import type { AIMessage } from '../../lib/types';

interface AIChatInterfaceProps {
  moduleId?: number;
  sessionId?: number;
  sessionTitle?: string;
  currentSection?: string;
  isMobile?: boolean;
}

const AIChatInterface: React.FC<AIChatInterfaceProps> = ({ 
  moduleId, 
  sessionId, 
  sessionTitle = "Current Session",
  currentSection = "session",
  isMobile = false 
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([]);

  // Initialize with context-aware greeting
  useEffect(() => {
    const contextGreeting = sessionTitle 
      ? `Hi! I'm your faith-driven business coach for "${sessionTitle}". I'm here to help you discover how to apply today's biblical business principles to your specific situation. What's on your mind?`
      : "Hi! I'm your faith-driven business coach. I'm here to help you apply today's session to your specific business situation. What questions do you have?";
    
    setMessages([{ type: 'ai', content: contextGreeting }]);
  }, [sessionTitle]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const quickPrompts = [
    "How do I apply this to my business?",
    "What if I'm just starting out?",
    "How do I balance profit and ministry?",
    "How can I share my faith without being pushy?"
  ];

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    setMessages(prev => [...prev, { type: 'user', content: message }]);
    setInputMessage('');
    setIsTyping(true);

    // Enhanced context-aware discovery coaching response
    setTimeout(() => {
      const response = generateDiscoveryResponse(message, sessionTitle, moduleId, sessionId);

      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: response.response,
        followUp: response.followUp 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  // Discovery-based coaching response generator
  const generateDiscoveryResponse = (userMessage: string, sessionTitle: string, moduleId?: number, sessionId?: number) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Context-aware session references
    const sessionContext = sessionTitle !== "Current Session" ? `today's lesson on "${sessionTitle}"` : "today's session";
    
    // Discovery coaching patterns for common topics
    if (lowerMessage.includes('pricing') || lowerMessage.includes('price')) {
      return {
        response: `Great question about pricing! Let's explore this together. What does "fair pricing" mean to you personally? How does ${sessionContext} connect to your pricing concerns? What would pricing with complete integrity look like in your business?`,
        followUp: "What's one small pricing experiment you could try this week based on these insights?"
      };
    }
    
    if (lowerMessage.includes('funding') || lowerMessage.includes('investment') || lowerMessage.includes('capital')) {
      return {
        response: `I can see you're thinking about funding - that shows great entrepreneurial vision! But let's first focus on ${sessionContext}. What does biblical stewardship look like with your current resources? How might mastering what you have now prepare you for greater opportunities later?`,
        followUp: "What's one way you could be more faithful with what God has already given you?"
      };
    }
    
    if (lowerMessage.includes('customer') || lowerMessage.includes('client') || lowerMessage.includes('market')) {
      return {
        response: `Finding customers is exciting! Let's dig deeper here. Who are you specifically called to serve? How does ${sessionContext} shape your understanding of your ideal customer? What problems are you uniquely positioned to solve?`,
        followUp: "What would it look like to serve your customers as an act of worship?"
      };
    }
    
    if (lowerMessage.includes('profit') || lowerMessage.includes('money') || lowerMessage.includes('income')) {
      return {
        response: `Profit and ministry - such an important balance! What does ${sessionContext} teach you about God's view of wealth? How do you see profit serving your deeper mission? What fears or excitement do you have about making money through your business?`,
        followUp: "How could your profit become a tool for Kingdom impact?"
      };
    }
    
    if (lowerMessage.includes('fear') || lowerMessage.includes('scared') || lowerMessage.includes('worried')) {
      return {
        response: `I hear the vulnerability in your question - that takes courage to share. What specifically are you afraid of? How does ${sessionContext} speak to your fears? What would you do if you knew you couldn't fail?`,
        followUp: "What's one small, brave step you could take this week?"
      };
    }
    
    // Default discovery response
    return {
      response: `That's a thoughtful question! Let's explore this together. How does this connect to your deeper purpose in business? What insights from ${sessionContext} come to mind as you think about this? What would success look like if you approached this with complete faith?`,
      followUp: "What's one specific step you could take this week to move forward?"
    };
  };

  const chatHeight = isMobile ? "h-80" : "h-96";

  return (
    <div className="bg-white">
      <div className={`${chatHeight} overflow-y-auto p-4 space-y-3`}>
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.type === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <div className="text-sm">{message.content}</div>
              {message.followUp && (
                <div className="mt-2 text-xs opacity-75 italic">{message.followUp}</div>
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
            onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputMessage)}
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