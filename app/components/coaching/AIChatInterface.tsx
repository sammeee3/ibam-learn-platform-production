// app/components/coaching/AIChatInterface.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, Send } from 'lucide-react';
import { aiCoachingResponses } from '../../lib/constants';
import type { AIMessage } from '../../lib/types';
import { IBAM_COACHING_KNOWLEDGE, DISCOVERY_QUESTIONS } from '../../lib/coaching-knowledge-base';
import { ASSESSMENT_COACHING_INTEGRATION } from '../../lib/assessment-coaching-integration';
import { AI_COACH_INTRODUCTION, getPersonalizedIntroduction } from '../../lib/ai-coach-introduction';

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

  // Initialize with personalized IBAM coaching introduction
  useEffect(() => {
    const initializeCoaching = async () => {
      // Use our new AI coach introduction
      const personalizedIntro = getPersonalizedIntroduction({
        isFirstSession: sessionId === 1,
        hasAssessment: false // We'll enhance this later with real assessment data
      });
      
      // Add session context
      const sessionContext = sessionTitle 
        ? `\n\n**Today's Focus:** "${sessionTitle}"\n\nWhat questions do you have about applying today's biblical business principles to your situation?`
        : "\n\nWhat questions do you have about your current session?";
      
      const fullGreeting = personalizedIntro + sessionContext;
      
      setMessages([{ type: 'ai', content: fullGreeting }]);
    };
    
    initializeCoaching();
  }, [sessionTitle, sessionId]);
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

    // Enhanced context-aware discovery coaching response
    setTimeout(() => {
      const response = generateDiscoveryResponse(message, sessionTitle, moduleId, sessionId);

      setMessages(prev => [...prev, { 
        type: 'ai', 
        content: response.response,
        followUp: response.followUp 
      }]);
      setIsTyping(false);
      setConversationTurn(prev => prev + 1);
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

  // IBAM Discovery-Based Coaching Response Generator
  const generateDiscoveryResponse = (userMessage: string, sessionTitle: string, moduleId?: number, sessionId?: number) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Use IBAM coaching knowledge for context
    const contextPhrase = AI_COACH_INTRODUCTION.contextPhrases.experienceReference;
    
    // Handle identity questions first
    if (lowerMessage.includes("who are you") || lowerMessage.includes("what are you")) {
      return {
        response: `I'm your IBAM Coaching Assistant, backed by experienced IBAM business coaches who follow Jesus. I'm here to help as much as you want or need with discovery questions and biblical business guidance. 

**Try using me first for your coaching needs** - I can help you work through most situations right away.

**Want human connection?** You can request a volunteer IBAM coach [here]. Our volunteers are amazing entrepreneurs and ministers themselves!

Based on today's session "${sessionTitle}", what's your biggest question about applying biblical business principles?`,
        followUp: "What specific challenge can I help you think through?"
      };
    }
    
    // Handle simple greetings with discovery approach
    if (lowerMessage === "hi" || lowerMessage === "hello" || lowerMessage === "hey") {
      const discoveryQuestions = DISCOVERY_QUESTIONS.what.vision;
      const randomQuestion = discoveryQuestions[Math.floor(Math.random() * discoveryQuestions.length)];
      
      return {
        response: `Hi there! I'm excited to help you discover your next steps. ${contextPhrase}, the most breakthrough moments happen when students explore their own insights from today's session.

From "${sessionTitle}" - ${randomQuestion}`,
        followUp: "What's on your heart about your business calling?"
      };
    }
    
    // Business experience and challenge questions - use WHO questions
    if (lowerMessage.includes('objective') || lowerMessage.includes('goal') || lowerMessage.includes('learn') || lowerMessage.includes('what should')) {
      const whoQuestions = DISCOVERY_QUESTIONS.who.identity;
      const whatQuestions = DISCOVERY_QUESTIONS.what.vision;
      const randomWhoQuestion = whoQuestions[Math.floor(Math.random() * whoQuestions.length)];
      const randomWhatQuestion = whatQuestions[Math.floor(Math.random() * whatQuestions.length)];
      
      return {
        response: `Great question about your learning journey! ${contextPhrase}, the most powerful learning happens when you connect today's content to your specific calling.

From "${sessionTitle}", let's explore: ${randomWhatQuestion}

And I'm curious: ${randomWhoQuestion}`,
        followUp: "What resonates most with your heart about your business vision?"
      };
    }
    
    // Starting out questions
    if (lowerMessage.includes('starting out') || lowerMessage.includes('just starting') || lowerMessage.includes('beginner')) {
      const sessionKnowledge = getSessionKnowledge(sessionTitle, moduleId);
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
      const sessionKnowledge = getSessionKnowledge(sessionTitle, moduleId);
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
        response: `Pricing is tough! Let's think through this biblically. What does "fair" mean to you? From "${sessionTitle}", we learn that God wants us to be honest and excellent in our work. What fears do you have about your pricing?`,
        followUp: "What would pricing with complete integrity look like in your business?"
      };
    }
    
    if (lowerMessage.includes('funding') || lowerMessage.includes('investment') || lowerMessage.includes('capital')) {
      return {
        response: `Funding questions show great vision! But here's what I've learned: Most successful faith-driven businesses start with stewarding what they have first. From "${sessionTitle}", what resources has God already given you that you could maximize? Sometimes the best funding is proving the concept small first.`,
        followUp: "What's one way you could test your business idea with the resources you have now?"
      };
    }
    
    if (lowerMessage.includes('customer') || lowerMessage.includes('client') || lowerMessage.includes('market')) {
      return {
        response: `Finding customers is exciting! From "${sessionTitle}", remember that business is about serving others. Who specifically are you called to serve? What problems keep them up at night that you could solve? The best customers become raving fans when you truly serve them well.`,
        followUp: "If you could help one specific type of person, who would it be and what's their biggest challenge?"
      };
    }
    
    if (lowerMessage.includes('profit') || lowerMessage.includes('money') || lowerMessage.includes('income')) {
      return {
        response: `Money and ministry - I get the tension! From "${sessionTitle}", profit isn't evil when it serves God's purposes. Profit allows you to: 1) Serve customers better, 2) Provide for your family, 3) Give generously, 4) expand your impact. What guilt or excitement do you feel about making money?`,
        followUp: "How could your profit become a tool for Kingdom impact?"
      };
    }
    
    if (lowerMessage.includes('fear') || lowerMessage.includes('scared') || lowerMessage.includes('worried')) {
      return {
        response: `Thank you for sharing that vulnerability. Fear is normal! From "${sessionTitle}", we know God has equipped you for this work. What specifically worries you most? Often our fears point to where we need to trust God more and prepare better.`,
        followUp: "What's one small, brave step you could take this week to face that fear?"
      };
    }
    
    // IBAM Discovery-Based Fallback - Use our systematic discovery questions
    const discoveryCategories = ['who', 'what', 'when', 'where', 'why', 'how'];
    const currentCategory = discoveryCategories[conversationTurn % discoveryCategories.length];
    
    let discoveryQuestion, followUpQuestion, contextIntro;
    
    switch (currentCategory) {
      case 'who':
        const whoQuestions = DISCOVERY_QUESTIONS.who.identity;
        discoveryQuestion = whoQuestions[Math.floor(Math.random() * whoQuestions.length)];
        followUpQuestion = "Who are the people you feel called to serve?";
        contextIntro = `${contextPhrase}, great entrepreneurs know their identity and calling.`;
        break;
      case 'what':
        const whatQuestions = DISCOVERY_QUESTIONS.what.vision;
        discoveryQuestion = whatQuestions[Math.floor(Math.random() * whatQuestions.length)];
        followUpQuestion = "What would success look like for you?";
        contextIntro = `${contextPhrase}, clarity of vision drives everything.`;
        break;
      case 'when':
        const whenQuestions = DISCOVERY_QUESTIONS.when.timing;
        discoveryQuestion = whenQuestions[Math.floor(Math.random() * whenQuestions.length)];
        followUpQuestion = "When do you feel most motivated to take action?";
        contextIntro = `${contextPhrase}, timing and urgency create momentum.`;
        break;
      case 'where':
        const whereQuestions = DISCOVERY_QUESTIONS.where.market;
        discoveryQuestion = whereQuestions[Math.floor(Math.random() * whereQuestions.length)];
        followUpQuestion = "Where do you see your biggest opportunities?";
        contextIntro = `${contextPhrase}, knowing your marketplace is crucial.`;
        break;
      case 'why':
        const whyQuestions = DISCOVERY_QUESTIONS.why.purpose;
        discoveryQuestion = whyQuestions[Math.floor(Math.random() * whyQuestions.length)];
        followUpQuestion = "Why does this matter to your heart?";
        contextIntro = `${contextPhrase}, your 'why' gives you power through challenges.`;
        break;
      default:
        const howQuestions = DISCOVERY_QUESTIONS.how.strategy;
        discoveryQuestion = howQuestions[Math.floor(Math.random() * howQuestions.length)];
        followUpQuestion = "How might God be leading you to approach this?";
        contextIntro = `${contextPhrase}, the 'how' turns vision into reality.`;
    }
    
    return {
      response: `Great question! ${contextIntro} Let me ask you something that might unlock insights:

${discoveryQuestion}

And connecting this to "${sessionTitle}" - what resonates with your situation?`,
      followUp: followUpQuestion
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