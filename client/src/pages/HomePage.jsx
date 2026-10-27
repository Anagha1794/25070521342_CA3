import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Compass,
  Sparkles,
  Trophy,
  ArrowRight,
  Code2,
  CheckCircle,
  Zap,
  Globe,
  Database,
  Search,
  Flame,
  Star
} from 'lucide-react';
import { projectAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import ProjectDetailModal from '../components/ProjectDetailModal';
import ApplyModal from '../components/ApplyModal';
import Toast from '../components/Toast';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [featuredStudents, setFeaturedStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [applyingProject, setApplyingProject] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, usersRes] = await Promise.all([
          projectAPI.getAll(),
          userAPI.getAll()
        ]);
        setFeaturedProjects(projRes.data.slice(0, 3));
        setFeaturedStudents(usersRes.data.slice(0, 4));
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApplyClick = (project) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setApplyingProject(project);
  };

  const trendingSkills = [
    'React', 'Python', 'PyTorch', 'Node.js', 'Figma', 'TypeScript', 'Tailwind CSS', 'Docker', 'Go', 'Flutter'
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-20 overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-brand-300/30 via-indigo-200/20 to-accent-300/30 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/60 text-brand-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-xs">
            <Sparkles className="w-4 h-4 text-brand-500" />
            <span>Form Your Dream Hackathon & Capstone Squad</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] max-w-4xl mx-auto mb-6">
            Discover Teammates by Skills. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-500 bg-clip-text text-transparent">
              Build Hackathons & Projects That Win.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            FindMyTeam bridges the gap between passionate student developers, UI/UX designers, and ML researchers across universities to create winning teams.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-14">
            <Link
              to="/projects"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-xl hover:shadow-brand-500/30 transition-all transform hover:-translate-y-0.5"
            >
              <Compass className="w-5 h-5" />
              <span>Explore Projects</span>
            </Link>

            <Link
              to="/teammates"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-7 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-xl border border-slate-200 shadow-sm hover:shadow transition-all"
            >
              <Users className="w-5 h-5 text-slate-500" />
              <span>Find Teammates</span>
            </Link>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-sm">
            <div className="text-center p-2">
              <p className="text-3xl font-extrabold text-brand-600">500+</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Verified Students</p>
            </div>
            <div className="text-center p-2 border-l border-slate-100">
              <p className="text-3xl font-extrabold text-indigo-600">120+</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Active Projects</p>
            </div>
            <div className="text-center p-2 border-l border-slate-100">
              <p className="text-3xl font-extrabold text-accent-500">45+</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Hackathon Podiums</p>
            </div>
            <div className="text-center p-2 border-l border-slate-100">
              <p className="text-3xl font-extrabold text-emerald-600">100%</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Free for Students</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Skills Search Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-accent-400 text-xs font-bold uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-accent-400" />
              <span>In-Demand Skills Right Now</span>
            </div>
            <h3 className="text-xl font-bold">Discover squads looking for your exact tech stack</h3>
          </div>

          <div className="flex flex-wrap gap-2 justify-center md:justify-end max-w-xl">
            {trendingSkills.map((skill, idx) => (
              <Link
                key={idx}
                to={`/projects?skill=${encodeURIComponent(skill)}`}
                className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg border border-white/10 text-slate-200 hover:text-white transition-colors"
              >
                #{skill}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center space-x-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4" />
              <span>Active Opportunities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Projects Recruiting Members
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Teams currently looking for developers, designers, and researchers.
            </p>
          </div>

          <Link
            to="/projects"
            className="flex items-center space-x-1.5 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                onOpenDetails={(p) => setSelectedProject(p)}
                onApply={(p) => handleApplyClick(p)}
              />
            ))}
          </div>
        )}
      </section>

      {/* How FindMyTeam Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200 mb-3">
            <Zap className="w-4 h-4" />
            <span>Seamless Workflow</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            How It Works in 3 Simple Steps
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            From discovering hackathon ideas to coordinating with your squad in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all text-center relative group">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-extrabold text-xl mb-6 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Create Your Profile</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Showcase your technical skills (React, Python, Figma, etc.), university background, GitHub links, and hackathon experience.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all text-center relative group">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold text-xl mb-6 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Find or Post a Project</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Filter projects by hackathon name, tech stack, and open vacancies, or post your own project and specify roles needed.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all text-center relative group">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-accent-100 text-accent-700 flex items-center justify-center font-extrabold text-xl mb-6 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Collaborate in Real-Time</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Accept join requests, coordinate team roles, exchange repo links, and chat directly in your private Team Workspace.
            </p>
          </div>
        </div>
      </section>

      {/* Database Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 border border-slate-800 text-white relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Database className="w-4 h-4" />
                <span>MongoDB Community Server & Compass Compatible</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">
                Live Data Persistence with MongoDB Community Server
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                All registered student accounts, project postings, applications, and team workspace messages are permanently stored in your local MongoDB Community Server on port 27017 and can be inspected in MongoDB Compass.
              </p>
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 font-mono text-xs text-indigo-300 select-all max-w-fit">
                URI: mongodb://127.0.0.1:27017/findmyteam
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <Link
                to="/register"
                className="w-full text-center px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg transition-colors"
              >
                Create Student Account
              </Link>
              <Link
                to="/projects"
                className="w-full text-center px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition-colors"
              >
                Browse All Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onApply={(p) => handleApplyClick(p)}
      />

      <ApplyModal
        project={applyingProject}
        isOpen={!!applyingProject}
        onClose={() => setApplyingProject(null)}
        onSuccess={(msg) => setToast({ message: msg, type: 'success' })}
      />
    </div>
  );
}
