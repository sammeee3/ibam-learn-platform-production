const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing SessionTemplate errors...\n');

const sessionPath = path.join(__dirname, 'app/modules/[moduleId]/sessions/[sessionId]/page.tsx');

if (!fs.existsSync(sessionPath)) {
  console.error('❌ Cannot find session file');
  process.exit(1);
}

let content = fs.readFileSync(sessionPath, 'utf8');

// Fix the updateProgress calls - the script added them wrong
// Find and fix the broken lines around 3713, 3743, 3771
content = content.replace(
  /setExpandedSection\(expandedSection === 'lookback' \? null : 'lookback'\);\s*updateProgress\('lookback'\)/g,
  `setExpandedSection(expandedSection === 'lookback' ? null : 'lookback')`
);

content = content.replace(
  /setExpandedSection\(expandedSection === 'lookup' \? null : 'lookup'\);\s*updateProgress\('lookup'\)/g,
  `setExpandedSection(expandedSection === 'lookup' ? null : 'lookup')`
);

content = content.replace(
  /setExpandedSection\(expandedSection === 'lookforward' \? null : 'lookforward'\);\s*updateProgress\('lookforward'\)/g,
  `setExpandedSection(expandedSection === 'lookforward' ? null : 'lookforward')`
);

// Remove any duplicate or broken div tags
content = content.replace(/\s*<\/div>\s*div>\s*/g, '</div>\n');
content = content.replace(/\s*<\/div>\s*div\s+className=/g, '</div>\n<div className=');

fs.writeFileSync(sessionPath, content);
console.log('✅ Fixed syntax errors!');