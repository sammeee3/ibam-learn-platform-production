// app/lib/utils.ts

// Utility function for calculating reading time
export const calculateReadingTime = (content: string): string => {
  if (!content) return '3 min';
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutes = Math.max(2, Math.ceil(wordCount / 200)); // 200 words per minute
  return `${minutes} min`;
};

// Content formatting function with beautiful typography
export const formatContentWithBeautifulTypography = (content: string) => {
  if (!content) return "Content is being prepared for this section.";

  return content
    // Convert Markdown to HTML first - IMPROVED PATTERNS
    .replace(/###\s*(.+?)(\n|$)/g, "<h3>$1</h3>")
    .replace(/##\s*(.+?)(\n|$)/g, "<h2>$1</h2>") 
    .replace(/#\s*(.+?)(\n|$)/g, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*\n]+?)\*/g, "<em>$1</em>")
    .replace(/\n\s*\n/g, "</p><p>")
    .replace(/^(?!<[h|p|u|o|l|s])/gm, "<p>")
    .replace(/(?<![>])\n(?!<)/g, " ")
    // Format headings with gorgeous blue styling - FULL RESTORATION
    .replace(/<h1[^>]*>/g, '<h1 class="text-4xl font-bold text-blue-800 mb-6 mt-8 leading-tight">')
    .replace(/<h2[^>]*>/g, '<h2 class="text-3xl font-bold text-blue-800 mb-4 mt-6 leading-tight">')
    .replace(/<h3[^>]*>/g, '<h3 class="text-2xl font-semibold text-blue-700 mb-3 mt-5 leading-tight">')
    .replace(/<h4[^>]*>/g, '<h4 class="text-xl font-semibold text-blue-600 mb-2 mt-4">')
    .replace(/<h5[^>]*>/g, '<h5 class="text-lg font-semibold text-blue-600 mb-2 mt-3">')
    .replace(/<h6[^>]*>/g, '<h6 class="text-base font-semibold text-blue-600 mb-2 mt-3">')
    // Format paragraphs with excellent reading font - RESTORED
    .replace(/<p[^>]*>/g, '<p class="text-gray-800 leading-relaxed mb-6 text-lg">')
    // Format lists beautifully - RESTORED  
    .replace(/<ul[^>]*>/g, '<ul class="space-y-3 mb-6 ml-6">')
    .replace(/<ol[^>]*>/g, '<ol class="space-y-3 mb-6 ml-6 list-decimal">')
    .replace(/<li[^>]*>/g, '<li class="text-gray-800 leading-relaxed text-lg mb-2">')
    // Format emphasis beautifully - RESTORED
    .replace(/<strong[^>]*>/g, '<strong class="font-bold text-gray-900">')
    .replace(/<em[^>]*>/g, '<em class="italic text-gray-700">');
};

// Parse main content into readable chunks
export const parseMainContentIntoChunks = (mainContent: string) => {
  if (!mainContent) return [];
  
  const sectionRegex = /##\s*🔥\s*READING BLOCK[^:]*:\s*([^(]+)\s*\(([^)]+)\)/gi;
  const sections = mainContent.split(sectionRegex);
  const chunks: any[] = [];
  
  if (sections.length < 3) {
    return [{
      id: 'main_1',
      title: 'Session Reading Content',
      content: mainContent,
      key_thought: extractKeyPoints(mainContent)[0] || 'This section contains important principles for faith-driven entrepreneurship.',
      summary: 'Core session content for faith-driven business principles.',
      task_questions: ['What is the main insight you gained from this reading?', 'How can you apply this principle in your business this week?'],
      time: calculateReadingTime(mainContent),
      order: 1
    }];
  }
  
  for (let i = 1; i < sections.length; i += 3) {
    const title = sections[i]?.trim() || `Reading Section ${Math.ceil(i/3)}`;
    const timeString = sections[i + 1]?.trim() || '5 min';
    const content = sections[i + 2]?.trim() || '';
    
    if (content) {
      chunks.push({
        id: `main_${Math.ceil(i/3)}`,
        title: title,
        content: content,
        key_thought: extractKeyPoints(content)[0] || 'Important principles for faith-driven entrepreneurship.',
        summary: `Key insights from: ${title}`,
        task_questions: [
          `What stood out to you most in "${title}"?`,
          'How does this principle apply to your current business situation?'
        ],
        time: timeString,
        order: Math.ceil(i/3)
      });
    }
  }
  
  return chunks.length > 0 ? chunks : [{
    id: 'main_1',
    title: 'Session Reading Content',
    content: mainContent,
    key_thought: extractKeyPoints(mainContent)[0] || 'This section contains important principles for faith-driven entrepreneurship.',
    summary: 'Core session content for faith-driven business principles.',
    task_questions: ['What is the main insight you gained from this reading?', 'How can you apply this principle in your business this week?'],
    time: calculateReadingTime(mainContent),
    order: 1
  }];
};

// Extract key points from content
export const extractKeyPoints = (content: string): string[] => {
  if (!content) return [];
  
  // Extract sentences that might be key points
  const sentences = content.replace(/<[^>]*>/g, '').split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  // Look for sentences with strong indicators of importance
  const keyIndicators = ['important', 'key', 'critical', 'remember', 'note that', 'essential', 'must', 'should', 'biblical', 'God', 'scripture'];
  
  const potentialKeyPoints = sentences.filter(sentence => 
    keyIndicators.some(indicator => sentence.toLowerCase().includes(indicator))
  ).slice(0, 3);

  // If no key indicators found, take first few sentences that are substantial
  if (potentialKeyPoints.length === 0) {
    return sentences.slice(0, 3).map(s => s.trim());
  }
  
  return potentialKeyPoints.map(s => s.trim());
};