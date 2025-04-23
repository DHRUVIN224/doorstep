/**
 * Fix for common image path issues
 * This utility helps determine which image paths work with the server
 */

// Server URLs to test
const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';
const ALTERNATIVE_URL = 'http://localhost:5000'; // Fallback URL

// Cached results of which URL patterns work
let workingImagePattern = null;

/**
 * Test different image URL patterns to find which one works
 * @param {string} imageName - The image filename
 * @returns {Promise<string>} The working URL pattern or null if none work
 */
export const findWorkingImageUrl = async (imageName) => {
  if (!imageName) return null;
  
  // If we already know which pattern works, use it
  if (workingImagePattern) {
    return workingImagePattern.replace('[filename]', imageName);
  }
  
  // Patterns to test
  const patterns = [
    `${SERVER_URL}/images/[filename]`, 
    `${SERVER_URL}/public/images/[filename]`,
    `${ALTERNATIVE_URL}/images/[filename]`,
    `${ALTERNATIVE_URL}/public/images/[filename]`
  ];
  
  // Test each pattern with a HEAD request
  for (const pattern of patterns) {
    const url = pattern.replace('[filename]', imageName);
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (response.ok) {
        // Cache the working pattern for future use
        workingImagePattern = pattern;
        return url;
      }
    } catch (error) {
      console.error(`Error testing image URL ${url}:`, error);
    }
  }
  
  return null;
};

/**
 * Get the proper image URL for a given filename
 * @param {string} filename - The image filename
 * @returns {string} The best URL to use for this image
 */
export const getImageUrl = (filename) => {
  if (!filename) return '';
  
  // If we have a working pattern cached, use it
  if (workingImagePattern) {
    return workingImagePattern.replace('[filename]', filename);
  }
  
  // Otherwise use the default pattern and let the component handle fallbacks
  return `${SERVER_URL}/images/${filename}`;
};

/**
 * Process API response data to fix image URLs
 * @param {Object} data - The API response data
 * @returns {Object} The processed data with fixed image URLs
 */
export const processApiResponseImages = (data) => {
  if (!data) return data;
  
  // Deep clone the data
  const processedData = JSON.parse(JSON.stringify(data));
  
  // If the data has an image property, add an imageUrl property
  if (processedData.image) {
    processedData.imageUrl = getImageUrl(processedData.image);
  }
  
  // If data is an array, process each item
  if (Array.isArray(processedData)) {
    return processedData.map(item => {
      if (item && item.image) {
        return {
          ...item,
          imageUrl: getImageUrl(item.image)
        };
      }
      return item;
    });
  }
  
  return processedData;
};

export default {
  findWorkingImageUrl,
  getImageUrl,
  processApiResponseImages
}; 