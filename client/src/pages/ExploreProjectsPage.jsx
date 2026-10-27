import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Search, Filter, PlusCircle, Sparkles, X, Trophy, Layers } from 'lucide-react';
import { projectAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProjectCard from '../components/ProjectCard';
import ProjectDetailModal from '../components/ProjectDetailModal';
import ApplyModal from '../components/ApplyModal';
import Toast from '../components/Toast';

export default function ExploreProjectsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [skillFilter, setSkillFilter] = useState(searchParams.get('skill') || '');
  const [statusFilter, setStatusFilter] = useState('All');

  const [selectedProject, setSelectedProject] = useState(null);
  const [applyingProject, setApplyingProject] = useState(null);
  const [toast, setToast] = useState(null);

  const categories = [
    'All',
    'Hackathon',
    'College Capstone',
    'Side Project',
    'Coding Competition',
    'Open Source'
  ];

  const popularSkills = [
    'React', 'Python', 'Node.js', 'PyTorch', 'Figma', 'TypeScript', 'Go', 'Flutter', 'Rust', 'Docker'
  ];

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category && category !== 'All') params.category = category;
      if (search) params.search = search;
      if (skillFilter) params.skill = skillFilter;
      if (statusFilter && statusFilter !== 'All') params.status = statusFilter;

      const res = await projectAPI.getAll(params);
      setProjects(res.data);
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [category, skillFilter, statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleApplyClick = (project) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setApplyingProject(project);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header and Call to Action */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Discover Team Opportunities</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore College & Hackathon Projects
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Find existing teams recruiting members or launch your own project squad
          </p>
        </div>

        <Link
          to="/create-project"
          className="flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm rounded-xl shadow-md shadow-brand-500/25 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Project</span>
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by project title, hackathon name, tech stack, or description..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-colors"
          >
            Search
          </button>
        </form>

        {/* Categories Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                category === cat
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Skill filter chips */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Filter by Tech:</span>
          {popularSkills.map((sk) => {
            const isSelected = skillFilter.toLowerCase() === sk.toLowerCase();
            return (
              <button
                key={sk}
                onClick={() => setSkillFilter(isSelected ? '' : sk)}
                className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {sk}
              </button>
            );
          })}
          {skillFilter && (
            <button
              onClick={() => setSkillFilter('')}
              className="text-xs text-rose-600 font-semibold flex items-center space-x-1 ml-2 hover:underline"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filter</span>
            </button>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No projects found matching your criteria</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try adjusting your search terms, changing the category, or clearing the tech filters.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setCategory('All');
              setSkillFilter('');
              setStatusFilter('All');
            }}
            className="px-4 py-2 bg-brand-50 text-brand-700 font-bold text-xs rounded-xl hover:bg-brand-100 transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onOpenDetails={(p) => setSelectedProject(p)}
              onApply={(p) => handleApplyClick(p)}
            />
          ))}
        </div>
      )}

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
        onSuccess={(msg) => {
          setToast({ message: msg, type: 'success' });
          fetchProjects();
        }}
      />
    </div>
  );
}
