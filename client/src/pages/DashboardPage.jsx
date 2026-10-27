import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectAPI, requestAPI, userAPI, teamAPI } from '../services/api';
import {
  LayoutDashboard,
  Users,
  Compass,
  PlusCircle,
  Bell,
  Layers,
  Sparkles,
  Calendar,
  Award,
  ArrowRight,
  Clock,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import ProjectDetailModal from '../components/ProjectDetailModal';
import ApplyModal from '../components/ApplyModal';
import Toast from '../components/Toast';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [myProjects, setMyProjects] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [recommendedProjects, setRecommendedProjects] = useState([]);
  const [recommendedTeammates, setRecommendedTeammates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedProject, setSelectedProject] = useState(null);
  const [applyingProject, setApplyingProject] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const loadDashboardData = async () => {
      try {
        const [projRes, teamsRes, inReqRes, outReqRes, usersRes] = await Promise.all([
          projectAPI.getAll(),
          teamAPI.getMyTeams(),
          requestAPI.getIncoming(),
          requestAPI.getOutgoing(),
          userAPI.getAll()
        ]);

        const allProjects = projRes.data;
        const led = allProjects.filter(p => p.leader?._id === user._id || p.leader === user._id);
        setMyProjects(led);
        setMyTeams(teamsRes.data);
        setIncomingRequests(inReqRes.data);
        setOutgoingRequests(outReqRes.data);

        // Recommended projects: projects user is NOT part of, matching any user skill
        const userSkillsLower = (user.skills || []).map(s => s.toLowerCase());
        const otherProjects = allProjects.filter(p => {
          const isLead = p.leader?._id === user._id || p.leader === user._id;
          const isMem = p.teamMembers?.some(m => m.user?._id === user._id || m.user === user._id);
          return !isLead && !isMem;
        });

        const matchingProjects = otherProjects.filter(p =>
          p.requiredSkills?.some(s => userSkillsLower.includes(s.toLowerCase()))
        );
        setRecommendedProjects((matchingProjects.length > 0 ? matchingProjects : otherProjects).slice(0, 3));

        // Recommended teammates: other students
        const otherStudents = usersRes.data.filter(u => u._id !== user._id);
        setRecommendedTeammates(otherStudents.slice(0, 4));
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user, navigate]);

  if (!user) return null;

  const pendingIncoming = incomingRequests.filter(r => r.status === 'pending');
  const pendingOutgoing = outgoingRequests.filter(r => r.status === 'pending');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top Banner / Student Welcome Card */}
      <div className="bg-gradient-to-r from-brand-700 via-indigo-700 to-accent-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4 sm:space-x-5">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/40 shadow-lg"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Welcome back, {user.name}!
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/20 border border-white/30 text-white">
                  {user.availability || 'Looking for Team'}
                </span>
              </div>
              <p className="text-sm text-indigo-100 mt-1">
                {user.college} • {user.major} ({user.year})
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                {user.skills?.slice(0, 5).map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold bg-white/15 px-2.5 py-0.5 rounded-md text-white border border-white/20"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/create-project"
              className="flex items-center space-x-2 px-4 py-2.5 bg-white text-brand-700 hover:bg-slate-100 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4 text-brand-600" />
              <span>Post New Project</span>
            </Link>
            <Link
              to={`/profile/${user._id}`}
              className="flex items-center space-x-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm rounded-xl border border-white/20 transition-all"
            >
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <Link
          to="/my-teams"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-brand-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Teams</span>
            <Layers className="w-5 h-5 text-brand-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{myTeams.length}</p>
          <p className="text-xs text-slate-500 mt-1">Active squads</p>
        </Link>

        <Link
          to="/projects"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-brand-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Projects Led</span>
            <Sparkles className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{myProjects.length}</p>
          <p className="text-xs text-slate-500 mt-1">Created by you</p>
        </Link>

        <Link
          to="/requests"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-brand-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Join Requests</span>
            <Bell className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-extrabold text-amber-600">{pendingIncoming.length}</p>
          <p className="text-xs text-slate-500 mt-1">Pending approval</p>
        </Link>

        <Link
          to="/requests"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-brand-200 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Applications</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{pendingOutgoing.length}</p>
          <p className="text-xs text-slate-500 mt-1">Sent to teams</p>
        </Link>
      </div>

      {/* Main Grid: Recommended Projects (Left 2/3) + Upcoming Hackathons / Quick Teammates (Right 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recommended Projects for Your Skills */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recommended Projects for You</h2>
              <p className="text-xs text-slate-500">Matching your tech stack and interests</p>
            </div>
            <Link
              to="/projects"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(n => (
                <div key={n} className="h-44 rounded-2xl bg-slate-200 animate-pulse" />
              ))}
            </div>
          ) : recommendedProjects.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center">
              <p className="text-sm text-slate-600">No project recommendations right now.</p>
              <Link to="/create-project" className="text-xs font-bold text-brand-600 mt-2 inline-block">
                Be the first to post a new project!
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedProjects.map(project => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  onOpenDetails={(p) => setSelectedProject(p)}
                  onApply={(p) => setApplyingProject(p)}
                />
              ))}
            </div>
          )}

          {/* Pending Applications Quick Tracker */}
          {outgoingRequests.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Your Recent Applications Status</h3>
              <div className="space-y-2.5">
                {outgoingRequests.slice(0, 3).map(req => (
                  <div key={req._id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <p className="font-bold text-slate-800">{req.project?.title || 'Project'}</p>
                      <p className="text-[11px] text-slate-500">Applied for: {req.requestedRole}</p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                      req.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Recommended Teammates + Upcoming Deadlines */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Hackathon Deadlines Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-4 h-4 text-brand-600" />
              <h3 className="text-sm font-bold text-slate-900">Upcoming Hackathon Deadlines</h3>
            </div>
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-purple-900">HackMIT 2026</span>
                  <span className="text-[10px] font-semibold text-purple-600">In 14 Days</span>
                </div>
                <p className="text-[11px] text-purple-700 mt-1">StudyPulse squad is actively recruiting backend & ML engineers.</p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-900">Senior Capstone Showcase</span>
                  <span className="text-[10px] font-semibold text-emerald-600">In 30 Days</span>
                </div>
                <p className="text-[11px] text-emerald-700 mt-1">EcoRoute Campus micro-mobility team forming.</p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-900">Global HealthTech Hackathon</span>
                  <span className="text-[10px] font-semibold text-amber-600">In 7 Days</span>
                </div>
                <p className="text-[11px] text-amber-700 mt-1">MedScribe AI team looking for Frontend React builder.</p>
              </div>
            </div>
          </div>

          {/* Recommended Teammates Widget */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-brand-600" />
                <h3 className="text-sm font-bold text-slate-900">Students Looking for Teams</h3>
              </div>
              <Link to="/teammates" className="text-xs font-semibold text-brand-600 hover:underline">
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {recommendedTeammates.map(student => (
                <div key={student._id} className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <img
                      src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                      alt={student.name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <Link to={`/profile/${student._id}`} className="text-xs font-bold text-slate-800 hover:text-brand-600 block">
                        {student.name}
                      </Link>
                      <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{student.skills?.slice(0, 2).join(', ')}</p>
                    </div>
                  </div>
                  <Link
                    to={`/profile/${student._id}`}
                    className="text-[11px] font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    Connect
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onApply={(p) => setApplyingProject(p)}
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
