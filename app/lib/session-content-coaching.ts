/**
 * SESSION CONTENT-AWARE COACHING SYSTEM
 * Integrates actual session content with AI coaching responses
 * Provides contextual guidance based on current reading, video, and assessment content
 */

import { IBAM_COACHING_KNOWLEDGE } from './coaching-knowledge-base';

export interface SessionContentContext {
  moduleId: number;
  sessionId: number;
  sessionTitle: string;
  currentContent: {
    reading?: string;
    video?: {
      title: string;
      description?: string;
    };
    scripture?: {
      reference: string;
      text: string;
    };
    keyPrinciples?: string[];
    objectives?: string[];
  };
  userProgress: {
    completedSections: Record<string, boolean>;
    quizScores?: Record<string, number>;
    timeSpent?: number;
  };
}

export interface ContentAwareResponse {
  type: 'content-connection' | 'application-guide' | 'principle-clarification' | 'progress-encouragement';
  message: string;
  contentReferences?: string[];
  applicationExercise?: string;
  reflectionQuestions?: string[];
}

// Extract key themes and principles from session content
export function extractSessionThemes(content: any): string[] {
  const themes: string[] = [];
  
  // Extract from title
  if (content.title) {
    const title = content.title.toLowerCase();
    if (title.includes('gift') || title.includes('good')) themes.push('divine_purpose');
    if (title.includes('why') || title.includes('purpose')) themes.push('calling_discovery');
    if (title.includes('customer') || title.includes('market')) themes.push('service_focus');
    if (title.includes('money') || title.includes('profit')) themes.push('biblical_prosperity');
    if (title.includes('fear') || title.includes('courage')) themes.push('faith_over_fear');
  }
  
  // Extract from main content
  if (content.written_curriculum?.main_content) {
    const mainContent = content.written_curriculum.main_content.toLowerCase();
    if (mainContent.includes('steward') || mainContent.includes('faithful')) themes.push('stewardship');
    if (mainContent.includes('serve') || mainContent.includes('others')) themes.push('service_orientation');
    if (mainContent.includes('kingdom') || mainContent.includes('ministry')) themes.push('kingdom_impact');
    if (mainContent.includes('integrity') || mainContent.includes('honesty')) themes.push('integrity');
  }
  
  // Extract from scripture
  if (content.scripture?.reference) {
    const ref = content.scripture.reference.toLowerCase();
    if (ref.includes('matthew 25') || ref.includes('talents')) themes.push('stewardship');
    if (ref.includes('proverbs')) themes.push('wisdom_application');
    if (ref.includes('ecclesiastes')) themes.push('purpose_meaning');
  }
  
  return [...new Set(themes)]; // Remove duplicates
}

// Generate content-aware coaching based on session progress
export function generateContentAwareCoaching(
  context: SessionContentContext,
  userQuestion?: string
): ContentAwareResponse[] {
  const responses: ContentAwareResponse[] = [];
  const themes = extractSessionThemes(context.currentContent);
  
  // Add content connection response
  responses.push(generateContentConnection(context, themes));
  
  // Add application guidance if user is progressing
  if (Object.values(context.userProgress.completedSections).some(completed => completed)) {
    responses.push(generateApplicationGuidance(context, themes));
  }
  
  // Add targeted response to user question if provided
  if (userQuestion) {
    responses.push(generateQuestionResponse(userQuestion, context, themes));
  }
  
  return responses;
}

function generateContentConnection(context: SessionContentContext, themes: string[]): ContentAwareResponse {
  const { sessionTitle, currentContent } = context;
  
  // Theme-specific content connections
  if (themes.includes('divine_purpose')) {
    return {
      type: 'content-connection',
      message: `**"${sessionTitle}" and Your Business Journey**\n\nToday's session teaches that business isn't just about profit - it's about stewarding the gifts God has given you to serve others. This transforms how you think about:\n\n• **Motivation**: You're serving God through serving customers\n• **Success Metrics**: Impact matters as much as income\n• **Decision Making**: Ask "How does this serve others?" first\n\nFrom today's content: ${currentContent.keyPrinciples?.[0] || 'Business can be a form of ministry when done with the right heart.'}`,
      contentReferences: [sessionTitle],
      reflectionQuestions: [
        "How has today's content changed your view of business?",
        "What specific gift or talent could you use to serve others?",
        "How might God want to use your business for His purposes?"
      ]
    };
  }
  
  if (themes.includes('calling_discovery')) {
    return {
      type: 'content-connection',
      message: `**Discovering Your "Why" Through Today's Lesson**\n\nThe content you just studied emphasizes that your business should flow from your calling, not just market opportunities. Key insights from "${sessionTitle}":\n\n• Your calling is unique - don't copy others\n• Purpose-driven businesses have staying power\n• When your "why" is clear, the "how" becomes clearer\n\n${currentContent.scripture ? `Biblical Foundation: ${currentContent.scripture.reference} reminds us that God has specific plans for each of us.` : ''}`,
      contentReferences: currentContent.scripture ? [currentContent.scripture.reference] : [sessionTitle],
      applicationExercise: "Complete this sentence: 'God has uniquely equipped me to serve _____ by solving _____ through my business.'"
    };
  }
  
  if (themes.includes('service_focus')) {
    return {
      type: 'content-connection', 
      message: `**Customer Service as Ministry (From Today's Session)**\n\nToday's lesson on "${sessionTitle}" reveals a powerful truth: When you genuinely serve customers, you're practicing biblical love of neighbor. This changes everything:\n\n• **Research becomes caring** - You study customer needs because you care about their success\n• **Quality becomes worship** - Excellence honors both God and customers\n• **Problems become opportunities** - To serve even better\n\nThe content emphasizes: ${currentContent.keyPrinciples?.[1] || 'True customer focus means serving their real needs, not just making sales.'}`,
      reflectionQuestions: [
        "Who are you specifically called to serve through business?",
        "What problems do they face that keep them up at night?",
        "How can excellent service become an act of worship?"
      ]
    };
  }
  
  // Default content connection
  return {
    type: 'content-connection',
    message: `**Key Insights from "${sessionTitle}"**\n\nThis session connects to your business development in important ways:\n\n${currentContent.objectives ? 
      currentContent.objectives.map((obj, i) => `${i + 1}. ${obj}`).join('\n') : 
      '• Biblical principles guide business decisions\n• Excellence honors God and serves others\n• Your business can create kingdom impact'
    }\n\nRemember: Every principle you learn here can be applied to real business situations.`,
    contentReferences: [sessionTitle],
    reflectionQuestions: [
      "Which principle from today resonates most with your business situation?",
      "How could you apply this lesson this week?",
      "What would change if you fully embraced this teaching?"
    ]
  };
}

function generateApplicationGuidance(context: SessionContentContext, themes: string[]): ContentAwareResponse {
  const { sessionTitle, userProgress } = context;
  const completedCount = Object.values(userProgress.completedSections).filter(Boolean).length;
  
  if (completedCount === 1) {
    return {
      type: 'application-guide',
      message: `**Great Start! Now Let's Apply "${sessionTitle}"**\n\nYou've begun engaging with today's content. Here's how to take it deeper:\n\n**This Week's Application:**\nTake one principle from today's session and apply it to a real business decision you're facing.\n\n**Reflection Exercise:**\nWrite down one specific way you could serve others better through business, inspired by today's lesson.`,
      applicationExercise: `Based on "${sessionTitle}", identify one person you could serve and one specific problem you could solve for them.`,
      reflectionQuestions: [
        "What business decision are you currently facing?",
        "How does today's principle guide that decision?",
        "What would faithful stewardship look like in this situation?"
      ]
    };
  }
  
  return {
    type: 'application-guide',
    message: `**Excellent Progress! Integrating "${sessionTitle}"**\n\nYou're actively engaging with the material. Now let's connect this to your business development:\n\n**Integration Challenge:**\nHow does today's session change or confirm your business direction?\n\n**Action Step:**\nChoose one insight from today and turn it into a specific action you'll take this week.`,
    reflectionQuestions: [
      "What's the most important insight from today's session?",
      "How does this connect to previous sessions you've completed?",
      "What pattern is emerging in your business calling?"
    ]
  };
}

function generateQuestionResponse(question: string, context: SessionContentContext, themes: string[]): ContentAwareResponse {
  const lowerQuestion = question.toLowerCase();
  const { sessionTitle, currentContent } = context;
  
  // Connect question to current session content
  if (lowerQuestion.includes('how') && (lowerQuestion.includes('apply') || lowerQuestion.includes('use'))) {
    return {
      type: 'principle-clarification',
      message: `**Applying "${sessionTitle}" to Your Question**\n\nGreat question about application! From today's session, here's the practical approach:\n\n**Biblical Framework:**\n${currentContent.scripture ? 
        `${currentContent.scripture.reference} provides the foundation: "${currentContent.scripture.text?.substring(0, 100) || 'God\'s principles guide our business decisions'}..."`
        : 'Biblical business principles from today\'s content provide the framework.'
      }\n\n**Practical Steps:**\n1. Start with the heart - ensure your motivation serves others\n2. Apply the principle in a small, testable way\n3. Evaluate the results through both business and biblical lenses\n\nFrom today's content: ${currentContent.keyPrinciples?.[0] || 'Faithful stewardship means applying biblical wisdom to practical situations.'}`,
      contentReferences: currentContent.scripture ? [currentContent.scripture.reference] : [sessionTitle]
    };
  }
  
  if (lowerQuestion.includes('biblical') || lowerQuestion.includes('scripture') || lowerQuestion.includes('god')) {
    return {
      type: 'principle-clarification',
      message: `**Biblical Foundation from "${sessionTitle}"**\n\n${currentContent.scripture ? 
        `Today's key scripture (${currentContent.scripture.reference}) directly addresses your question. The principle teaches us that biblical business operates on:\n\n• **Integrity** - Honesty in all dealings\n• **Service** - Others-focused motivation\n• **Stewardship** - Faithful management of resources\n• **Excellence** - Quality that honors God` :
        `Today's session establishes biblical principles for business:\n\n• Business can be a calling, not just a job\n• Serving others well honors God\n• Integrity and excellence are non-negotiable\n• Success includes both profit and Kingdom impact`
      }\n\n**Your Application:** How does this biblical framework guide your specific situation?`,
      contentReferences: currentContent.scripture ? [currentContent.scripture.reference] : [sessionTitle],
      reflectionQuestions: [
        "How does Scripture guide this decision?",
        "What would integrity look like in this situation?",
        "How can you serve others excellently here?"
      ]
    };
  }
  
  // Default question response connecting to current content
  return {
    type: 'principle-clarification',
    message: `**Great Question! Let's Connect It to "${sessionTitle}"**\n\nYour question relates directly to what you're studying today. From the current session:\n\n${currentContent.keyPrinciples?.length ? 
      currentContent.keyPrinciples.map((principle, i) => `**${i + 1}.** ${principle}`).join('\n\n') :
      'The key principle is applying biblical wisdom to practical business challenges.'
    }\n\n**Reflection:** How does today's content help you think about your question differently?`,
    contentReferences: [sessionTitle],
    reflectionQuestions: [
      "What new perspective does today's session offer?",
      "How do the biblical principles apply here?",
      "What would faithful stewardship look like?"
    ]
  };
}

// Enhanced session coaching integration
export function enhanceSessionCoaching(
  originalResponse: string,
  sessionContext: SessionContentContext
): string {
  const themes = extractSessionThemes(sessionContext.currentContent);
  const { sessionTitle } = sessionContext;
  
  // Add session-specific context to generic responses
  if (originalResponse.includes('biblical business principles') && !originalResponse.includes(sessionTitle)) {
    return `${originalResponse}\n\n**From Today's Session (${sessionTitle}):** ${
      sessionContext.currentContent.keyPrinciples?.[0] || 
      'Remember that business excellence can be a form of worship when done with the right heart.'
    }`;
  }
  
  // Enhance generic responses with specific content connections
  if (originalResponse.includes('discovery questions') && themes.includes('calling_discovery')) {
    return `${originalResponse}\n\n**Connecting to Your Current Study:** Today's lesson on "${sessionTitle}" emphasizes that your calling should drive your business decisions. As you think about these questions, consider how God has uniquely equipped you to serve others.`;
  }
  
  return originalResponse;
}

// Quick content-aware coaching for floating coach button
export function getQuickContentCoaching(sessionContext: SessionContentContext): string {
  const { sessionTitle, currentContent } = sessionContext;
  const themes = extractSessionThemes(currentContent);
  
  if (themes.includes('divine_purpose')) {
    return `From "${sessionTitle}": Your business can be a gift to others when it serves their real needs. What problem is God calling you to solve?`;
  }
  
  if (themes.includes('calling_discovery')) {
    return `Today's focus on "${sessionTitle}" reminds us: Your "why" shapes everything else. What unique calling is God stirring in your heart?`;
  }
  
  if (themes.includes('service_focus')) {
    return `"${sessionTitle}" teaches that excellent customer service is love of neighbor in action. Who are you called to serve?`;
  }
  
  return `From today's session on "${sessionTitle}": How can you apply these biblical business principles to your current situation?`;
}

export default {
  extractSessionThemes,
  generateContentAwareCoaching,
  enhanceSessionCoaching,
  getQuickContentCoaching
};