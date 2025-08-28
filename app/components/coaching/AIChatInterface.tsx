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

  // Context-aware quick prompts based on session
  const getQuickPrompts = (sessionTitle: string) => {
    if (sessionTitle.includes("Good Gift from God")) {
      return [
        "What are the learning objectives for this session?",
        "How does business being a good gift affect me?",
        "What if I'm just starting out?",
        "How do I price my services fairly?"
      ];
    }
    
    return [
      "What should I learn from this session?",
      "How do I apply this to my business?",
      "What if I'm just starting out?",
      "How do I find my first customers?"
    ];
  };

  const quickPrompts = getQuickPrompts(sessionTitle);

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

  // Track conversation history to avoid repetition
  const [askedQuestions, setAskedQuestions] = useState<Set<string>>(new Set());
  const [conversationTurn, setConversationTurn] = useState(0);

  // Session-specific knowledge base
  const getSessionKnowledge = (sessionTitle: string, moduleId?: number) => {
    const sessionKnowledge: { [key: string]: any } = {
      "Business is a Good Gift from God": {
        keyPoints: ["God created work as good", "Business can glorify God", "Stewardship of talents", "Creating value for others"],
        scripture: "Genesis 1:28 - God blessed them and said 'Be fruitful and increase in number; fill the earth and subdue it'",
        objectives: ["Understand business as God's design", "Recognize your role as a steward", "See how work can worship God"]
      },
      "Finding Your Why": {
        keyPoints: ["Your unique calling", "Purpose drives profit", "Mission-driven entrepreneurship", "Kingdom impact through business"],
        scripture: "Jeremiah 29:11 - 'For I know the plans I have for you,' declares the Lord",
        objectives: ["Discover your unique business calling", "Align purpose with profit", "Create a mission statement"]
      }
      // Add more sessions as needed
    };
    
    return sessionKnowledge[sessionTitle] || {
      keyPoints: ["Biblical business principles", "Faith-driven entrepreneurship", "Serving others through business"],
      objectives: ["Apply biblical principles to business", "Integrate faith with entrepreneurship"]
    };
  };

  // Enhanced discovery-based coaching response generator
  const generateDiscoveryResponse = (userMessage: string, sessionTitle: string, moduleId?: number, sessionId?: number) => {
    const lowerMessage = userMessage.toLowerCase();
    const sessionKnowledge = getSessionKnowledge(sessionTitle, moduleId);
    const sessionContext = sessionTitle !== "Current Session" ? sessionTitle : "this session";
    
    // Increment conversation turn
    setConversationTurn(prev => prev + 1);
    
    // Handle meta-questions about the coaching itself
    if (lowerMessage.includes("didn't answer") || lowerMessage.includes("didnt answer") || lowerMessage.includes("try again")) {
      return {
        response: `I hear you - let me be more direct. What specifically would be most helpful for you right now? I can share insights about ${sessionContext}, help you apply the concepts to your situation, or discuss how "${sessionTitle}" connects to your business journey.`,
        followUp: "What's the real challenge you're facing today?"
      };
    }
    
    // Learning objectives question  
    if (lowerMessage.includes('objective') || lowerMessage.includes('goal') || lowerMessage.includes('learn')) {
      return {
        response: `Great question! The key objectives for "${sessionTitle}" are: ${sessionKnowledge.objectives?.join(', ')}. Which of these resonates most with where you are in your business journey right now?`,
        followUp: "What specific area would you like to dive deeper into?"
      };
    }
    
    // Starting out questions
    if (lowerMessage.includes('starting out') || lowerMessage.includes('just starting') || lowerMessage.includes('beginner')) {
      return {
        response: `Starting out is both exciting and overwhelming! Based on "${sessionTitle}", the first step is understanding that ${sessionKnowledge.keyPoints?.[0] || "God has equipped you for this"}. What's the biggest uncertainty you're facing as you begin?`,
        followUp: "What's one small step you could take this week to move forward with confidence?"
      };
    }

    // Session content questions
    if (lowerMessage.includes('affect me') || lowerMessage.includes('apply') || lowerMessage.includes('how does')) {
      if (sessionTitle.includes("Good Gift from God")) {
        return {
          response: `"Business is a Good Gift from God" means you're not just making money - you're stewarding God's gifts to serve others! This affects you by: 1) Removing guilt about profit when it serves others, 2) Giving you confidence that God wants you to succeed, 3) Showing that excellence in business can be worship. What part of your business feels most aligned with serving others right now?`,
          followUp: "How could you see your daily work as an act of worship this week?"
        };
      }
      return {
        response: `Great question about application! The core insight from "${sessionTitle}" is that ${sessionKnowledge.keyPoints?.[0] || "faith and business can work together"}. This affects your business by changing your motivation, methods, and ultimate goals. What's one business decision you're facing where this perspective could help?`,
        followUp: "How might approaching this with biblical principles change your decision?"
      };
    }
    
    // Discovery coaching patterns for common topics
    if (lowerMessage.includes('pricing') || lowerMessage.includes('price')) {
      if (askedQuestions.has('pricing')) {
        return {
          response: `Since we've talked about pricing, let me be more specific: Fair pricing means covering your costs + reasonable profit + excellent service. From "${sessionTitle}", this means pricing that honors God by: 1) Not cheating customers, 2) Not undervaluing your work, 3) Allowing you to serve others well. What's your current pricing challenge?`,
          followUp: "What would confident, God-honoring pricing look like for your specific situation?"
        };
      }
      setAskedQuestions(prev => new Set([...prev, 'pricing']));
      return {
        response: `Pricing is tough! Let's think through this biblically. What does "fair" mean to you? From "${sessionContext}", we learn that God wants us to be honest and excellent in our work. What fears do you have about your pricing?`,
        followUp: "What would pricing with complete integrity look like in your business?"
      };
    }
    
    if (lowerMessage.includes('funding') || lowerMessage.includes('investment') || lowerMessage.includes('capital')) {
      return {
        response: `Funding questions show great vision! But here's what I've learned: Most successful faith-driven businesses start with stewarding what they have first. From "${sessionContext}", what resources has God already given you that you could maximize? Sometimes the best funding is proving the concept small first.`,
        followUp: "What's one way you could test your business idea with the resources you have now?"
      };
    }
    
    if (lowerMessage.includes('customer') || lowerMessage.includes('client') || lowerMessage.includes('market')) {
      return {
        response: `Finding customers is exciting! From "${sessionContext}", remember that business is about serving others. Who specifically are you called to serve? What problems keep them up at night that you could solve? The best customers become raving fans when you truly serve them well.`,
        followUp: "If you could help one specific type of person, who would it be and what's their biggest challenge?"
      };
    }
    
    if (lowerMessage.includes('profit') || lowerMessage.includes('money') || lowerMessage.includes('income')) {
      return {
        response: `Money and ministry - I get the tension! From "${sessionContext}", profit isn't evil when it serves God's purposes. Profit allows you to: 1) Serve customers better, 2) Provide for your family, 3) Give generously, 4) expand your impact. What guilt or excitement do you feel about making money?`,
        followUp: "How could your profit become a tool for Kingdom impact?"
      };
    }
    
    if (lowerMessage.includes('fear') || lowerMessage.includes('scared') || lowerMessage.includes('worried')) {
      return {
        response: `Thank you for sharing that vulnerability. Fear is normal! From "${sessionContext}", we know God has equipped you for this work. What specifically worries you most? Often our fears point to where we need to trust God more and prepare better.`,
        followUp: "What's one small, brave step you could take this week to face that fear?"
      };
    }
    
    // Avoid repetitive default responses
    const defaultResponses = [
      {
        response: `I want to give you a helpful answer! From "${sessionContext}", the key insight is that ${sessionKnowledge.keyPoints?.[0] || "God designed you for meaningful work"}. Can you help me understand what specific challenge you're facing?`,
        followUp: "What would success look like in this area of your business?"
      },
      {
        response: `Let me try a different approach. From "${sessionTitle}", we learn that ${sessionKnowledge.keyPoints?.[1] || "business can glorify God"}. What's the most pressing question on your mind about your business right now?`,
        followUp: "How can I help you apply today's lesson to your specific situation?"
      },
      {
        response: `I sense you're looking for practical help! Based on "${sessionContext}", think about this: ${sessionKnowledge.keyPoints?.[2] || "your work can serve others"}. What's one area where you feel stuck or uncertain?`,
        followUp: "What would breakthrough in this area mean for you?"
      }
    ];
    
    return defaultResponses[conversationTurn % defaultResponses.length];
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