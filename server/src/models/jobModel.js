const mongoose = require("mongoose");

const schema = mongoose.Schema;

const jobSchema = new schema({
  title: { 
    type: String, 
    required: [true, 'Job title is required'],
    trim: true
  },
  description: { 
    type: String,
    required: [true, 'Job description is required'],
    trim: true
  },
  category: { 
    type: String,
    required: [true, 'Category is required'],
    lowercase: true,
    trim: true
  },
  city: { 
    type: String,
    lowercase: true,
    trim: true,
    default: ''
  },
  date: { 
    type: String,
    required: [true, 'Date is required']
  },
  budget: { 
    type: Number,
    required: [true, 'Budget is required'],
    default: 0
  },
  image: { 
    type: String,
    required: [true, 'Image is required']
  },
  userId: { 
    type: mongoose.Types.ObjectId, 
    ref: "user_tb",
    required: true
  },
  status: { 
    type: String,
    default: "0",
    enum: ["0", "1", "2"] // 0: pending, 1: approved, 2: assigned
  },
  address: {
    type: String,
    default: ''
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const jobModel = mongoose.model("jobpost_tb", jobSchema);
module.exports = jobModel;
