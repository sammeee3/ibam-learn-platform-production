#!/usr/bin/env python3
"""
IBAM Session Template - Text Formatting Enhancement Script
Safe, automatic replacement of the Written Curriculum Content section
"""

import os
import re
import shutil
from datetime import datetime

def main():
    print("🚀 IBAM Session Template - Text Formatting Enhancement")
    print("=" * 60)
    
    # Step 1: Find the session template file
    template_path = "app/modules/[moduleId]/sessions/[sessionId]/page.tsx"
    
    if not os.path.exists(template_path):
        print(f"❌ Could not find {template_path}")
        print("Please run this script from your project root directory")
        return False
    
    print(f"✅ Found session template: {template_path}")
    
    # Step 2: Create backup
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_path = f"{template_path}.backup.{timestamp}"
    
    try:
        shutil.copy2(template_path, backup_path)
        print(f"💾 Backup created: {backup_path}")
    except Exception as e:
        print(f"❌ Could not create backup: {e}")
        return False
    
    # Step 3: Read the original file
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            original_content = f.read()
    except Exception as e:
        print(f"❌ Could not read original file: {e}")
        return False
    
    # Step 4: Define the new enhanced section
    enhanced_section = '''                {/* Written Curriculum Content - ENHANCED FORMATTING */}
                <div className="mb-8">
                  <h4 className="font-bold text-green-800 mb-3 flex items-center">
                    <Book className="w-5 h-5 mr-2" />
                    📝 Core Teaching Content ({readingMode === 'quick' ? '10' : '25'}-minute read)
                  </h4>
                  <div className="bg-white p-8 rounded-lg border-l-4 border-green-400 shadow-sm">
                    {/* Enhanced Content Container with Perfect Typography */}
                    <div className="max-w-none">
                      <div 
                        className="enhanced-content-formatting"
                        style={{
                          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                          lineHeight: '1.7',
                          color: '#111827'
                        }}
                        dangerouslySetInnerHTML={{ 
                          __html: (readingMode === 'quick' 
                            ? sessionData?.fast_track_summary || "Quick content loading..." 
                            : sessionData?.content?.written_curriculum?.main_content || "Content loading..."
                          )
                          // Enhanced formatting with beautiful typography
                          .replace(/\\n\\n/g, '</p><p style="margin-bottom: 1.5rem; color: #111827; line-height: 1.75; font-size: 1.1rem;">')
                          
                          // Main Headings (H1) - Large Blue Headers
                          .replace(/^# (.*)$/gm, '<h1 style="color: #2563EB; font-weight: 700; margin-top: 2rem; margin-bottom: 1.5rem; line-height: 1.2; font-size: 2rem;">$1</h1>')
                          
                          // Subheadings (H2) - Medium Blue Headers  
                          .replace(/^## (.*)$/gm, '<h2 style="color: #1D4ED8; font-weight: 700; margin-top: 1.5rem; margin-bottom: 1rem; line-height: 1.3; font-size: 1.5rem;">$2</h2>')
                          
                          // Sub-subheadings (H3) - Smaller Blue Headers
                          .replace(/^### (.*)$/gm, '<h3 style="color: #1E40AF; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.75rem; line-height: 1.4; font-size: 1.25rem;">$3</h3>')
                          
                          // H4 Headers - Small Blue Headers
                          .replace(/^#### (.*)$/gm, '<h4 style="color: #1E40AF; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; font-size: 1.1rem;">$4</h4>')
                          
                          // Bold text - Strong emphasis in black
                          .replace(/\\*\\*(.*?)\\*\\*/g, '<strong style="font-weight: 700; color: #000000;">$1</strong>')
                          
                          // Italic text - Elegant emphasis
                          .replace(/\\*(.*?)\\*/g, '<em style="font-style: italic; color: #374151;">$1</em>')
                          
                          // Bullet points - Enhanced list formatting
                          .replace(/^- (.*)$/gm, '<li style="margin-bottom: 0.5rem; color: #111827; line-height: 1.75;">• $1</li>')
                          .replace(/(<li.*?>.*?<\\/li>)/gs, '<ul style="margin-left: 1rem; margin-bottom: 1.5rem; list-style: none;">$1</ul>')
                          
                          // Quote blocks - Beautiful quote styling
                          .replace(/^> (.*)$/gm, '<blockquote style="border-left: 4px solid #3B82F6; padding: 1rem 1.5rem; margin: 1.5rem 0; background-color: #EFF6FF; font-style: italic; color: #374151; border-radius: 0.5rem; font-size: 1.1rem;">$1</blockquote>')
                          
                          // Ensure first content is wrapped as paragraph
                          .replace(/^(?!<[h|u|b|l])(.*?)$/m, '<p style="margin-bottom: 1.5rem; color: #111827; line-height: 1.75; font-size: 1.1rem;">$1</p>')
                        }} 
                      />
                    </div>
                  </div>
                </div>'''
    
    # Step 5: Find and replace the Written Curriculum Content section
    patterns = [
        r'{/\* Written Curriculum Content.*?\*/}.*?<div className="mb-8">.*?dangerouslySetInnerHTML=\{.*?\}\s*/>\s*</div>\s*</div>',
        r'<div className="mb-8">\s*<h4 className="font-bold text-green-800 mb-3 flex items-center">\s*<Book className="w-5 h-5 mr-2" />\s*📝 Core Teaching Content.*?</div>\s*</div>',
    ]
    
    replacement_made = False
    new_content = original_content
    
    for i, pattern in enumerate(patterns):
        matches = re.findall(pattern, original_content, re.DOTALL)
        if matches:
            print(f"✅ Found curriculum section using pattern {i+1}")
            new_content = re.sub(pattern, enhanced_section, original_content, flags=re.DOTALL)
            if new_content != original_content:
                replacement_made = True
                break
    
    if not replacement_made:
        print("⚠️  Trying manual pattern matching...")
        # Look for the specific section more broadly
        start_marker = "📝 Core Teaching Content"
        if start_marker in original_content:
            print("✅ Found content marker, attempting replacement...")
            # Find the div that contains this text and replace it
            pattern = r'<div className="mb-8">\s*<h4[^>]*>.*?📝 Core Teaching Content.*?</div>\s*</div>'
            new_content = re.sub(pattern, enhanced_section, original_content, flags=re.DOTALL)
            if new_content != original_content:
                replacement_made = True
    
    if not replacement_made:
        print("❌ Could not automatically locate the section")
        print("Saving enhanced section for manual replacement...")
        with open("enhanced_section.txt", "w", encoding="utf-8") as f:
            f.write(enhanced_section)
        print("📄 Enhanced section saved to: enhanced_section.txt")
        return False
    
    # Step 6: Write the updated content
    try:
        with open(template_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("✅ Successfully updated the session template!")
    except Exception as e:
        print(f"❌ Could not write updated file: {e}")
        shutil.copy2(backup_path, template_path)
        print("🔄 Restored from backup")
        return False
    
    print(f"\n🎉 Text formatting enhancement completed!")
    print(f"📁 Backup: {backup_path}")
    print(f"🚀 Test with: npm run dev")
    
    return True

if __name__ == "__main__":
    main()
