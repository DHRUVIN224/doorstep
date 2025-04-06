/**
 * Script to check for missing API imports in all JavaScript files
 * This will scan for any usage of userAPI, businessAPI, adminAPI, or messageAPI
 * without a corresponding import statement
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const stat = promisify(fs.stat);

// Base path for client source files
const BASE_PATH = path.join(__dirname, 'client', 'src');

// API objects to check for
const API_OBJECTS = ['userAPI', 'businessAPI', 'adminAPI', 'messageAPI'];

// Helper function to recursively get all JS files in a directory
async function getAllJSFiles(dir) {
  const files = await readdir(dir);
  const jsFiles = [];
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const fileStat = await stat(filePath);
    
    if (fileStat.isDirectory()) {
      const subDirFiles = await getAllJSFiles(filePath);
      jsFiles.push(...subDirFiles);
    } else if (file.endsWith('.js')) {
      jsFiles.push(filePath);
    }
  }
  
  return jsFiles;
}

// Function to fix a single file
async function fixFile(filePath) {
  try {
    console.log(`Processing file: ${filePath}`);
    
    // Read file content
    let content = await readFile(filePath, 'utf8');
    let originalContent = content;
    
    // Determine the relative path to services/api.js
    const relativePath = path.relative(path.dirname(filePath), path.join(BASE_PATH, 'services')).replace(/\\/g, '/');
    const importPath = relativePath === '' ? './api' : `${relativePath}/api`;
    
    // Check for API objects usage without import
    const usedAPIs = [];
    for (const apiObj of API_OBJECTS) {
      if (content.includes(apiObj) && !content.includes(`import {`) && !content.includes(`import { ${apiObj}`) && !content.includes(`${apiObj},`) && !content.includes(`, ${apiObj}`)) {
        usedAPIs.push(apiObj);
      }
    }
    
    // If any API objects are used without import, add the import
    if (usedAPIs.length > 0) {
      console.log(`Found used APIs without import: ${usedAPIs.join(', ')}`);
      
      // Add import statement
      if (content.includes('import React')) {
        // Add after React import
        content = content.replace(
          /import React[^;]*;(\r?\n)/,
          `$&import { ${usedAPIs.join(', ')} } from "${importPath}";$1`
        );
      } else if (content.trim().startsWith('import ')) {
        // Add after first import
        content = content.replace(
          /import [^;]*;(\r?\n)/,
          `$&import { ${usedAPIs.join(', ')} } from "${importPath}";$1`
        );
      } else {
        // Add at the top
        content = `import { ${usedAPIs.join(', ')} } from "${importPath}";\n${content}`;
      }
    }
    
    // Fix incorrect API calls format
    // 1. Remove extra / in function calls
    for (const apiObj of API_OBJECTS) {
      if (content.includes(apiObj)) {
        const regex = new RegExp(`${apiObj}\\.[a-zA-Z]+\\(\`\\/`, 'g');
        content = content.replace(regex, (match) => match.replace('(`/', '('));
      }
    }
    
    // 2. Fix API calls with trailing objects and empty objects
    content = content.replace(/API\.[a-zA-Z]+\(([^)]*)\s*,\s*{\s*}\)/g, 'API.$1)');
    content = content.replace(/API\.[a-zA-Z]+\(([^)]*)\)\s*,\s*{\s*}/g, 'API.$1)');
    
    // 3. Remove duplicate catch blocks
    content = content.replace(/\.catch\([^)]*\)[^)]*\.catch\([^)]*\)/g, '.catch(error => { console.log(error); })');
    
    // If content was modified, write it back
    if (content !== originalContent) {
      await writeFile(filePath, content, 'utf8');
      console.log(`Updated file: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
}

// Main function
async function main() {
  try {
    const jsFiles = await getAllJSFiles(BASE_PATH);
    console.log(`Found ${jsFiles.length} JavaScript files`);
    
    let updatedCount = 0;
    
    for (const file of jsFiles) {
      const updated = await fixFile(file);
      if (updated) {
        updatedCount++;
      }
    }
    
    console.log(`Updated ${updatedCount} files with API imports`);
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 