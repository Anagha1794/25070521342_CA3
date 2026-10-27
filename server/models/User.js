const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  college: {
    type: String,
    default: 'Stanford University'
  },
  major: {
    type: String,
    default: 'Computer Science'
  },
  year: {
    type: String,
    default: 'Junior'
  },
  bio: {
    type: String,
    default: 'Passionate student eager to build high-impact projects and participate in hackathons.'
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  },
  skills: [{
    type: String,
    trim: true
  }],
  github: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  portfolio: {
    type: String,
    default: ''
  },
  availability: {
    type: String,
    enum: ['Looking for Team', 'Open to Offers', 'Busy with Projects'],
    default: 'Looking for Team'
  },
  badges: [{
    type: String
  }],
  interests: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
