const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');

// Get all students / teammates with filtering
router.get('/', async (req, res) => {
  try {
    const { search, skill, college, availability } = req.query;
    let filter = {};

    if (availability && availability !== 'All') {
      filter.availability = availability;
    }

    if (college && college !== 'All') {
      filter.college = college;
    }

    if (skill) {
      filter.skills = { $regex: new RegExp(skill, 'i') };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { college: searchRegex },
        { major: searchRegex },
        { bio: searchRegex },
        { skills: searchRegex }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Error fetching students: ' + err.message });
  }
});

// Get student profile by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Student profile not found' });
    }

    // Find projects created by this user
    const createdProjects = await Project.find({ leader: user._id })
      .populate('teamMembers.user', 'name avatar');

    // Find projects joined by this user (where user is member and not leader)
    const joinedProjects = await Project.find({
      'teamMembers.user': user._id,
      leader: { $ne: user._id }
    }).populate('leader', 'name avatar college');

    res.json({
      user,
      createdProjects,
      joinedProjects
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
