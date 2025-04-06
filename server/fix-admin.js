// Script to fix admin user by adding missing fields
const mongoose = require('mongoose');
const loginModel = require('./src/models/loginModel');
require('dotenv').config();

async function fixAdminUser() {
  try {
    console.log('Connecting to MongoDB...');
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/DoorstepserviceDB';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('Connected to database. Looking for admin user...');
    
    // Find the admin user
    const adminUser = await loginModel.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.error('No admin user found in the database!');
      mongoose.connection.close();
      return;
    }
    
    console.log('Found admin user:', adminUser);
    
    // Update the admin user with status=1 if it's missing
    if (!adminUser.status) {
      console.log('Admin user is missing status field. Updating...');
      
      adminUser.status = "1";
      await adminUser.save();
      
      console.log('Admin user updated successfully with status=1');
    } else {
      console.log('Admin user already has status field:', adminUser.status);
    }
    
    console.log('Admin user is now ready to use.');
    mongoose.connection.close();
    
  } catch (error) {
    console.error('Error fixing admin user:', error);
    try {
      mongoose.connection.close();
    } catch (err) {
      // Ignore
    }
  }
}

// Run the function
fixAdminUser(); 