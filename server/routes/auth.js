const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'findmyteam_super_secret_jwt_key_2026_student_collab';

// Register a new student account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, college, major, year, bio, skills, github, linkedin, portfolio, availability } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'A student with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Default avatars based on name or vibrant Unsplash student avatars
    const studentAvatars = [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250'
    ];
    const chosenAvatar = req.body.avatar || studentAvatars[Math.floor(Math.random() * studentAvatars.length)];

    let parsedSkills = [];
    if (Array.isArray(skills)) {
      parsedSkills = skills;
    } else if (typeof skills === 'string' && skills.trim().length > 0) {
      parsedSkills = skills.split(',').map(s => s.trim()).filter(Boolean);
    }

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      college: college || 'University Campus',
      major: major || 'Computer Science',
      year: year || 'Junior',
      bio: bio || 'Excited to collaborate on hackathons, tech builds, and college projects!',
      avatar: chosenAvatar,
      skills: parsedSkills.length > 0 ? parsedSkills : ['React', 'JavaScript', 'Git'],
      github: github || '',
      linkedin: linkedin || '',
      portfolio: portfolio || '',
      availability: availability || 'Looking for Team',
      badges: ['New Explorer', 'Collab Ready']
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userObj = newUser.toObject();
    delete userObj.password;

    res.status(201).json({
      message: 'Account created successfully! Welcome to FindMyTeam.',
      token,
      user: userObj
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Error registering account. ' + err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      message: 'Logged in successfully!',
      token,
      user: userObj
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Error logging in. ' + err.message });
  }
});

// Current User Details
router.get('/me', auth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Profile
router.put('/profile', auth, async (req, res) => {
  try {
    const {
      name, college, major, year, bio, avatar,
      skills, github, linkedin, portfolio, availability, interests
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name.trim();
    if (college) user.college = college.trim();
    if (major) user.major = major.trim();
    if (year) user.year = year.trim();
    if (bio !== undefined) user.bio = bio;
    if (avatar) user.avatar = avatar;
    if (github !== undefined) user.github = github;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (availability) user.availability = availability;
    if (interests && Array.isArray(interests)) user.interests = interests;

    if (skills) {
      if (Array.isArray(skills)) {
        user.skills = skills.map(s => s.trim()).filter(Boolean);
      } else if (typeof skills === 'string') {
        user.skills = skills.split(',').map(s => s.trim()).filter(Boolean);
      }
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      message: 'Profile updated successfully!',
      user: userObj
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ message: 'Failed to update profile. ' + err.message });
  }
});

module.exports = router;
