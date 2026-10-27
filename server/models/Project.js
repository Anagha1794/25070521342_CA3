const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Project title is required'],
    trim: true
  },
  tagline: {
    type: String,
    required: [true, 'Tagline is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    enum: ['Hackathon', 'College Capstone', 'Side Project', 'Coding Competition', 'Open Source'],
    default: 'Hackathon'
  },
  hackathonName: {
    type: String,
    default: ''
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teamMembers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      default: 'Contributor'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  requiredSkills: [{
    type: String,
    trim: true
  }],
  openRoles: [{
    role: { type: String, required: true },
    vacancies: { type: Number, default: 1 },
    filled: { type: Number, default: 0 }
  }],
  maxTeamSize: {
    type: Number,
    default: 4
  },
  status: {
    type: String,
    enum: ['Recruiting', 'Team Full', 'In Progress', 'Completed'],
    default: 'Recruiting'
  },
  deadline: {
    type: Date
  },
  repoUrl: {
    type: String,
    default: ''
  },
  demoUrl: {
    type: String,
    default: ''
  },
  tags: [{
    type: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);
