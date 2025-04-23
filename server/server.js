const express = require('express')
const app = express();
const bodyparser = require('body-parser')
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./src/config/db');
const userRouter = require('./src/routes/userRouter');
const buissnessRouter = require('./src/routes/buissnessRouter');
const adminRouter = require('./src/routes/adminRouter');
const messageRouter = require('./src/routes/messageRouter');
const testRouter = require('./src/routes/testRoutes');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Connect to MongoDB
connectDB();

// Ensure public/images directory exists
const publicImagesDir = path.join(__dirname, 'public', 'images');
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
  console.log('Created public/images directory');
}

app.use(bodyparser.json())
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}))
app.use(express.urlencoded({extended:true}))

// Serve static files from the public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// Serve static files from public directory
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Add a test endpoint to check if the server can access images
app.get('/check-images', (req, res) => {
  try {
    const files = fs.readdirSync(publicImagesDir);
    res.json({ 
      success: true, 
      message: 'Image directory accessible',
      directory: publicImagesDir,
      files: files
    });
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: 'Error accessing image directory',
      error: err.message
    });
  }
});

app.use('/user',userRouter)
app.use('/buissness',buissnessRouter)
app.use('/admin',adminRouter)
app.use('/message',messageRouter)
app.use('/test', testRouter)

app.listen(PORT,() => {
    console.log(`Server started on port ${PORT}`)
    console.log(`Static files being served from: ${path.join(__dirname, 'public')}`)
})