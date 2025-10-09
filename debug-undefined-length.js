// Debug script to find potential undefined length issues
const fs = require('fs');
const path = require('path');

// Files that are most likely to have the issue based on our search
const suspiciousFiles = [
  'app/admin/dashboard/page.tsx',
  'app/admin/blog-posts/[id]/edit/page.tsx',
  'app/admin/contacts/page.tsx',
  'app/blog/[slug]/page.tsx',
  'app/campaigns/[slug]/page.tsx'
];

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    console.log(`\n=== Analyzing ${filePath} ===`);
    
    // Look for .length usage
    lines.forEach((line, index) => {
      if (line.includes('.length')) {
        const lineNum = index + 1;
        const trimmedLine = line.trim();
        
        // Check if it's properly guarded
        const hasGuard = line.includes('&&') || line.includes('?.') || line.includes('||');
        
        console.log(`Line ${lineNum}: ${trimmedLine}`);
        if (!hasGuard) {
          console.log(`  ⚠️  POTENTIAL ISSUE: No null/undefined guard detected`);
        }
      }
    });
    
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
  }
}

// Analyze each suspicious file
suspiciousFiles.forEach(analyzeFile);

console.log('\n=== Analysis Complete ===');
console.log('Look for lines marked with ⚠️ - these are potential sources of the undefined length error.');