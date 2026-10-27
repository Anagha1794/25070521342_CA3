# FindMyTeam — Student Collaboration & Team Finder Platform

FindMyTeam is a full-stack platform designed specifically for college students to discover teammates based on skills, explore and create projects, and form winning teams for hackathons, coding competitions, and capstones.

---

## 🚀 Technology Stack

- **Frontend (`client/`)**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Router v6.
- **Backend (`server/`)**: Node.js, Express, Mongoose (ODM), JWT Authentication, Bcrypt.js, CORS.
- **Database**: MongoDB Community Server 9.0 (compatible with MongoDB Compass on `mongodb://127.0.0.1:27017/findmyteam`).

---

## 📁 Project Architecture & Directory Structure

```text
25070521342/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, ProjectCard, StudentCard, ApplyModal, InviteModal, Toast
│   │   ├── context/            # AuthContext (JWT session management)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx             # Landing page with stats, trending skills & previews
│   │   │   ├── LoginPage.jsx            # Sign in with demo account shortcuts
│   │   │   ├── RegisterPage.jsx         # Create account storing student records in MongoDB
│   │   │   ├── DashboardPage.jsx        # Personalized metrics, project & teammate recommendations
│   │   │   ├── ExploreProjectsPage.jsx  # Search & filters for hackathons, capstones, tech stack
│   │   │   ├── CreateProjectPage.jsx    # Project creator with open roles builder & live preview
│   │   │   ├── FindTeammatesPage.jsx    # Student directory with skill & availability filters
│   │   │   ├── ProfilePage.jsx          # Student profile, badges, skills & live edit modal
│   │   │   ├── JoinRequestsPage.jsx     # Accept/Decline incoming requests & application tracker
│   │   │   └── MyTeamsPage.jsx          # Team workspace with roster & real-time chat board
│   │   ├── services/           # Axios API service endpoints
│   │   ├── App.jsx             # Router configuration with protected routes
│   │   ├── main.jsx            # React root
│   │   └── index.css           # Tailwind CSS directives
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── middleware/             # JWT auth middleware
│   ├── models/                 # Mongoose schemas: User, Project, JoinRequest, Message
│   ├── routes/                 # Express API routes (auth, projects, requests, users, teams)
│   ├── .env                    # Environment variables (PORT=5000, MONGODB_URI, JWT_SECRET)
│   ├── seed.js                 # Seed script with realistic students and hackathon projects
│   ├── server.js               # Express entrypoint
│   └── package.json
│
└── README.md
```

---

## 🗄️ MongoDB Community Server & Compass Setup

### Connection Details
- **Connection URI**: `mongodb://127.0.0.1:27017/findmyteam`
- **MongoDB Server Status**: Installed & active at `C:\Program Files\MongoDB\Server\9.0\bin\mongod.exe`
- **Compass Compatibility**: Fully compatible. Open MongoDB Compass, paste `mongodb://127.0.0.1:27017/findmyteam` in the connection string input, and click **Connect**.

### Database Collections:
1. `users` — Student accounts, hashed passwords, skills, college, major, year, bio, links, and badges.
2. `projects` — Hackathon, capstone, and competition projects with open roles and member rosters.
3. `joinrequests` — Applications submitted by students to join projects with pitch messages and roles.
4. `messages` — Chat messages exchanged in project team workspaces.

---

## ⚡ How to Run the Application

### 1. Start the Backend Server (Port 5000)
Open a terminal in `25070521342/server`:
```bash
cd 25070521342/server
npm start
```
*The server will connect to MongoDB and listen on `http://localhost:5000`.*

### 2. Start the Frontend Client (Port 5173)
Open a second terminal in `25070521342/client`:
```bash
cd 25070521342/client
npm run dev
```
*Open your browser and navigate to `http://localhost:5173`.*

### 3. (Optional) Re-seed Sample Data
If you want to reset the database to sample student profiles and hackathons:
```bash
cd 25070521342/server
npm run seed
```

---

## 🔑 Pre-Configured Demo Accounts (Password: `password123`)

| Student Name | Email Address | College & Role |
| :--- | :--- | :--- |
| **Alex Rivera** | `alex@stanford.edu` | Stanford University • Team Lead (StudyPulse) |
| **Sophia Chen** | `sophia@mit.edu` | MIT • UI/UX Designer |
| **Marcus Johnson** | `marcus@berkeley.edu` | UC Berkeley • ML / NLP Researcher |
| **Priya Patel** | `priya@gatech.edu` | Georgia Tech • Cloud & Backend Lead (EcoRoute) |
| **David Kim** | `david@cmu.edu` | Carnegie Mellon University • Systems Engineer |
| **Elena Rostova** | `elena@columbia.edu` | Columbia University • Mobile Developer |

*(You can also click the quick-fill demo buttons on the Login page or create a brand new account on the Register page).*

---

## 🌟 Key Features

1. **Authentication & Persistence**:
   - Create student account with custom technical skill chips, college, and social links.
   - Password encrypted with bcrypt.
   - JWT sessions with local storage persistence.
2. **Interactive Explore Projects**:
   - Filter by category (Hackathon, College Capstone, Side Project, Coding Competition, Open Source).
   - Filter by tech stack (React, Python, Go, PyTorch, Figma, etc.).
   - Live modal to inspect details and apply for open positions.
3. **Project Creator with Live Preview**:
   - Visual roles builder with vacancy counts and skill requirements.
   - Real-time preview card mirroring how the listing will look in the public directory.
4. **Student Talent Directory**:
   - Filter teammates by skill, availability status, or college.
   - Send direct project invitations via modal.
5. **Team Workspace & Chat Board**:
   - Dedicated dashboard for every squad you lead or participate in.
   - Live team discussion board where messages are persisted in MongoDB.
6. **Join Requests Management**:
   - Accept or decline incoming student applications.
   - Accepting automatically updates the project's roster and open role counts in MongoDB.

# 25070521342_CA3
