import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { projectAPI } from '../services/api';
import {
  PlusCircle,
  Sparkles,
  Trophy,
  Calendar,
  Users,
  X,
  Plus,
  Github,
  Globe,
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import ProjectCard from '../components/ProjectCard';

export default function CreateProjectPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    description: '',
    category: 'Hackathon',
    hackathonName: 'HackMIT 2026',
    maxTeamSize: 4,
    deadline: '',
    repoUrl: '',
    demoUrl: ''
  });

  const [skills, setSkills] = useState(['React', 'Node.js', 'Tailwind CSS']);
  const [skillInput, setSkillInput] = useState('');

  const [openRoles, setOpenRoles] = useState([
    { role: 'Frontend Engineer', vacancies: 1, filled: 0 },
    { role: 'Backend / API Engineer', vacancies: 1, filled: 0 }
  ]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleVacancies, setNewRoleVacancies] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const popularSkills = [
    'React', 'Python', 'Node.js', 'PyTorch', 'Figma', 'TypeScript',
    'Tailwind CSS', 'Docker', 'MongoDB', 'Go', 'Flutter', 'C++', 'Rust', 'GraphQL'
  ];

  const handleAddSkill = (skillToAdd) => {
    const trimmed = (skillToAdd || skillInput).trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddRole = () => {
    if (newRoleName.trim()) {
      setOpenRoles([
        ...openRoles,
        { role: newRoleName.trim(), vacancies: Number(newRoleVacancies) || 1, filled: 0 }
      ]);
      setNewRoleName('');
      setNewRoleVacancies(1);
    }
  };

  const handleRemoveRole = (index) => {
    setOpenRoles(openRoles.filter((_, idx) => idx !== index));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!formData.title.trim() || !formData.tagline.trim() || !formData.description.trim()) {
      setError('Please provide title, tagline, and project description.');
      return;
    }

    if (skills.length === 0) {
      setError('Please list at least one required skill or tech stack tag.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await projectAPI.create({
        ...formData,
        requiredSkills: skills,
        openRoles
      });
      navigate('/projects');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  // Live preview mockup object
  const previewProject = {
    _id: 'preview',
    title: formData.title || 'Your Project Title Here',
    tagline: formData.tagline || 'A snappy one-line summary of what you are building...',
    description: formData.description || 'Detailed description of your hackathon or capstone project concept, problems solved, and team vision.',
    category: formData.category,
    hackathonName: formData.hackathonName,
    leader: user || { name: 'Your Name', college: 'Your College', avatar: '' },
    teamMembers: [{ user: user || { name: 'You' }, role: 'Project Lead' }],
    requiredSkills: skills,
    openRoles: openRoles,
    maxTeamSize: formData.maxTeamSize,
    status: 'Recruiting',
    deadline: formData.deadline || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Launch a Team</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Create & Post a New Project
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Specify your team vacancies, tech stack, and goals to attract the best student collaborators
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center space-x-3 text-rose-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Form on Left, Live Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Container (8 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
                1. Project Overview
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. CodeNexus — AI Autonomous Code Reviewer"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tagline / Short Pitch *
                </label>
                <input
                  type="text"
                  name="tagline"
                  required
                  value={formData.tagline}
                  onChange={handleChange}
                  placeholder="e.g. Real-time multi-agent linting & AST security scanning for HackMIT"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Hackathon">Hackathon</option>
                    <option value="College Capstone">College Capstone</option>
                    <option value="Side Project">Side Project</option>
                    <option value="Coding Competition">Coding Competition</option>
                    <option value="Open Source">Open Source</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Hackathon / Competition Name
                  </label>
                  <input
                    type="text"
                    name="hackathonName"
                    value={formData.hackathonName}
                    onChange={handleChange}
                    placeholder="e.g. HackMIT, ETHGlobal, PennApps"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  rows={4}
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Explain the problem statement, user workflows, target deliverables, and what makes your project compelling..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>
            </div>

            {/* Tech Stack & Required Skills */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
                2. Tech Stack & Required Skills
              </h3>

              <div>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="e.g. PyTorch, React, Go, Figma, Docker"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddSkill()}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                  >
                    Add Skill
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-200"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-brand-900"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1">
                  {popularSkills.filter(s => !skills.includes(s)).slice(0, 8).map((s, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAddSkill(s)}
                      className="text-[11px] bg-slate-50 hover:bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200 transition-colors"
                    >
                      + {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Positions Needed & Logistics */}
            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-100">
                3. Open Roles & Squad Size
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Target Squad Size
                  </label>
                  <input
                    type="number"
                    min="2"
                    max="10"
                    name="maxTeamSize"
                    value={formData.maxTeamSize}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Submission / Target Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Roles Builder */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Open Roles to Recruit
                </label>
                <div className="space-y-2 mb-3">
                  {openRoles.map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div>
                        <span className="font-bold text-slate-800">{r.role}</span>
                        <span className="text-slate-500 ml-2">({r.vacancies} open)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(idx)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Role Title (e.g. AI Prompt Engineer, UI Designer)"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={newRoleVacancies}
                    onChange={(e) => setNewRoleVacancies(e.target.value)}
                    className="w-16 px-3 py-2 text-xs rounded-xl border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddRole}
                    className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    GitHub Repo URL (Optional)
                  </label>
                  <input
                    type="text"
                    name="repoUrl"
                    value={formData.repoUrl}
                    onChange={handleChange}
                    placeholder="github.com/myteam/project"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Demo / Pitch Deck URL (Optional)
                  </label>
                  <input
                    type="text"
                    name="demoUrl"
                    value={formData.demoUrl}
                    onChange={handleChange}
                    placeholder="project-demo.vercel.app"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-brand-500/25 transition-all disabled:opacity-50"
            >
              <PlusCircle className="w-5 h-5" />
              <span>{loading ? 'Publishing to MongoDB...' : 'Publish Project & Start Recruiting'}</span>
            </button>
          </form>
        </div>

        {/* Live Card Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4 sticky top-24">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
            <Eye className="w-4 h-4" />
            <span>Live Project Card Preview</span>
          </div>

          <ProjectCard
            project={previewProject}
            onOpenDetails={() => {}}
            onApply={() => {}}
          />

          <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-100 text-xs text-brand-900 leading-relaxed">
            <p className="font-bold flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-4 h-4 text-brand-600" />
              <span>Team Leader Perks</span>
            </p>
            As the creator, you will automatically be assigned as Team Lead. You will receive real-time join applications in your <strong>Join Requests</strong> inbox to accept or decline.
          </div>
        </div>
      </div>
    </div>
  );
}
