const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const JoinRequest = require('../models/JoinRequest');
const auth = require('../middleware/auth');

// Get all projects with filtering and search
router.get('/', async (req, res) => {
  try {
    const { category, search, skill, status } = req.query;
    let filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (status && status !== 'All') {
      filter.status = status;
    }

    if (skill) {
      filter.requiredSkills = { $regex: new RegExp(skill, 'i') };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: searchRegex },
        { tagline: searchRegex },
        { description: searchRegex },
        { hackathonName: searchRegex },
        { requiredSkills: searchRegex },
        { tags: searchRegex }
      ];
    }

    const projects = await Project.find(filter)
      .populate('leader', 'name email college major avatar skills')
      .populate('teamMembers.user', 'name email college major avatar skills')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ message: 'Error fetching projects. ' + err.message });
  }
});

// Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('leader', 'name email college major avatar skills bio github linkedin portfolio')
      .populate('teamMembers.user', 'name email college major avatar skills bio');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new project
router.post('/', auth, async (req, res) => {
  try {
    const {
      title, tagline, description, category, hackathonName,
      requiredSkills, openRoles, maxTeamSize, deadline, repoUrl, demoUrl, tags
    } = req.body;

    if (!title || !tagline || !description) {
      return res.status(400).json({ message: 'Title, tagline, and description are required.' });
    }

    let parsedSkills = [];
    if (Array.isArray(requiredSkills)) {
      parsedSkills = requiredSkills;
    } else if (typeof requiredSkills === 'string') {
      parsedSkills = requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
    }

    let parsedTags = [];
    if (Array.isArray(tags)) {
      parsedTags = tags;
    } else if (typeof tags === 'string') {
      parsedTags = tags.split(',').map(s => s.trim()).filter(Boolean);
    }

    const newProject = new Project({
      title: title.trim(),
      tagline: tagline.trim(),
      description,
      category: category || 'Hackathon',
      hackathonName: hackathonName || '',
      leader: req.user._id,
      teamMembers: [{
        user: req.user._id,
        role: 'Team Lead / Creator',
        joinedAt: new Date()
      }],
      requiredSkills: parsedSkills,
      openRoles: openRoles && openRoles.length > 0 ? openRoles : [{ role: 'Developer', vacancies: 2, filled: 0 }],
      maxTeamSize: maxTeamSize || 4,
      status: 'Recruiting',
      deadline: deadline ? new Date(deadline) : null,
      repoUrl: repoUrl || '',
      demoUrl: demoUrl || '',
      tags: parsedTags
    });

    await newProject.save();

    const populated = await Project.findById(newProject._id)
      .populate('leader', 'name email college major avatar skills')
      .populate('teamMembers.user', 'name email college major avatar skills');

    res.status(201).json({
      message: 'Project created successfully!',
      project: populated
    });
  } catch (err) {
    console.error('Create project error:', err);
    res.status(500).json({ message: 'Failed to create project: ' + err.message });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the project leader can update this project.' });
    }

    const updateFields = ['title', 'tagline', 'description', 'category', 'hackathonName', 'requiredSkills', 'openRoles', 'maxTeamSize', 'status', 'deadline', 'repoUrl', 'demoUrl', 'tags'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    await project.save();

    const updated = await Project.findById(project._id)
      .populate('leader', 'name email college major avatar skills')
      .populate('teamMembers.user', 'name email college major avatar skills');

    res.json({ message: 'Project updated successfully', project: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the project leader can delete this project.' });
    }

    await Project.findByIdAndDelete(req.params.id);
    await JoinRequest.deleteMany({ project: req.params.id });

    res.json({ message: 'Project deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Apply to join project
router.post('/:id/apply', auth, async (req, res) => {
  try {
    const { requestedRole, message, portfolioLinks } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is already leader or team member
    if (project.leader.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You are already the leader of this project.' });
    }

    const alreadyMember = project.teamMembers.some(
      m => m.user && m.user.toString() === req.user._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({ message: 'You are already a member of this team.' });
    }

    // Check if an existing pending application exists
    const existingReq = await JoinRequest.findOne({
      project: project._id,
      applicant: req.user._id,
      status: 'pending'
    });
    if (existingReq) {
      return res.status(400).json({ message: 'You already have a pending join request for this project.' });
    }

    const joinRequest = new JoinRequest({
      project: project._id,
      applicant: req.user._id,
      requestedRole: requestedRole || 'Contributor',
      message: message || 'Hi! I would love to join your project team.',
      portfolioLinks: portfolioLinks || ''
    });

    await joinRequest.save();

    res.status(201).json({
      message: 'Join request sent successfully to the team lead!',
      request: joinRequest
    });
  } catch (err) {
    console.error('Join request error:', err);
    res.status(500).json({ message: 'Failed to submit application: ' + err.message });
  }
});

module.exports = router;
