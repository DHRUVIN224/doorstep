const express = require('express');
const path = require('path');
const fs = require('fs');
const testRouter = express.Router();

// Get the image directory
const imagesDir = path.join(__dirname, '../../public/images');

// List all images in the directory
testRouter.get('/list-images', (req, res) => {
  try {
    if (!fs.existsSync(imagesDir)) {
      return res.status(404).json({
        success: false,
        message: 'Image directory not found',
        path: imagesDir
      });
    }
    
    const files = fs.readdirSync(imagesDir);
    return res.json({
      success: true,
      message: 'Images found',
      count: files.length,
      directory: imagesDir,
      files: files
    });
  } catch (error) {
    console.error('Error listing images:', error);
    return res.status(500).json({
      success: false,
      message: 'Error listing images',
      error: error.message
    });
  }
});

// Get info about a specific image
testRouter.get('/image-info/:filename', (req, res) => {
  try {
    const filename = req.params.filename;
    const imagePath = path.join(imagesDir, filename);
    
    if (!fs.existsSync(imagePath)) {
      return res.status(404).json({
        success: false,
        message: 'Image not found',
        filename,
        path: imagePath
      });
    }
    
    const stats = fs.statSync(imagePath);
    return res.json({
      success: true,
      message: 'Image found',
      filename,
      path: imagePath,
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      exists: true
    });
  } catch (error) {
    console.error('Error getting image info:', error);
    return res.status(500).json({
      success: false,
      message: 'Error getting image info',
      error: error.message
    });
  }
});

// Get a page with image test links
testRouter.get('/image-tester', (req, res) => {
  try {
    // Get list of image files
    const files = fs.existsSync(imagesDir) ? fs.readdirSync(imagesDir) : [];
    
    // Create HTML for testing
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Image Tester</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .image-test { margin-bottom: 30px; border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
          .image-container { max-width: 300px; max-height: 300px; overflow: hidden; margin: 10px 0; }
          img { max-width: 100%; }
          .url-tests { margin-top: 10px; }
          .url-test { margin: 5px 0; }
          h2 { margin-top: 30px; }
        </style>
      </head>
      <body>
        <h1>Image Path Tester</h1>
        <p>Testing ${files.length} images in ${imagesDir}</p>
        
        <h2>Images</h2>
        ${files.map(file => `
          <div class="image-test">
            <h3>${file}</h3>
            
            <div class="url-tests">
              <div class="url-test">
                <p>/images/${file}</p>
                <div class="image-container">
                  <img src="/images/${file}" onerror="this.parentNode.innerHTML='<p style=\\"color:red\\">Failed to load</p>'" />
                </div>
              </div>
              
              <div class="url-test">
                <p>/public/images/${file}</p>
                <div class="image-container">
                  <img src="/public/images/${file}" onerror="this.parentNode.innerHTML='<p style=\\"color:red\\">Failed to load</p>'" />
                </div>
              </div>
            </div>
          </div>
        `).join('')}
      </body>
      </html>
    `;
    
    res.send(html);
  } catch (error) {
    console.error('Error generating image tester:', error);
    res.status(500).send(`Error: ${error.message}`);
  }
});

module.exports = testRouter; 