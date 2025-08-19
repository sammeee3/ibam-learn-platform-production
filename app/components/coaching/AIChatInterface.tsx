// app/components/coaching/AIChatInterface.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, Send } from 'lucide-react';
import { aiCoachingResponses } from '../../lib/constants';
import type { AIMessage } from '../../lib/types';

const AIChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>([
    { type: 'ai', content: "Hi! I'm your faith-driven business coach. I'm here to help you apply today's session to your specific business situation. What questions do you have?" }
  ]);
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

    // Simulate AI response delay
    setTimeout(() => {
      const response = aiCoachingResponses[message] || {
        response: `Thanks for your question: "${message}". Based on today's session about Faith-Driven business foundations, remember that God has called you to create value through your work. Every business challenge is an opportunity to demonstrate His character. Consider how this situation might be an opportunity to show integrity, excellence, or servant leadership. What specific step could you take this week to apply biblical principles to this challenge?`,
        followUp: "Would you like me to elaborate on any specific aspect?"
      };

      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: response.response,
        followUp: response.followUp 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg">
        <h5 className="font-semibold flex items-center">
          <Bot className="w-5 h-5 mr-2" />
          🤖 AI Faith-Business Coach
        </h5>
        <p className="text-sm text-blue-100">Context-aware coaching for today's session</p>
      </div>

      <div className="h-64 overflow-y-auto p-4 space-y-3">
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