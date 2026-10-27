const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Project = require('./models/Project');
const JoinRequest = require('./models/JoinRequest');
const Message = require('./models/Message');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/findmyteam';

async function seedData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await JoinRequest.deleteMany({});
    await Message.deleteMany({});
    console.log('Cleared existing collections.');

    const defaultPassword = await bcrypt.hash('password123', 10);

    // Create 6 realistic students
    const usersData = [
      {
        name: 'Alex Rivera',
        email: 'alex@stanford.edu',
        password: defaultPassword,
        college: 'Stanford University',
        major: 'Computer Science & AI',
        year: 'Senior',
        bio: 'Full-stack builder passionate about generative AI, autonomous agents, and building high-impact hackathon apps. 3x Hackathon winner.',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
        skills: ['React', 'Node.js', 'Python', 'PyTorch', 'MongoDB', 'Tailwind CSS', 'Docker'],
        github: 'https://github.com/alexrivera-dev',
        linkedin: 'https://linkedin.com/in/alexrivera-tech',
        portfolio: 'https://alexrivera.dev',
        availability: 'Looking for Team',
        badges: ['3x Hackathon Winner', 'Team Captain', 'Top Contributor'],
        interests: ['Hackathons', 'Generative AI', 'Full Stack Apps']
      },
      {
        name: 'Sophia Chen',
        email: 'sophia@mit.edu',
        password: defaultPassword,
        college: 'MIT',
        major: 'EECS & Design',
        year: 'Junior',
        bio: 'Product designer & frontend specialist. Love turning complex system workflows into fluid, delightful digital experiences. Figma certified.',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        skills: ['Figma', 'UI/UX Design', 'React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Prototyping'],
        github: 'https://github.com/sophiachen-design',
        linkedin: 'https://linkedin.com/in/sophiachen-mit',
        portfolio: 'https://sophiachen.design',
        availability: 'Open to Offers',
        badges: ['Design Lead', 'Hackathon Finalist', 'Prototyper'],
        interests: ['Design Systems', 'Frontend Architecture', 'User Experience']
      },
      {
        name: 'Marcus Johnson',
        email: 'marcus@berkeley.edu',
        password: defaultPassword,
        college: 'UC Berkeley',
        major: 'Data Science',
        year: 'Junior',
        bio: 'Machine learning practitioner specializing in NLP and Computer Vision. Always keen to explore multimodal architectures and RAG pipelines.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
        skills: ['Python', 'TensorFlow', 'PyTorch', 'FastAPI', 'Pandas', 'LangChain', 'Scikit-Learn'],
        github: 'https://github.com/marcus-ml',
        linkedin: 'https://linkedin.com/in/marcusjohnson-ds',
        portfolio: 'https://marcusj.io',
        availability: 'Looking for Team',
        badges: ['Kaggle Expert', 'ML Researcher', 'Data Wizard'],
        interests: ['LLMs & RAG', 'Computer Vision', 'Data Engineering']
      },
      {
        name: 'Priya Patel',
        email: 'priya@gatech.edu',
        password: defaultPassword,
        college: 'Georgia Tech',
        major: 'Software Engineering',
        year: 'Sophomore',
        bio: 'Cloud architecture enthusiast and backend engineer. Proficient in distributed microservices, GraphQL, Redis caching, and Go.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
        skills: ['Go', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'GraphQL', 'Redis'],
        github: 'https://github.com/priyapatel-dev',
        linkedin: 'https://linkedin.com/in/priyapatel-tech',
        portfolio: 'https://priyapatel.tech',
        availability: 'Looking for Team',
        badges: ['Cloud Architect', 'AWS Certified', 'Fast Responder'],
        interests: ['Backend Systems', 'Distributed Computing', 'Hackathons']
      },
      {
        name: 'David Kim',
        email: 'david@cmu.edu',
        password: defaultPassword,
        college: 'Carnegie Mellon University',
        major: 'Computer Science',
        year: 'Senior',
        bio: 'Competitive programmer (Codeforces Candidate Master) and systems hacker. Passionate about algorithms, low-level optimization, and Rust.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
        skills: ['C++', 'Rust', 'Algorithms', 'Distributed Systems', 'Linux', 'Python'],
        github: 'https://github.com/davidkim-cmu',
        linkedin: 'https://linkedin.com/in/davidkim-cs',
        portfolio: 'https://davidkim.me',
        availability: 'Busy with Projects',
        badges: ['ICPC Regionalist', 'Algorithm Master', 'Rustacean'],
        interests: ['Coding Competitions', 'High Performance Systems', 'Compilers']
      },
      {
        name: 'Elena Rostova',
        email: 'elena@columbia.edu',
        password: defaultPassword,
        college: 'Columbia University',
        major: 'Information Science',
        year: 'Junior',
        bio: 'Mobile application developer with Flutter & React Native experience. Built two campus apps with 5,000+ active student users.',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
        skills: ['Flutter', 'React Native', 'Firebase', 'Swift', 'REST APIs', 'Figma'],
        github: 'https://github.com/elena-mobile',
        linkedin: 'https://linkedin.com/in/elenarostova',
        portfolio: 'https://elenaapps.dev',
        availability: 'Looking for Team',
        badges: ['App Store Publisher', 'Mobile Lead', 'Campus Innovator'],
        interests: ['Mobile Dev', 'Student Utility Apps', 'Hackathons']
      }
    ];

    const createdUsers = await User.insertMany(usersData);
    console.log(`Created ${createdUsers.length} students.`);

    const [alex, sophia, marcus, priya, david, elena] = createdUsers;

    // Create 4 realistic Projects
    const projectsData = [
      {
        title: 'StudyPulse — AI Peer Learning & Flashcard Engine',
        tagline: 'Collaborative flashcard synthesis & AI study group voice rooms for HackMIT 2026',
        description: 'StudyPulse is a student-first web application that turns lecture PDFs and lecture audio recordings into interactive spaced-repetition flashcards, collaborative quizzes, and AI-moderated study sessions. Built for HackMIT 2026 Education track.',
        category: 'Hackathon',
        hackathonName: 'HackMIT 2026',
        leader: alex._id,
        teamMembers: [
          { user: alex._id, role: 'Lead Full-Stack & AI' },
          { user: sophia._id, role: 'UI/UX Designer & Frontend' }
        ],
        requiredSkills: ['React', 'Python', 'PyTorch', 'Node.js', 'Tailwind CSS'],
        openRoles: [
          { role: 'Backend / Audio Pipeline Engineer', vacancies: 1, filled: 0 },
          { role: 'ML / RAG Specialist', vacancies: 1, filled: 0 }
        ],
        maxTeamSize: 4,
        status: 'Recruiting',
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        repoUrl: 'https://github.com/alexrivera-dev/studypulse-hackmit',
        demoUrl: 'https://studypulse-demo.vercel.app',
        tags: ['HackMIT', 'Education', 'GenAI', 'Voice AI']
      },
      {
        title: 'EcoRoute Campus — Micro-Mobility & Ride Sharing',
        tagline: 'Senior Capstone Project to optimize electric scooter & bike pooling across college campuses',
        description: 'EcoRoute connects verified students on campus traveling along similar corridors for eco-friendly commute pooling, real-time campus shuttle tracking, and battery station telemetry.',
        category: 'College Capstone',
        hackathonName: '',
        leader: priya._id,
        teamMembers: [
          { user: priya._id, role: 'Cloud & Backend Architect' },
          { user: elena._id, role: 'Mobile App Lead (Flutter)' }
        ],
        requiredSkills: ['Go', 'Flutter', 'PostgreSQL', 'Docker', 'AWS'],
        openRoles: [
          { role: 'Geospatial / Routing Algorithmist', vacancies: 1, filled: 0 },
          { role: 'Web Dashboard Specialist', vacancies: 1, filled: 0 }
        ],
        maxTeamSize: 4,
        status: 'Recruiting',
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        repoUrl: 'https://github.com/priyapatel-dev/ecoroute-campus',
        demoUrl: '',
        tags: ['Smart Mobility', 'Senior Capstone', 'Go', 'IoT']
      },
      {
        title: 'MedScribe — Clinical Notes Auto-Summarizer',
        tagline: 'Healthcare AI assistant competing in Global HealthTech Hackathon',
        description: 'Using specialized LLMs and privacy-preserving local embeddings to transcribe doctor-patient conversations into structured SOAP notes and patient discharge summaries with HIPAA compliance simulation.',
        category: 'Hackathon',
        hackathonName: 'Global HealthTech Hackathon',
        leader: marcus._id,
        teamMembers: [
          { user: marcus._id, role: 'ML / NLP Lead' }
        ],
        requiredSkills: ['Python', 'FastAPI', 'LangChain', 'React', 'Docker'],
        openRoles: [
          { role: 'Frontend React Developer', vacancies: 1, filled: 0 },
          { role: 'Security & Auth Engineer', vacancies: 1, filled: 0 }
        ],
        maxTeamSize: 3,
        status: 'Recruiting',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        repoUrl: 'https://github.com/marcus-ml/medscribe-ai',
        demoUrl: '',
        tags: ['HealthTech', 'LLMs', 'Hackathon']
      },
      {
        title: 'AlgoArena — Live Peer Coding Battles',
        tagline: 'Real-time 1v1 algorithm competition platform for college coding clubs',
        description: 'AlgoArena allows students to host automated live coding duels, solve test-case-driven data structures challenges, and track university leaderboards. Powered by isolated Docker sandbox execution workers.',
        category: 'Coding Competition',
        hackathonName: 'Inter-Collegiate HackFest',
        leader: david._id,
        teamMembers: [
          { user: david._id, role: 'Systems & Execution Engine Lead' }
        ],
        requiredSkills: ['C++', 'Rust', 'Docker', 'Node.js', 'WebSocket'],
        openRoles: [
          { role: 'Full-Stack Frontend Dev (React/Tailwind)', vacancies: 1, filled: 0 },
          { role: 'UI/UX Designer', vacancies: 1, filled: 0 }
        ],
        maxTeamSize: 3,
        status: 'Recruiting',
        deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        repoUrl: 'https://github.com/davidkim-cmu/algo-arena',
        demoUrl: '',
        tags: ['Competitive Programming', 'Rust', 'WebSockets']
      }
    ];

    const createdProjects = await Project.insertMany(projectsData);
    console.log(`Created ${createdProjects.length} projects.`);

    const [studyPulse, ecoRoute, medScribe] = createdProjects;

    // Seed sample Join Requests
    const requestsData = [
      {
        project: studyPulse._id,
        applicant: marcus._id,
        requestedRole: 'ML / RAG Specialist',
        message: 'Hey Alex! I have extensive experience building RAG architectures with LangChain and vector databases. Would love to handle the document parsing & vector indexing pipeline for StudyPulse!',
        portfolioLinks: 'https://github.com/marcus-ml, https://marcusj.io',
        status: 'pending'
      },
      {
        project: studyPulse._id,
        applicant: priya._id,
        requestedRole: 'Backend / Audio Pipeline Engineer',
        message: 'Hi Alex and Sophia! I can set up the high-throughput Node.js/Go audio chunking microservice with Redis caching for real-time speech processing.',
        portfolioLinks: 'https://github.com/priyapatel-dev',
        status: 'pending'
      },
      {
        project: medScribe._id,
        applicant: sophia._id,
        requestedRole: 'Frontend React Developer',
        message: 'Hey Marcus! I would love to build a clean, clinical UI with dark mode and accessible medical forms for MedScribe.',
        portfolioLinks: 'https://sophiachen.design',
        status: 'pending'
      }
    ];

    await JoinRequest.insertMany(requestsData);
    console.log('Created sample Join Requests.');

    // Seed sample messages for StudyPulse team
    const messagesData = [
      {
        project: studyPulse._id,
        sender: alex._id,
        content: 'Welcome Sophia to the StudyPulse team! Excited to build together for HackMIT 2026.'
      },
      {
        project: studyPulse._id,
        sender: sophia._id,
        content: 'Thanks Alex! I just uploaded initial Figma wireframes for the flashcard deck view and voice session room.'
      },
      {
        project: studyPulse._id,
        sender: alex._id,
        content: 'Awesome! I am working on the FastAPI endpoint to stream vector search embeddings. We are looking for 1 more backend engineer to round out the squad.'
      }
    ];

    await Message.insertMany(messagesData);
    console.log('Created sample team messages.');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  seedData();
}

module.exports = seedData;
