const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// Get all teams the user belongs to (as leader or member)
router.get('/', auth, async (req, res) => {
  try {
    const teams = await Project.find({
      $or: [
        { leader: req.user._id },
        { 'teamMembers.user': req.user._id }
      ]
    })
      .populate('leader', 'name email college major avatar skills')
      .populate('teamMembers.user', 'name email college major avatar skills')
      .sort({ updatedAt: -1 });

    res.json(teams);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ message: 'Error fetching teams: ' + err.message });
  }
});

// Get messages for a team workspace
router.get('/:id/messages', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Team project not found' });
    }

    // Verify membership
    const isMember = project.leader.toString() === req.user._id.toString() ||
      project.teamMembers.some(m => m.user && m.user.toString() === req.user._id.toString());

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this team.' });
    }

    const messages = await Message.find({ project: project._id })
      .populate('sender', 'name email avatar college')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Post a new message to the team workspace
router.post('/:id/messages', auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content cannot be empty' });
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Team project not found' });
    }

    // Verify membership
    const isMember = project.leader.toString() === req.user._id.toString() ||
      project.teamMembers.some(m => m.user && m.user.toString() === req.user._id.toString());

    if (!isMember) {
      return res.status(403).json({ message: 'Access denied. You are not a member of this team.' });
    }

    const message = new Message({
      project: project._id,
      sender: req.user._id,
      content: content.trim()
    });

    await message.save();

    const populated = await Message.findById(message._id)
      .populate('sender', 'name email avatar college');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
