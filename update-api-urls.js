/**
 * Script to update hardcoded API URLs to use centralized API service
 * 
 * This script will:
 * 1. Find all JavaScript files in the client/src directory
 * 2. Look for direct axios calls to 'http://localhost:3000'
 * 3. Replace them with the appropriate API service calls
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

// API endpoint patterns to replace
const API_PATTERNS = {
  // User API
  'http://localhost:3000/user/login': 'userAPI.login',
  'http://localhost:3000/user/register': 'userAPI.register',
  'http://localhost:3000/user/profile': 'userAPI.profile',
  'http://localhost:3000/user/postjob': 'userAPI.postJob',
  'http://localhost:3000/user/viewjobpost': 'userAPI.viewJobs',
  'http://localhost:3000/user/deletejob/': 'userAPI.deleteJob(',
  'http://localhost:3000/user/viewsinglejob/': 'userAPI.viewSingleJob(',
  'http://localhost:3000/user/viewpostedjob/': 'userAPI.viewPostedJob(',
  'http://localhost:3000/user/savejob/': 'userAPI.saveJob(',
  'http://localhost:3000/user/search': 'userAPI.searchServices',
  'http://localhost:3000/user/bookservice/': 'userAPI.bookService(',
  'http://localhost:3000/user/viewfullbuissnessprofile/': 'userAPI.viewBusinessProfile(',
  'http://localhost:3000/user/viewjobapplications/': 'userAPI.viewJobApplications(',
  'http://localhost:3000/user/approvejobapplication/': 'userAPI.approveJobApplication(',
  'http://localhost:3000/user/appointments': 'userAPI.viewAppointments',
  'http://localhost:3000/user/approvejob/': 'userAPI.approveJob(',
  'http://localhost:3000/user/viewapplicantprofile/': 'userAPI.viewApplicantProfile(',
  'http://localhost:3000/user/message/': 'userAPI.sendMessage(',
  'http://localhost:3000/user/viewbuissnessdetails/': 'userAPI.viewBusinessDetails(',
  
  // Business API
  'http://localhost:3000/buissness/register': 'businessAPI.register',
  'http://localhost:3000/buissness/profile': 'businessAPI.profile',
  'http://localhost:3000/buissness/viewjoblist': 'businessAPI.viewJobList',
  'http://localhost:3000/buissness/apply/': 'businessAPI.apply(',
  'http://localhost:3000/buissness/viewjobdetails/': 'businessAPI.viewJobDetails(',
  'http://localhost:3000/buissness/viewjobonsearch/': 'businessAPI.viewJobOnSearch(',
  'http://localhost:3000/buissness/viewuserdetails/': 'businessAPI.viewUserDetails(',
  'http://localhost:3000/buissness/viewapplication/': 'businessAPI.viewApplication(',
  'http://localhost:3000/buissness/viewjobapplications': 'businessAPI.viewJobApplications',
  'http://localhost:3000/buissness/viewjobappointments': 'businessAPI.viewJobAppointments',
  'http://localhost:3000/buissness/viewjobappointments/': 'businessAPI.viewJobAppointmentDetails(',
  'http://localhost:3000/buissness/jobfinished/': 'businessAPI.jobFinished(',
  'http://localhost:3000/buissness/bookingappointments': 'businessAPI.viewBookingAppointments',
  'http://localhost:3000/buissness/bookingappointments/': 'businessAPI.viewBookingDetails(',
  'http://localhost:3000/buissness/updatebooking/': 'businessAPI.updateBooking(',
  'http://localhost:3000/buissness/acceptbooking/': 'businessAPI.acceptBooking(',
  'http://localhost:3000/buissness/rejectbooking/': 'businessAPI.rejectBooking(',
  'http://localhost:3000/buissness/enquiries': 'businessAPI.viewEnquiries',
  
  // Admin API
  'http://localhost:3000/admin/buissnessverification': 'adminAPI.viewBusinessVerification',
  'http://localhost:3000/admin/viewbuissnessprofile/': 'adminAPI.viewBusinessProfile(',
  'http://localhost:3000/admin/updatestatus/': 'adminAPI.updateStatus(',
  'http://localhost:3000/admin/rejectstatus/': 'adminAPI.rejectStatus(',
  'http://localhost:3000/admin/jobapprovals': 'adminAPI.jobApprovals',
  'http://localhost:3000/admin/viewjobpost/': 'adminAPI.viewJobPost(',
  'http://localhost:3000/admin/updatejobstatus/': 'adminAPI.updateJobStatus(',
  'http://localhost:3000/admin/rejectjobstatus/': 'adminAPI.rejectJobStatus(',
  
  // Message API
  'http://localhost:3000/message/viewmessage': 'messageAPI.viewMessage',
  'http://localhost:3000/message/viewbuissnessmessage': 'messageAPI.viewBusinessMessage',
  'http://localhost:3000/message/viewuserchat/': 'messageAPI.viewUserChat(',
  'http://localhost:3000/message/viewchatmessage/': 'messageAPI.viewChatMessage(',
  'http://localhost:3000/message/sendmessage/': 'messageAPI.sendMessage(',
  'http://localhost:3000/message/savereplymessage/': 'messageAPI.saveReplyMessage(',
};

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

// Function to update a single file
async function updateFile(filePath) {
  try {
    console.log(`Processing file: ${filePath}`);
    
    // Read file content
    let content = await readFile(filePath, 'utf8');
    let originalContent = content;
    let hasAxiosImport = content.includes('import axios from');
    let hasUserAPI = content.includes('userAPI');
    let hasBusinessAPI = content.includes('businessAPI');
    let hasAdminAPI = content.includes('adminAPI');
    let hasMessageAPI = content.includes('messageAPI');
    
    // Check each pattern and replace
    for (const [pattern, replacement] of Object.entries(API_PATTERNS)) {
      if (content.includes(pattern)) {
        // Handle axios get/post with URL pattern
        content = content.replace(
          new RegExp(`axios(\\.|\\\n\\s*\\.)get\\((\\\`|"|')${pattern.replace(/\//g, '\\/').replace(/\./g, '\\.').replace(/\(/g, '\\(')}`, 'g'),
          `${replacement.replace('(', '')}(`
        );
        
        content = content.replace(
          new RegExp(`axios(\\.|\\\n\\s*\\.)post\\((\\\`|"|')${pattern.replace(/\//g, '\\/').replace(/\./g, '\\.').replace(/\(/g, '\\(')}`, 'g'),
          `${replacement.replace('(', '')}(`
        );
        
        // Handle string literals
        content = content.replace(
          new RegExp(`${pattern.replace(/\//g, '\\/').replace(/\./g, '\\.').replace(/\(/g, '\\(')}`, 'g'),
          `${replacement.replace('(', '(')}`
        );
      }
    }
    
    // Check if content was modified
    if (content !== originalContent) {
      // Add imports if needed
      if (!hasAxiosImport && !content.includes('import axios from')) {
        // Replace existing imports with added API service imports
        const importsNeeded = [];
        
        if (content.includes('userAPI') && !hasUserAPI) {
          importsNeeded.push('userAPI');
        }
        if (content.includes('businessAPI') && !hasBusinessAPI) {
          importsNeeded.push('businessAPI');
        }
        if (content.includes('adminAPI') && !hasAdminAPI) {
          importsNeeded.push('adminAPI');
        }
        if (content.includes('messageAPI') && !hasMessageAPI) {
          importsNeeded.push('messageAPI');
        }
        
        if (importsNeeded.length > 0) {
          // Add API service import
          if (content.includes('import React')) {
            // Add after React import
            content = content.replace(
              /import React.+?;(\r?\n)/,
              `$&import { ${importsNeeded.join(', ')} } from "../services/api";$1`
            );
          } else {
            // Add at the top
            content = `import { ${importsNeeded.join(', ')} } from "../services/api";\n${content}`;
          }
        }
      }
      
      // Remove axios specific things
      content = content.replace(/headers: \{ Authorization: \`(Bearer |bearer )\$\{token\}\` \},?/g, '');
      
      // Write modified content back to file
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
      const updated = await updateFile(file);
      if (updated) {
        updatedCount++;
      }
    }
    
    console.log(`Updated ${updatedCount} files with API references`);
  } catch (error) {
    console.error('Error:', error);
  }
}

main(); 