const fs = require('fs');
const path = require('path');

// Function to recursively find all .tsx and .ts files
function findFiles(dir, extensions = ['.tsx', '.ts']) {
  let results = [];
  
  try {
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat && stat.isDirectory()) {
        // Skip node_modules and .next directories
        if (!file.startsWith('.') && file !== 'node_modules') {
          results = results.concat(findFiles(filePath, extensions));
        }
      } else {
        const ext = path.extname(file);
        if (extensions.includes(ext)) {
          results.push(filePath);
        }
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err.message);
  }
  
  return results;
}

// Function to check for unsafe .length usage
function checkFileForLengthIssues(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    const issues = [];
    
    lines.forEach((line, index) => {
      const lineNum = index + 1;
      
      // Look for .length usage patterns that might be unsafe
      const lengthPatterns = [
        /\w+\.length/g,  // variable.length
        /\[\w+\]\.length/g,  // array[index].length
        /\w+\[\w+\]\.length/g,  // obj[key].length
        /\w+\?\.[\w\[\]]+\.length/g,  // optional chaining with length
      ];
      
      lengthPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(line)) !== null) {
          const matchText = match[0];
          
          // Skip if it's already safely guarded
          const safePatterns = [
            /\(\w+\s*\|\|\s*['"`]['"`]\)\.length/,  // (var || '').length
            /\(\w+\s*\|\|\s*\[\]\)\.length/,  // (var || []).length
            /Array\.isArray\(\w+\)\s*&&\s*\w+\.length/,  // Array.isArray check
            /\w+\s*&&\s*\w+\.length/,  // variable && variable.length
            /\w+\?\.length/,  // optional chaining
          ];
          
          const isAlreadySafe = safePatterns.some(safePattern => safePattern.test(line));
          
          if (!isAlreadySafe) {
            issues.push({
              file: filePath,
              line: lineNum,
              text: line.trim(),
              match: matchText
            });
          }
        }
      });
    });
    
    return issues;
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err.message);
    return [];
  }
}

// Main execution
console.log('Scanning for potential .length issues...');

const projectRoot = process.cwd();
const files = findFiles(projectRoot);

console.log(`Found ${files.length} TypeScript/React files to check`);

let totalIssues = 0;
const allIssues = [];

files.forEach(file => {
  const issues = checkFileForLengthIssues(file);
  if (issues.length > 0) {
    allIssues.push(...issues);
    totalIssues += issues.length;
  }
});

if (totalIssues === 0) {
  console.log('✅ No potential .length issues found!');
} else {
  console.log(`\n⚠️  Found ${totalIssues} potential .length issues:\n`);
  
  allIssues.forEach((issue, index) => {
    console.log(`${index + 1}. ${path.relative(projectRoot, issue.file)}:${issue.line}`);
    console.log(`   Match: ${issue.match}`);
    console.log(`   Line: ${issue.text}`);
    console.log('');
  });
}

console.log('Scan complete.');