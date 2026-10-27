const mongoose = require('mongoose');
const User = require('./models/User');
const Project = require('./models/Project');
require('dotenv').config();

const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- Starting FindMyTeam Integration Tests ---');
  
  // 1. Health check
  try {
    const res = await fetch(`${API_BASE}/health`);
    const health = await res.json();
    console.log('✓ Health check passed:', health.status, 'DB:', health.database);
  } catch (err) {
    console.error('✗ Health check failed:', err.message);
    process.exit(1);
  }

  // 2. Test Registration (saving to MongoDB)
  const testStudentEmail = `test_${Date.now()}@university.edu`;
  let token = '';
  let registeredUserId = '';

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Jordan Maxwell',
        email: testStudentEmail,
        password: 'mypassword123',
        college: 'Harvard University',
        major: 'Computer Science & Mathematics',
        year: 'Junior',
        bio: 'Enthusiastic developer specializing in distributed systems and algorithms.',
        skills: ['Go', 'React', 'Docker', 'Kubernetes'],
        github: 'github.com/jordanmaxwell',
        availability: 'Looking for Team'
      })
    });

    const regRes = await res.json();
    if (!res.ok) throw new Error(regRes.message || 'Registration failed');

    token = regRes.token;
    registeredUserId = regRes.user._id;
    console.log('✓ Registration passed! Created user in MongoDB:', regRes.user.name, 'ID:', registeredUserId);
  } catch (err) {
    console.error('✗ Registration failed:', err.message);
    process.exit(1);
  }

  // 3. Test Login
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testStudentEmail,
        password: 'mypassword123'
      })
    });
    const loginRes = await res.json();
    if (!res.ok) throw new Error(loginRes.message || 'Login failed');
    console.log('✓ Login passed! Received token and user:', loginRes.user.email);
  } catch (err) {
    console.error('✗ Login failed:', err.message);
    process.exit(1);
  }

  // 4. Test Create Project with Auth Token
  let createdProjectId = '';
  try {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'NeuralCollab — Real-time Distributed IDE',
        tagline: 'Collaborative code editor powered by CRDTs and WebRTC',
        description: 'Senior project building a peer-to-peer collaborative editor with terminal execution.',
        category: 'College Capstone',
        requiredSkills: ['Go', 'React', 'WebRTC', 'Docker'],
        openRoles: [
          { role: 'WebRTC Networking Specialist', vacancies: 1, filled: 0 }
        ],
        maxTeamSize: 3
      })
    });

    const projRes = await res.json();
    if (!res.ok) throw new Error(projRes.message || 'Create project failed');

    createdProjectId = projRes.project._id;
    console.log('✓ Create Project passed! Project ID:', createdProjectId, 'Title:', projRes.project.title);
  } catch (err) {
    console.error('✗ Create Project failed:', err.message);
    process.exit(1);
  }

  // 5. Test Fetch Projects
  try {
    const res = await fetch(`${API_BASE}/projects`);
    const listRes = await res.json();
    console.log(`✓ Get Projects passed! Total projects in MongoDB: ${listRes.length}`);
  } catch (err) {
    console.error('✗ Get Projects failed:', err.message);
    process.exit(1);
  }

  // Clean up test user and test project
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/findmyteam');
    await User.findByIdAndDelete(registeredUserId);
    await Project.findByIdAndDelete(createdProjectId);
    console.log('✓ Test cleanup completed successfully.');
    await mongoose.disconnect();
  } catch (cleanErr) {
    console.log('Note on cleanup:', cleanErr.message);
  }

  console.log('--- ALL INTEGRATION TESTS PASSED SUCCESSFULLY! ---');
  process.exit(0);
}

runTests();
