const mongoose = require('mongoose');

const joinRequestSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requestedRole: {
    type: String,
    required: [true, 'Requested role is required']
  },
  message: {
    type: String,
    required: [true, 'Application message is required']
  },
  portfolioLinks: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('JoinRequest', joinRequestSchema);
