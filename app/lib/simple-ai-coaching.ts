/**
 * SIMPLE AI COACHING SERVICE
 * Provides intelligent responses with fallback to comprehensive knowledge base
 */

import { IBAM_COMPREHENSIVE_KNOWLEDGE } from './ibam-comprehensive-knowledge';
import type { SessionData } from './types';

interface CoachingRequest {
  question: string;
  sessionData?: SessionData;
}

interface CoachingResponse {
  answer: string;
  source: 'ai' | 'fallback';
  scriptureReferences?: string[];
  followUpQuestions?: string[];
}

class SimpleAICoaching {
  
  async getResponse(request: CoachingRequest): Promise<CoachingResponse> {
    const question = request.question.toLowerCase().trim();
    
    // Handle greetings first
    if (this.isGreeting(question)) {
      return this.getGreetingResponse(request.sessionData);
    }
    
    // Handle identity questions directly
    if (this.isIdentityQuestion(question)) {
      return this.getIdentityResponse();
    }
    
    // Handle content gap analysis
    if (this.isContentGapQuestion(question)) {
      return this.getContentGapResponse(question, request.sessionData);
    }
    
    // Handle wealth/prosperity questions with direct biblical guidance
    if (this.isWealthProsperityQuestion(question)) {
      return this.getWealthProsperityResponse(question);
    }
    
    // Handle session terminology
    if (this.isSessionTerminology(question)) {
      return this.getSessionTerminologyResponse(question);
    }
    
    // Handle session-specific content questions FIRST (highest priority)
    if (this.isSessionContentQuestion(question) && request.sessionData) {
      return this.getSessionContentResponse(question, request.sessionData);
    }
    
    // Direct question handling with comprehensive responses
    if (this.isAboutCourse(question)) {
      return this.getCourseResponse(question, request.sessionData);
    }
    
    // Business ethics BEFORE theological (more specific)
    if (this.isBusinessEthicsQuestion(question)) {
      return this.getBusinessEthicsResponse(question);
    }
    
    if (this.isTheologicalQuestion(question)) {
      return this.getTheologicalResponse(question);
    }
    
    if (this.isBusinessPlannerQuestion(question)) {
      return this.getBusinessPlannerResponse(question);
    }

    if (this.isPracticalBusinessQuestion(question)) {
      return this.getPracticalBusinessResponse(question);
    }
    
    // Default helpful response
    return this.getDefaultResponse(request.question);
  }

  private isGreeting(question: string): boolean {
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'hi coach', 'hello coach', 'hey coach'];
    return greetings.some(greeting => question === greeting || question === greeting + '!');
  }

  // NEW: Handle identity questions directly
  private isIdentityQuestion(question: string): boolean {
    return question.includes('who are you') || question.includes('what are you') || question === 'who are you?';
  }

  // NEW: Handle content gap analysis
  private isContentGapQuestion(question: string): boolean {
    const gapKeywords = [
      'not mentioned', 'missing from', 'what about', 'issues not', 'gaps in',
      'not covered', 'overlooked', 'not addressed', 'what else', 'other issues'
    ];
    return gapKeywords.some(keyword => question.includes(keyword));
  }

  // NEW: Detect wealth/prosperity questions
  private isWealthProsperityQuestion(question: string): boolean {
    const wealthKeywords = [
      'make me rich', 'make me wealthy', 'god serve me', 'will following god make me',
      'prosperity', 'wealth', 'rich', 'money', 'financial success', 'get rich',
      'hoping that god will serve me', 'will this work'
    ];
    return wealthKeywords.some(keyword => question.includes(keyword));
  }

  private getGreetingResponse(sessionData?: SessionData): CoachingResponse {
    const sessionContext = sessionData ? `"${sessionData.title}"` : 'your learning';
    return {
      answer: `Hello! I'm your IBAM Online Coach, and I'm excited to help you integrate biblical principles with practical business wisdom.

${sessionData ? `I see you're working on ${sessionContext}. That's excellent!` : 'Great to connect with you today!'}

**I'm here to help you with**:
• Biblical business principles and their practical application
• Course content questions and guidance
• Business ethics and decision-making
• Practical business skills (marketing, finance, operations)
• Action planning and implementation

What questions do you have? I'm ready to give you direct, helpful answers!`,
      source: 'fallback'
    };
  }

  private isSessionTerminology(question: string): boolean {
    const terms = ['looking back', 'looking up', 'looking forward', 'session structure', 'what does looking', 'what is looking'];
    return terms.some(term => question.includes(term));
  }

  private getSessionTerminologyResponse(question: string): CoachingResponse {
    if (question.includes('looking back')) {
      return {
        answer: `**"Looking Back"** is the first part of each IBAM session where you:

• **Review your previous action commitments** - What did you commit to do last session?
• **Reflect on your progress** - How did it go? What did you learn?
• **Celebrate wins and learn from challenges** - Both success and struggle teach us
• **Prepare your heart and mind** for new learning

This reflection time helps you build on what you've learned and stay accountable to your growth. It's based on the biblical principle of remembering God's faithfulness and learning from experience.

**Purpose**: Accountability, reflection, and building momentum in your faith-business journey.`,
        source: 'fallback',
        scriptureReferences: ['1 Samuel 7:12 - "Thus far the LORD has helped us"']
      };
    }

    if (question.includes('looking up')) {
      return {
        answer: `**"Looking Up"** is the second part of each session where you:

• **Focus on God and His Word** - What does Scripture teach about today's topic?
• **Ground yourself in biblical truth** - Get God's perspective before human wisdom
• **Pray for wisdom and guidance** - Invite God into your business decisions
• **Connect with the spiritual foundation** for practical business principles

This time ensures that everything you learn is built on the solid rock of God's Word, not just human business theory.

**Purpose**: Seek first God's Kingdom and His righteousness in all business matters (Matthew 6:33).`,
        source: 'fallback',
        scriptureReferences: ['Matthew 6:33', 'Psalm 121:1 - "I lift up my eyes to the mountains"']
      };
    }

    if (question.includes('looking forward')) {
      return {
        answer: `**"Looking Forward"** is the final part of each session where you:

• **Create specific action commitments** - What exactly will you do with what you've learned?
• **Plan your next steps** - Turn knowledge into action
• **Set measurable goals** - Make commitments you can track
• **Prepare for accountability** - Get ready to report back next session

This is where learning becomes living. James 1:22 says "Be doers of the word, and not hearers only."

**Purpose**: Transform biblical business knowledge into real-world action that honors God and serves others.`,
        source: 'fallback',
        scriptureReferences: ['James 1:22 - "Be doers of the word, and not hearers only"']
      };
    }

    return {
      answer: `**IBAM Session Structure** - Each session follows a proven learning pattern:

**🔙 Looking Back**: Review progress and reflect on previous commitments
**🔼 Looking Up**: Ground yourself in Scripture and biblical principles  
**📖 Main Content**: Learn practical business skills with biblical foundation
**🔜 Looking Forward**: Create specific action plans for implementation

This structure ensures you don't just learn information, but actually transform how you do business according to God's design.`,
      source: 'fallback'
    };
  }

  private isSessionContentQuestion(question: string): boolean {
    const sessionKeywords = [
      'case study', 'case studies', 'insights', 'main point', 'key point', 'reading', 'content', 'section',
      'what does this session', 'what did we learn', 'summary', 'takeaway', 'lesson', 'teaching',
      'scripture', 'bible verse', 'principle', 'guideline', 'example', 'story', 'illustration',
      'this session', 'today', 'current session', 'now learning', 'video', 'material', 'curriculum'
    ];
    return sessionKeywords.some(keyword => question.includes(keyword));
  }

  private getSessionContentResponse(question: string, sessionData: SessionData): CoachingResponse {
    // Extract content from the session data
    const content = sessionData.content as any;
    
    // Handle case study questions
    if (question.includes('case study') || question.includes('case studies') || question.includes('insights')) {
      return this.getCaseStudyResponse(content, sessionData.title);
    }
    
    // Handle main point/key points questions
    if (question.includes('main point') || question.includes('key point') || question.includes('summary') || question.includes('takeaway')) {
      return this.getMainPointsResponse(content, sessionData.title);
    }
    
    // Handle reading/content questions
    if (question.includes('reading') || question.includes('content') || question.includes('material')) {
      return this.getReadingContentResponse(content, sessionData.title);
    }
    
    // Handle scripture questions
    if (question.includes('scripture') || question.includes('bible verse')) {
      return this.getScriptureResponse(content, sessionData);
    }
    
    // Handle principles/guidelines questions
    if (question.includes('principle') || question.includes('guideline') || question.includes('teaching')) {
      return this.getPrinciplesResponse(content, sessionData.title);
    }
    
    // General session question
    return this.getGeneralSessionResponse(content, sessionData.title);
  }

  private getCaseStudyResponse(content: any, sessionTitle: string): CoachingResponse {
    // Look for case studies in the content structure
    const caseStudies = content?.case_studies || content?.case_study || content?.examples || content?.stories;
    
    if (caseStudies) {
      let caseStudyText = '';
      
      if (Array.isArray(caseStudies)) {
        caseStudyText = caseStudies.join('\n\n');
      } else if (typeof caseStudies === 'string') {
        caseStudyText = caseStudies;
      } else if (typeof caseStudies === 'object') {
        caseStudyText = Object.values(caseStudies).join('\n\n');
      }
      
      if (caseStudyText.length > 50) {
        return {
          answer: `**Case Study Insights from "${sessionTitle}":**

${caseStudyText}

**Key Takeaways:**
• These examples show how biblical principles apply to real business situations
• Notice how integrity and service to others create sustainable success
• God honors businesses that operate with excellence and ethical standards

**Application Questions:**
• How does this case study relate to your current business situation?
• What principles from this example could you implement this week?`,
          source: 'fallback',
          followUpQuestions: [
            'Which principle from this case study resonates most with you?',
            'How could you apply this example to your business?'
          ]
        };
      }
    }
    
    // Check written curriculum for examples
    const mainContent = content?.written_curriculum?.main_content || content?.main_content;
    if (mainContent && mainContent.includes('example') || mainContent.includes('story') || mainContent.includes('business')) {
      // Extract relevant sections (simplified - could be enhanced with better parsing)
      const examples = this.extractExamplesFromContent(mainContent);
      
      return {
        answer: `**Business Examples from "${sessionTitle}":**

${examples}

**Insights You Can Apply:**
• Look for patterns of how biblical principles create business success
• Notice the long-term perspective in these examples
• See how serving others well leads to sustainable growth

These examples show that following God's guidelines isn't just morally right - it's also good business!`,
        source: 'fallback',
        followUpQuestions: [
          'Which example connects most with your situation?',
          'What similar challenges have you faced?'
        ]
      };
    }
    
    // Fallback if no specific case studies found
    return {
      answer: `I don't see specific case studies detailed in this session's content, but "${sessionTitle}" contains practical business principles you can apply.

**General Business Insights:**
• Biblical guidelines create sustainable business practices
• Integrity and excellence attract loyal customers
• Serving others well leads to long-term success
• God's wisdom applies to every business decision

What specific business challenge would you like to explore using the principles from this session?`,
      source: 'fallback',
      followUpQuestions: [
        'What business situation are you facing right now?',
        'Which biblical principle from this session interests you most?'
      ]
    };
  }

  private getMainPointsResponse(content: any, sessionTitle: string): CoachingResponse {
    // Look for key points, principles, or main teachings
    const keyPoints = content?.key_principles || content?.principles || content?.key_points || content?.main_points;
    const objectives = content?.objectives || content?.learning_objectives;
    const mainContent = content?.written_curriculum?.main_content || content?.main_content;
    
    let response = `**Main Points from "${sessionTitle}":**\n\n`;
    
    if (keyPoints) {
      if (Array.isArray(keyPoints)) {
        response += keyPoints.map(point => `• ${point}`).join('\n') + '\n\n';
      } else if (typeof keyPoints === 'string') {
        response += `• ${keyPoints}\n\n`;
      } else if (typeof keyPoints === 'object') {
        response += Object.values(keyPoints).map(point => `• ${point}`).join('\n') + '\n\n';
      }
    }
    
    if (objectives) {
      response += `**Learning Objectives:**\n`;
      if (Array.isArray(objectives)) {
        response += objectives.map(obj => `• ${obj}`).join('\n') + '\n\n';
      } else {
        response += `• ${objectives}\n\n`;
      }
    }
    
    // If no structured points, extract from main content
    if (!keyPoints && !objectives && mainContent) {
      const extractedPoints = this.extractKeyPointsFromContent(mainContent);
      response += extractedPoints + '\n\n';
    }
    
    response += `**Biblical Foundation:**
These guidelines come from God's wisdom for business and life. When we follow His principles, we build businesses that honor Him and serve others excellently.

**Next Steps:**
Choose one main point that resonates with your current situation and commit to applying it this week.`;
    
    return {
      answer: response,
      source: 'fallback',
      followUpQuestions: [
        'Which main point applies most to your business right now?',
        'How will you implement one of these principles this week?'
      ]
    };
  }

  private getReadingContentResponse(content: any, sessionTitle: string): CoachingResponse {
    const mainContent = content?.written_curriculum?.main_content || content?.main_content || content?.reading_content;
    
    if (mainContent && mainContent.length > 100) {
      // Provide a structured summary of the reading content
      const summary = this.createContentSummary(mainContent);
      
      return {
        answer: `**Reading Content Summary for "${sessionTitle}":**

${summary}

**How to Use This Content:**
• Read through it thoughtfully, considering how it applies to your situation
• Look for specific action steps you can take
• Notice the biblical foundation for each business principle
• Consider discussing these concepts with other Christian entrepreneurs

**Reflection Questions:**
• Which part of the reading challenged your current thinking?
• What new insight did you gain about God's view of business?`,
        source: 'fallback',
        followUpQuestions: [
          'What part of the reading content resonated most with you?',
          'How does this material change your perspective on business?'
        ]
      };
    }
    
    return {
      answer: `The reading content for "${sessionTitle}" contains important biblical business principles. 

While I can't display all the specific content here, the session covers:
• Biblical foundations for business management
• Practical applications of God's guidelines
• Real-world examples of faithful business practices
• Action steps you can implement immediately

I'd encourage you to work through the reading material section by section, taking time to reflect on how each principle applies to your business situation.

What specific aspect of business management would you like to explore further?`,
      source: 'fallback',
      followUpQuestions: [
        'What business management challenge are you facing?',
        'Which biblical principle interests you most?'
      ]
    };
  }

  private getScriptureResponse(content: any, sessionData: SessionData): CoachingResponse {
    const scriptureRef = sessionData.scripture_reference || content?.scripture || content?.bible_verse;
    const scriptureText = content?.scripture_text || content?.bible_text;
    
    if (scriptureRef || scriptureText) {
      return {
        answer: `**Scripture Focus for "${sessionData.title}":**

${scriptureRef ? `**Reference:** ${scriptureRef}` : ''}
${scriptureText ? `\n**Text:** "${scriptureText}"` : ''}

**Business Application:**
This Scripture provides the biblical foundation for the business principles in this session. God's Word gives us wisdom for:

• Making ethical decisions under pressure
• Treating employees and customers with respect
• Managing resources with integrity
• Building businesses that honor God

**Reflection:**
How does this Scripture passage speak to your current business situation? God's Word is practical guidance for every aspect of business leadership.`,
        source: 'fallback',
        scriptureReferences: scriptureRef ? [scriptureRef] : undefined,
        followUpQuestions: [
          'How does this Scripture apply to your business decisions?',
          'What does this passage teach you about God\'s view of business?'
        ]
      };
    }
    
    return {
      answer: `"${sessionData.title}" is grounded in biblical principles, even if specific Scripture references aren't detailed in the content structure I can access.

**Biblical Foundation for Business:**
• "Whatever you do, work at it with all your heart, as working for the Lord" (Colossians 3:23)
• "Better is a little with righteousness than great revenues with injustice" (Proverbs 16:8)
• "Commit to the LORD whatever you do, and he will establish your plans" (Proverbs 16:3)

These verses provide the foundation for God's guidelines in business management.`,
      source: 'fallback',
      scriptureReferences: ['Colossians 3:23', 'Proverbs 16:8', 'Proverbs 16:3']
    };
  }

  private getPrinciplesResponse(content: any, sessionTitle: string): CoachingResponse {
    const principles = content?.principles || content?.key_principles || content?.guidelines || content?.teachings;
    
    if (principles) {
      let principlesText = '';
      
      if (Array.isArray(principles)) {
        principlesText = principles.map((p, i) => `**${i + 1}. ${p}**`).join('\n\n');
      } else if (typeof principles === 'object') {
        principlesText = Object.entries(principles)
          .map(([key, value]) => `**${key}:** ${value}`)
          .join('\n\n');
      } else {
        principlesText = principles;
      }
      
      return {
        answer: `**Key Principles from "${sessionTitle}":**

${principlesText}

**Why These Principles Matter:**
• They're based on God's timeless wisdom for business and life
• Following them creates sustainable, ethical business practices
• They help you make decisions that honor God and serve others
• They provide guidance when facing difficult business situations

**Application:**
Choose one principle that addresses your current business challenge and commit to implementing it this week.`,
        source: 'fallback',
        followUpQuestions: [
          'Which principle addresses your biggest business challenge?',
          'How will you apply one of these principles starting today?'
        ]
      };
    }
    
    return this.getGeneralSessionResponse(content, sessionTitle);
  }

  private getGeneralSessionResponse(content: any, sessionTitle: string): CoachingResponse {
    return {
      answer: `**"${sessionTitle}" Session Overview:**

This session provides biblical guidelines for business management, focusing on how God's wisdom applies to practical business decisions.

**What You'll Learn:**
• Biblical foundations for business leadership
• Practical applications of faith in business
• How to make decisions that honor God
• Ways to serve customers and employees excellently

**Key Focus Areas:**
• Integrity in all business dealings
• Stewardship of resources and opportunities
• Building businesses that create positive impact
• Balancing profit with service to others

**Next Steps:**
As you work through this session, look for specific ways to apply these guidelines to your current business situation.

What specific aspect of business management would you like to explore using biblical principles?`,
      source: 'fallback',
      followUpQuestions: [
        'What business management challenge needs biblical guidance?',
        'Which area of your business most needs God\'s wisdom right now?'
      ]
    };
  }

  // Helper methods for content extraction
  private extractExamplesFromContent(content: string): string {
    // Simple extraction - look for sentences with "example", "story", or "business"
    const sentences = content.split('.').filter(s => 
      s.toLowerCase().includes('example') || 
      s.toLowerCase().includes('story') || 
      s.toLowerCase().includes('business')
    );
    
    return sentences.slice(0, 3).map(s => `• ${s.trim()}.`).join('\n\n');
  }

  private extractKeyPointsFromContent(content: string): string {
    // Simple extraction - look for bullet points or numbered items
    const lines = content.split('\n').filter(line => 
      line.trim().startsWith('•') || 
      line.trim().startsWith('-') ||
      line.match(/^\d+\./)
    );
    
    if (lines.length > 0) {
      return lines.slice(0, 5).join('\n');
    }
    
    // Fallback - extract first few sentences
    const sentences = content.split('.').slice(0, 3);
    return sentences.map(s => `• ${s.trim()}`).join('\n');
  }

  private createContentSummary(content: string): string {
    // Create a structured summary of the content
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 50);
    
    if (paragraphs.length > 0) {
      return paragraphs.slice(0, 2).map((p, i) => 
        `**Section ${i + 1}:** ${p.trim().substring(0, 200)}...`
      ).join('\n\n');
    }
    
    return content.substring(0, 300) + '...';
  }

  private isAboutCourse(question: string): boolean {
    const keywords = ['course', 'ibam', 'module', 'session', 'what is', 'purpose', 'goal', 'how many', 'ultimate goal', 'main goal'];
    return keywords.some(keyword => question.includes(keyword));
  }

  private getCourseResponse(question: string, sessionData?: SessionData): CoachingResponse {
    const knowledge = IBAM_COMPREHENSIVE_KNOWLEDGE;
    
    if (question.includes('what is') && question.includes('ibam')) {
      return {
        answer: `IBAM stands for ${knowledge.organization.name}. Our mission is "${knowledge.organization.mission}."

This course helps you:
${knowledge.courseOverview.primaryGoals.map(goal => `• ${goal}`).join('\n')}

We have ${knowledge.curriculum.totalModules} modules with ${knowledge.curriculum.totalSessions} total sessions, covering biblical foundations through practical business development and leadership.`,
        source: 'fallback',
        scriptureReferences: [knowledge.organization.foundationalBelief.scripture]
      };
    }

    if (question.includes('purpose') || question.includes('goal') || question.includes('ultimate')) {
      return {
        answer: `The **ultimate goal** of this IBAM course is to help you build a thriving business that honors God and serves others excellently.

**What you'll achieve**:
${knowledge.courseOverview.primaryGoals.map(goal => `• ${goal}`).join('\n')}

**Practical Skills You'll Master**:
• Market research and customer discovery
• Financial planning and budgeting
• Marketing and sales strategies
• Operations and systems development
• Leadership and team building

**Biblical Foundation You'll Build**:
• Understanding business as God's calling
• Integrating faith with daily business decisions
• Making ethical choices under pressure
• Using profit for Kingdom impact and generosity

**The Result**: A profitable, sustainable business that demonstrates God's character in the marketplace while serving customers excellently.

${knowledge.organization.foundationalBelief.principle}`,
        source: 'fallback',
        scriptureReferences: [knowledge.organization.foundationalBelief.scripture]
      };
    }

    return {
      answer: `This course consists of ${knowledge.curriculum.totalSessions} sessions across ${knowledge.curriculum.totalModules} modules. Each session follows our structure: Looking Back (review), Looking Up (biblical foundation), main content (practical learning), and Looking Forward (action planning).

${sessionData ? `You're currently in: "${sessionData.title}"` : 'Navigate through all modules from your dashboard.'}`,
      source: 'fallback'
    };
  }

  private isTheologicalQuestion(question: string): boolean {
    const keywords = ['god', 'jesus', 'bible', 'scripture', 'sin', 'salvation', 'prayer', 'faith', 'christian'];
    return keywords.some(keyword => question.includes(keyword));
  }

  private getTheologicalResponse(question: string): CoachingResponse {
    if ((question.includes('god') || question.includes('does god')) && question.includes('care') && question.includes('business')) {
      return {
        answer: `Yes, God absolutely cares about business! Here's why:

**1. Work is God's design**: God created work and called it good (Genesis 1:28). Business is a way to participate in His creative work.

**2. Stewardship matters**: Jesus taught extensively about managing resources wisely (Luke 19:12-27). Business is stewardship of the gifts and opportunities God gives us.

**3. Service to others**: Business at its best serves people's genuine needs, which reflects God's heart for His people (Mark 12:31).

**4. Kingdom advancement**: Ethical businesses can fund ministry, provide good jobs, and demonstrate God's character in the marketplace.

God cares about all aspects of our lives, including how we work and serve others through business.`,
        source: 'fallback',
        scriptureReferences: ['Genesis 1:28', 'Luke 19:12-27', 'Mark 12:31']
      };
    }

    // General theological guidance
    return {
      answer: `That's an important theological question. While I can help you understand how biblical principles apply to business situations, for deeper theological questions, I'd encourage you to discuss this with your local pastor or biblical counselor.

IBAM operates from an evangelical Christian foundation, believing Scripture is our ultimate authority and that following Jesus should shape every aspect of our lives, including business.

How does this question relate to your business situation? I'd love to help you think through the practical business applications of biblical truth.`,
      source: 'fallback',
      followUpQuestions: ['How does this relate to a specific business decision you\'re making?']
    };
  }

  private isBusinessEthicsQuestion(question: string): boolean {
    const keywords = ['bribe', 'bribed', 'corrupt', 'cheat', 'lie', 'steal', 'unethical', 'wrong', 'evil', 'rules', 'break', 'bad guys', 'pressure', 'extort', 'pay money', 'ethics'];
    return keywords.some(keyword => question.includes(keyword));
  }

  private getBusinessEthicsResponse(question: string): CoachingResponse {
    if (question.includes('bribe') || question.includes('bribed') || question.includes('corrupt') || question.includes('bad guys')) {
      return {
        answer: `Bribery and corruption are never acceptable in biblical business practice. Here's why and what to do instead:

**Biblical Standard**: "Better is a little with righteousness than great revenues with injustice" (Proverbs 16:8). God values integrity over profit.

**Practical Alternatives**:
• Build genuine value propositions that don't require bribes
• Develop relationships based on trust and excellent service
• Work in markets where merit, not corruption, drives success
• Partner with others who share your ethical standards

**Long-term perspective**: Businesses built on integrity may grow slower initially, but they create sustainable success and honor God.

If you're facing pressure to engage in corruption, this might be a sign to evaluate whether this is the right market or partnership for your calling.`,
        source: 'fallback',
        scriptureReferences: ['Proverbs 16:8', 'Proverbs 11:1']
      };
    }

    if (question.includes('evil') && question.includes('succeed')) {
      return {
        answer: `You're right that sometimes unethical people appear to succeed in business. The Bible acknowledges this reality:

**Biblical Perspective**: 
• "Do not fret because of evildoers" (Psalm 37:1)
• Their success is often temporary: "I have seen the wicked in great power... yet they passed away" (Psalm 37:35-36)

**Your Response as a Christian Entrepreneur**:
1. **Stay focused on your calling**: Build the business God has called you to build
2. **Compete on value**: Offer superior products/services, not unethical shortcuts  
3. **Long-term thinking**: Sustainable success comes through trust and integrity
4. **Different definitions of success**: Kingdom impact matters more than just profit

Remember: you're not just building a business, you're demonstrating God's character in the marketplace. That has eternal value beyond any short-term competitive advantage.`,
        source: 'fallback',
        scriptureReferences: ['Psalm 37:1', 'Psalm 37:35-36']
      };
    }

    if (question.includes('break') && question.includes('rules')) {
      return {
        answer: `Breaking God's rules has serious consequences, both spiritually and practically in business:

**Spiritual Consequences**:
• Sin separates us from God and requires repentance
• "The wages of sin is death, but the gift of God is eternal life" (Romans 6:23)

**Business Consequences**: 
• Loss of trust and reputation
• Legal and financial penalties
• Damage to relationships and partnerships
• Inner peace and clear conscience are compromised

**The Good News**: God offers forgiveness and restoration through Jesus Christ. In business, you can rebuild trust through consistent integrity and making things right where possible.

**Moving Forward**: Ask God for forgiveness, make amends where needed, and commit to biblical business practices going forward.`,
        source: 'fallback',
        scriptureReferences: ['Romans 6:23', '1 John 1:9']
      };
    }

    return {
      answer: `That's an important ethical question. Biblical business ethics are rooted in integrity, honesty, and service to others.

**Key Principles**:
• "Whatever you do, work at it with all your heart, as working for the Lord" (Colossians 3:23)
• Choose righteousness over profit when they conflict
• Consider long-term impact on relationships and reputation
• Ask: "Does this honor God and serve others well?"

What specific ethical situation are you facing? I'd be happy to help you think through biblical principles that apply.`,
      source: 'fallback',
      scriptureReferences: ['Colossians 3:23'],
      followUpQuestions: ['What specific situation prompted this question?']
    };
  }

  private isBusinessPlannerQuestion(question: string): boolean {
    const keywords = ['business plan', 'planner', 'export', 'save', 'download', 'planning tool'];
    return keywords.some(keyword => question.includes(keyword));
  }

  private getBusinessPlannerResponse(question: string): CoachingResponse {
    const knowledge = IBAM_COMPREHENSIVE_KNOWLEDGE;
    
    return {
      answer: `The IBAM Business Planner is ${knowledge.businessPlanner.purpose}.

**Sections Available**:
${knowledge.businessPlanner.sections.map(section => `• **${section.name}**: ${section.description}`).join('\n')}

**Features**:
${Object.entries(knowledge.businessPlanner.features).map(([_, value]) => `• ${value}`).join('\n')}

The planner integrates biblical principles throughout, helping you build a business that honors God while being practical and profitable.`,
      source: 'fallback',
      followUpQuestions: ['Which section would you like to work on first?']
    };
  }

  private isPracticalBusinessQuestion(question: string): boolean {
    const keywords = ['apply', 'how do i', 'how does', 'burger king', 'job', 'work', 'sales', 'marketing', 'budgeting', 'budget', 'finance', 'financial', 'operations', 'practical', 'business skills', 'learn about', 'will i learn', 'do i learn', 'how can you assist', 'help me', 'assist me'];
    return keywords.some(keyword => question.includes(keyword));
  }

  private getPracticalBusinessResponse(question: string): CoachingResponse {
    if (question.includes('sales') || question.includes('marketing') || question.includes('budget') || question.includes('will i learn') || question.includes('business skills') || question.includes('practical')) {
      return {
        answer: `Absolutely! IBAM teaches BOTH biblical principles AND practical business skills. You'll learn:

**📊 Financial Management**:
• Budgeting and financial planning with biblical stewardship
• Cost analysis and profit calculations
• Cash flow management
• Investment and growth strategies

**📈 Marketing & Sales**:
• Customer discovery and market research
• Value proposition development
• Ethical sales techniques that serve customers
• Marketing strategies based on serving others

**⚙️ Operations**:
• Systems and processes for excellent service
• Quality control and customer satisfaction
• Team building and leadership
• Scaling your business sustainably

**🎯 Strategic Planning**:
• Business model development
• Competitive analysis
• Goal setting and milestone tracking
• Risk management and problem-solving

The difference with IBAM is that every practical skill is grounded in biblical principles. You learn HOW to do business excellently AND WHY it honors God when done with integrity and service.

This isn't just theology - it's real business education with a biblical foundation!`,
        source: 'fallback',
        followUpQuestions: ['Which business skill area interests you most?', 'What specific business challenge are you facing?']
      };
    }

    if (question.includes('burger king') || question.includes('job')) {
      return {
        answer: `Great question! You can apply biblical business principles even in a job at Burger King:

**Customer Service Excellence**:
• Serve each customer as if serving Jesus (Colossians 3:23-24)
• Show genuine care and respect to everyone
• Go above and beyond what's expected

**Work Ethics**:
• Be reliable, honest, and diligent in all tasks
• Work with integrity even when no one is watching
• Use your time and the company's resources responsibly

**Leadership Opportunities**:
• Encourage and help coworkers
• Look for ways to improve processes or customer experience
• Train others with patience and kindness

**Kingdom Perspective**:
• See your job as ministry - your character reflects Christ
• Pray for customers and coworkers
• Use your paycheck for generous living and giving

Every job, no matter how simple it seems, can be a platform for demonstrating God's character and serving others excellently.`,
        source: 'fallback',
        scriptureReferences: ['Colossians 3:23-24'],
        followUpQuestions: ['What specific aspect of your work situation would you like to improve?']
      };
    }

    return {
      answer: `To apply biblical principles to your specific situation:

**1. Start with Scripture**: What biblical principles relate to your challenge?
**2. Seek God's guidance**: Pray for wisdom and direction
**3. Consider others**: How can you serve customers/colleagues better?
**4. Act with integrity**: Choose the right thing even when it's difficult
**5. Trust God's timing**: Be faithful in small things, trust Him with outcomes

What specific business challenge are you facing? I'd love to help you think through how to apply biblical wisdom to your unique situation.`,
      source: 'fallback',
      followUpQuestions: ['What specific challenge are you working through right now?']
    };
  }

  private getDefaultResponse(originalQuestion: string): CoachingResponse {
    return {
      answer: `I understand you're asking about "${originalQuestion}". Let me help you think through this from a biblical business perspective.

**Biblical Foundation**: Whatever you do, work at it with all your heart, as working for the Lord (Colossians 3:23).

**IBAM's Approach**: 
• See business as a way to serve others and honor God
• Use biblical principles to guide decisions
• Build relationships based on trust and integrity
• Create value that genuinely helps people

**Next Steps**: Could you share more details about your specific situation? This would help me give you more targeted biblical and practical guidance.

I'm here to help you integrate faith with business in practical, meaningful ways.`,
      source: 'fallback',
      scriptureReferences: ['Colossians 3:23'],
      followUpQuestions: [
        'What specific challenge are you facing?',
        'How does this relate to your business goals?',
        'What biblical principles do you think might apply?'
      ]
    };
  }

  // NEW: Direct identity response
  private getIdentityResponse(): CoachingResponse {
    return {
      answer: `I'm your **IBAM AI Coach**! 

I'm here to help you:
• Apply biblical principles to real business situations
• Discuss session content and answer questions about what you're learning
• Think through practical applications of IBAM's faith-based business approach
• Navigate challenges where faith and business intersect

I can access your current session content to give you specific guidance based on what you're studying. I'm designed to be direct, practical, and biblically grounded - not just give generic responses.

What would you like to explore about today's session or your business situation?`,
      source: 'fallback',
      followUpQuestions: [
        'What specific business challenge can I help you with?',
        'What questions do you have about today\'s session content?',
        'How can I help you apply what you\'re learning?'
      ]
    };
  }

  // NEW: Content gap analysis
  private getContentGapResponse(question: string, sessionData?: SessionData): CoachingResponse {
    const sessionTitle = sessionData?.title || 'this session';
    
    return {
      answer: `**Content Gap Analysis for "${sessionTitle}":**

Here are some important business management issues that aren't directly addressed in this session:

**Operational Gaps:**
• Employee conflict resolution and discipline procedures
• Technology integration and digital transformation strategies
• Crisis management and business continuity planning
• Supply chain management and vendor relationships

**Growth & Scaling Challenges:**
• Managing rapid growth while maintaining biblical principles
• Hiring and training processes that reflect Christian values
• Competitive pricing in markets where others use unethical practices
• International business and cross-cultural considerations

**Difficult Situations:**
• Handling difficult customers while maintaining Christian witness
• Dealing with employees who don't share your faith
• Balancing profit margins with fair wages and pricing
• Managing business during personal or family crises

**Strategic Issues:**
• Partnership agreements and joint ventures
• Exit strategies and business succession planning
• Insurance and legal protection strategies

Which of these areas would be most helpful for your current business situation?`,
      source: 'fallback',
      followUpQuestions: [
        'Which of these gaps affects your business most?',
        'What specific operational challenge are you facing?',
        'How can biblical principles guide you in these areas?'
      ]
    };
  }

  // NEW: Direct wealth/prosperity guidance
  private getWealthProsperityResponse(question: string): CoachingResponse {
    if (question.includes('god serve me') || question.includes('hoping that god will serve me') || question.includes('will this work')) {
      return {
        answer: `**That's actually a dangerous approach that Scripture warns against.**

Jesus said "No one can serve two masters" (Matthew 6:24). You've identified the core problem - wanting God to serve your wealth goals instead of you serving God.

**Biblical Reality:**
• **God isn't a cosmic ATM** - He's Lord, not servant
• **Prosperity isn't guaranteed** for obedience - many faithful believers struggle financially
• **Wrong motives corrupt everything** - if wealth is your primary goal, you'll compromise principles when they conflict with profit

**The Trap:**
When your heart seeks wealth first, you'll:
• Cut corners when integrity costs money
• Exploit employees to increase margins
• Deceive customers to close sales
• Abandon biblical principles under financial pressure

**God's Way:**
"But seek first his kingdom and his righteousness, and all these things will be given to you as well" (Matthew 6:33)

**Better Approach:**
• Serve God faithfully in business
• Follow biblical principles regardless of cost
• Trust God with the results
• Find contentment in His provision

Following biblical principles often leads to sustainable success, but that should be the byproduct, not the goal.

What's driving your desire for wealth? What fears or needs are underneath that?`,
        source: 'fallback',
        scriptureReferences: ['Matthew 6:24', 'Matthew 6:33', '1 Timothy 6:10'],
        followUpQuestions: [
          'What\'s really driving your desire for wealth?',
          'What would change if you truly put God first in your business?',
          'What biblical principles challenge your current approach?'
        ]
      };
    }
    
    // General wealth/prosperity question
    return {
      answer: `**Biblical Perspective on Wealth and Business Success:**

**The Truth About Prosperity:**
• **Not guaranteed** - Godly people aren't promised wealth (Job, many NT believers lived modestly)
• **Can be a blessing** - Abraham, Solomon, and others were blessed with wealth to serve God's purposes
• **Always comes with responsibility** - "From everyone who has been given much, much will be demanded" (Luke 12:48)

**Why Biblical Principles Often Lead to Success:**
• **Integrity builds trust** - customers return to honest businesses
• **Fair treatment creates loyalty** - employees work harder for respectful employers
• **Wise stewardship** improves financial management
• **Long-term thinking** builds sustainable businesses

**The Danger:**
If wealth becomes your primary motivation, you'll compromise these very principles when they cost money.

**God's Priority:**
"But seek first his kingdom and his righteousness, and all these things will be given to you as well" (Matthew 6:33)

**Better Questions:**
• How can my business serve others excellently?
• What would faithful stewardship look like in my situation?
• How can I honor God regardless of financial outcomes?

What specific business decisions are you facing where you're tempted to prioritize profit over principles?`,
      source: 'fallback',
      scriptureReferences: ['Matthew 6:33', 'Luke 12:48', '1 Timothy 6:9-10'],
      followUpQuestions: [
        'What business decisions are you facing where profit conflicts with principles?',
        'How would your approach change if service became your primary goal?',
        'What does faithful stewardship look like in your business?'
      ]
    };
  }
}

// Export singleton instance
export const simpleAICoaching = new SimpleAICoaching();
export default simpleAICoaching;