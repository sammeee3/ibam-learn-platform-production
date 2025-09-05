// app/components/coaching/AIChatInterface.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bot, Send } from 'lucide-react';
import { aiCoachingResponses } from '../../lib/constants';
import type { AIMessage } from '../../lib/types';
import { IBAM_COACHING_KNOWLEDGE } from '../../lib/coaching-knowledge-base';
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

  // Track conversation history
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

  // Enhanced Coaching Response Generator - Knowledge + Discovery Balance
  const generateDiscoveryResponse = (userMessage: string, sessionTitle: string, moduleId?: number, sessionId?: number) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // 1. INTENT RECOGNITION - Determine what the user actually needs
    const intent = recognizeUserIntent(lowerMessage);
    
    // 2. HANDLE DIRECT QUESTIONS FIRST - Answer then discover
    if (intent.type === 'instruction' || intent.type === 'definition') {
      return generateKnowledgeResponse(lowerMessage, sessionTitle);
    }
    
    // 3. HANDLE IDENTITY QUESTIONS
    if (lowerMessage.includes("who are you") || lowerMessage.includes("what are you")) {
      return {
        response: `I'm your IBAM Coaching Assistant, backed by experienced IBAM business coaches who follow Jesus. I'm here to help as much as you want or need with discovery questions and biblical business guidance. 

**Try using me first for your coaching needs** - I can help you work through most situations right away.

**Want human connection?** You can request a volunteer IBAM coach [here]. Our volunteers are amazing entrepreneurs and ministers themselves!

Based on today's session "${sessionTitle}", what's your biggest question about applying biblical business principles?`,
        followUp: "What specific challenge can I help you think through?"
      };
    }
    
    // 4. HANDLE FRUSTRATION - User feedback about AI responses
    if (lowerMessage.includes('not listening') || lowerMessage.includes('makes no sense') || 
        lowerMessage.includes('answer me') || lowerMessage.includes('straightforward')) {
      return {
        response: `You're absolutely right, and I apologize. Let me give you a direct answer to your original question.

If you asked about **action items**: Action items are specific commitments you make during the session to apply what you've learned. You can track them, set deadlines, and mark them complete to build momentum in your business development.

If you asked something else, please repeat your question and I'll give you a clear, direct answer first - then we can explore it together if helpful.`,
        followUp: "What specific question can I answer clearly for you right now?"
      };
    }
    
    // 5. HANDLE COMMENTS (not questions) - Acknowledge before engaging
    if (!lowerMessage.includes('?') && !lowerMessage.includes('how') && !lowerMessage.includes('what') && 
        !lowerMessage.includes('why') && !lowerMessage.includes('when') && !lowerMessage.includes('where')) {
      return {
        response: `I hear you sharing that perspective. Thank you for the feedback - it helps me understand what you need better.

From today's session "${sessionTitle}", that insight connects to the principle that effective business relationships require genuine listening and understanding.

What questions do you have that I can answer directly for you?`,
        followUp: "How can I be more helpful to you right now?"
      };
    }
    
    // 6. GREETINGS with useful follow-up
    if (lowerMessage === "hi" || lowerMessage === "hello" || lowerMessage === "hey") {
      return {
        response: `Hi there! I'm here to help you with questions about "${sessionTitle}" and applying biblical business principles to your situation.

I can provide direct answers, help you think through challenges, or explore new insights - whatever is most helpful for you right now.`,
        followUp: "What specific question about today's session can I help you with?"
      };
    }
    
    // 7. BUSINESS TOPICS - Substantive content first, then discovery
    const businessResponse = getBusinessTopicResponse(lowerMessage, sessionTitle);
    if (businessResponse) return businessResponse;
    
    // 8. APPLICATION QUESTIONS - Give substance first
    if (lowerMessage.includes('apply') || lowerMessage.includes('how do i') || lowerMessage.includes('how does')) {
      return generateApplicationResponse(sessionTitle, moduleId);
    }
    
    // 9. DISCOVERY FALLBACK - But more targeted
    return generateTargetedDiscovery(lowerMessage, sessionTitle, conversationTurn);
  };

  // HELPER FUNCTIONS FOR IMPROVED COACHING

  const recognizeUserIntent = (message: string) => {
    // Instruction-seeking patterns
    if (message.includes('how do i') || message.includes('how to') || 
        message.includes('steps') || message.includes('process')) {
      return { type: 'instruction', confidence: 'high' };
    }
    
    // Definition-seeking patterns  
    if (message.includes('what is') || message.includes('what are') ||
        message.includes('define') || message.includes('meaning')) {
      return { type: 'definition', confidence: 'high' };
    }
    
    // Problem-solving patterns
    if (message.includes('problem') || message.includes('challenge') ||
        message.includes('stuck') || message.includes('help')) {
      return { type: 'problem-solving', confidence: 'medium' };
    }
    
    // Discovery-seeking patterns
    if (message.includes('should i') || message.includes('what if') ||
        message.includes('explore') || message.includes('think about')) {
      return { type: 'discovery', confidence: 'high' };
    }
    
    return { type: 'general', confidence: 'low' };
  };

  const generateKnowledgeResponse = (lowerMessage: string, sessionTitle: string) => {
    // Check for business terms first
    const businessTerm = findBusinessTerm(lowerMessage);
    if (businessTerm) {
      return {
        response: `**${businessTerm.term}**: ${businessTerm.definition}

From "${sessionTitle}", this applies to your situation because biblical business principles emphasize understanding and excellence in all aspects of your work.

How does this concept relate to your current business challenge?`,
        followUp: "What specific aspect would you like to explore further?"
      };
    }
    
    // Handle "action items" specifically
    if (lowerMessage.includes('action item')) {
      return {
        response: `**Action Items** are specific commitments you make during each session to apply biblical business principles to your real situation. Here's how to use them effectively:

**1. Make them specific** - Instead of "think about customers," write "interview 3 potential customers about their biggest problem"
**2. Set deadlines** - "By Friday" or "This week"  
**3. Track completion** - Check them off when done
**4. Review regularly** - See your progress over time

From "${sessionTitle}", your action items should connect today's content to concrete steps in your business development.`,
        followUp: "What action item would help you apply today's lesson most effectively?"
      };
    }
    
    // Session application knowledge
    if (lowerMessage.includes('apply') && sessionTitle.includes("Good Gift from God")) {
      return {
        response: `**Applying "Business is a Good Gift from God":**

**Mindset Shift**: You're not just making money - you're stewarding God's gifts to serve others
**Practical Impact**: 
• Remove guilt about profit when it serves people well
• Gain confidence that God wants your business to succeed  
• See daily work as potential worship and ministry
• Make decisions based on service, not just profit

**This Week**: Look at one business decision through this lens - how does it serve others and honor God?`,
        followUp: "Which area of your business needs this perspective shift most?"
      };
    }
    
    // General knowledge fallback
    return {
      response: `That's a great question about practical application. From "${sessionTitle}", the key principles focus on integrating faith with excellent business practices.

Let me know what specific aspect you'd like me to explain more clearly - I can provide detailed guidance on business terms, biblical principles, or practical steps.`,
      followUp: "What specific part of today's content would be most helpful to understand better?"
    };
  };

  const findBusinessTerm = (message: string) => {
    // Check against our business terms library
    const allTerms = [
      ...Object.keys(IBAM_COACHING_KNOWLEDGE.businessTerms.financial),
      ...Object.keys(IBAM_COACHING_KNOWLEDGE.businessTerms.marketing),
      ...Object.keys(IBAM_COACHING_KNOWLEDGE.businessTerms.operations),
      ...Object.keys(IBAM_COACHING_KNOWLEDGE.businessTerms.strategy)
    ];
    
    for (const term of allTerms) {
      if (message.includes(term.toLowerCase())) {
        // Find the definition
        for (const category of Object.values(IBAM_COACHING_KNOWLEDGE.businessTerms)) {
          if (category[term]) {
            return { term, definition: category[term] };
          }
        }
      }
    }
    return null;
  };

  const getBusinessTopicResponse = (message: string, sessionTitle: string) => {
    if (message.includes('pricing') || message.includes('price')) {
      return {
        response: `**Pricing Strategy from Biblical Principles:**

**Fair Pricing Formula**: Costs + Reasonable Profit + Excellent Service
**Biblical Foundation**: "Give everyone what you owe them" (Romans 13:7)

**Practical Steps**:
1. Calculate actual costs (time, materials, overhead)  
2. Add profit that allows reinvestment and generosity
3. Ensure value delivered exceeds price charged
4. Price confidently - undervaluing your work doesn't serve anyone

**Common Mistake**: Pricing too low from false humility actually hurts customers (limits your ability to serve them well).`,
        followUp: "What's your biggest fear or question about pricing your solution?"
      };
    }
    
    if (message.includes('customer') || message.includes('client') || message.includes('market')) {
      return {
        response: `**Finding Customers Through Service:**

**Jesus' Method**: He went where people were hurting and served them first
**Business Application**: Find people with real problems you can solve

**Practical Framework**:
1. **Who**: Identify specific people you're called to serve
2. **Where**: Go where they already spend time  
3. **What**: Listen to their actual problems (don't assume)
4. **How**: Serve first, sell second

**From "${sessionTitle}"**: Your customers aren't transactions - they're people God loves whom you're called to serve.`,
        followUp: "Who specifically are you feeling called to serve through your business?"
      };
    }
    
    return null; // No specific business topic found
  };

  const generateApplicationResponse = (sessionTitle: string, moduleId?: number) => {
    const sessionKnowledge = getSessionKnowledge(sessionTitle, moduleId);
    
    return {
      response: `**Applying "${sessionTitle}" to Your Business:**

**Core Principle**: ${sessionKnowledge.keyPoints?.[0] || "Faith and business work together when both serve others"}

**Practical Application**:
• **This Week**: ${sessionKnowledge.keyPoints?.[1] || "Look for one way to serve customers better"}
• **Decision Framework**: Ask "How does this honor God and serve people?" 
• **Daily Practice**: ${sessionKnowledge.keyPoints?.[2] || "See your work as ministry opportunity"}

**Biblical Foundation**: ${sessionKnowledge.scripture || "All work done excellently can glorify God"}`,
      followUp: "Which specific business decision could you apply this to right now?"
    };
  };

  const generateTargetedDiscovery = (message: string, sessionTitle: string, turn: number) => {
    const contextPhrase = AI_COACH_INTRODUCTION.contextPhrases.experienceReference;
    
    // More targeted discovery based on actual message content
    if (message.includes('start') || message.includes('begin')) {
      return {
        response: `Starting is both exciting and challenging! ${contextPhrase}, the most successful entrepreneurs start with clarity about who they're serving.

From "${sessionTitle}", what's the specific problem you want to solve for people?`,
        followUp: "What's one small step you could take this week to test that idea?"
      };
    }
    
    // Default discovery - but less random
    const categories = ['who', 'what', 'why', 'how'];
    const category = categories[turn % categories.length];
    
    let question: string, followUp: string;
    switch (category) {
      case 'who':
        question = "Who are the specific people you feel called to serve through business?";
        followUp = "What problems keep them up at night?";
        break;
      case 'what':
        question = "What unique value could you bring to solve a real problem?";
        followUp = "What would success look like for the people you serve?";
        break;
      case 'why':  
        question = "Why does this business opportunity matter to your heart?";
        followUp = "How could this work become ministry?";
        break;
      default:
        question = "How could you test this idea with one person this week?";
        followUp = "What would you need to learn to serve them excellently?";
    }
    
    return {
      response: `That's a great direction to explore! From "${sessionTitle}", let me ask: ${question}`,
      followUp
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