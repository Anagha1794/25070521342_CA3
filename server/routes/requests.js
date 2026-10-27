const express = require('express');
const router = express.Router();
const JoinRequest = require('../models/JoinRequest');
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Get incoming join requests for projects led by current user
router.get('/incoming', auth, async (req, res) => {
  try {
    const userProjects = await Project.find({ leader: req.user._id }).select('_id');
    const projectIds = userProjects.map(p => p._id);

    const requests = await JoinRequest.find({ project: { $in: projectIds } })
      .populate('applicant', 'name email college major avatar skills bio github linkedin portfolio')
      .populate('project', 'title category maxTeamSize status')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error('Error fetching incoming requests:', err);
    res.status(500).json({ message: 'Error fetching requests: ' + err.message });
  }
});

// Get outgoing join requests sent by current user
router.get('/outgoing', auth, async (req, res) => {
  try {
    const requests = await JoinRequest.find({ applicant: req.user._id })
      .populate({
        path: 'project',
        select: 'title category status leader',
        populate: {
          path: 'leader',
          select: 'name email avatar college'
        }
      })
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (err) {
    console.error('Error fetching outgoing requests:', err);
    res.status(500).json({ message: 'Error fetching requests: ' + err.message });
  }
});

// Accept or Reject a join request
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body; // 'accepted' or 'rejected'
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be accepted or rejected' });
    }

    const joinRequest = await JoinRequest.findById(req.params.id)
      .populate('project')
      .populate('applicant', 'name email college major avatar skills');

    if (!joinRequest) {
      return res.status(404).json({ message: 'Join request not found' });
    }

    const project = await Project.findById(joinRequest.project._id);
    if (!project) {
      return res.status(404).json({ message: 'Associated project not found' });
    }

    // Check if user is leader
    if (project.leader.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the project leader can manage join requests.' });
    }

    joinRequest.status = status;
    await joinRequest.save();

    if (status === 'accepted') {
      // Add applicant to team if not already in
      const isAlreadyIn = project.teamMembers.some(
        m => m.user && m.user.toString() === joinRequest.applicant._id.toString()
      );

      if (!isAlreadyIn) {
        project.teamMembers.push({
          user: joinRequest.applicant._id,
          role: joinRequest.requestedRole || 'Team Member',
          joinedAt: new Date()
        });

        // Update filled roles count if matches
        const roleObj = project.openRoles.find(r => r.role.toLowerCase() === joinRequest.requestedRole.toLowerCase());
        if (roleObj) {
          roleObj.filled = (roleObj.filled || 0) + 1;
        }

        // If team reached max size, update status
        if (project.teamMembers.length >= project.maxTeamSize) {
          project.status = 'Team Full';
        }

        await project.save();
      }
    }

    res.json({
      message: `Join request ${status} successfully!`,
      request: joinRequest
    });
  } catch (err) {
    console.error('Error handling request status update:', err);
    res.status(500).json({ message: 'Failed to update request: ' + err.message });
  }
});

module.exports = router;
