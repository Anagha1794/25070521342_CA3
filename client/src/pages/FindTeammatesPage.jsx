import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Users, Sparkles, Filter, X, Award } from 'lucide-react';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import StudentCard from '../components/StudentCard';
import InviteModal from '../components/InviteModal';
import Toast from '../components/Toast';

export default function FindTeammatesPage() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [availability, setAvailability] = useState('All');
  const [skillFilter, setSkillFilter] = useState(searchParams.get('skill') || '');

  const [invitingStudent, setInvitingStudent] = useState(null);
  const [toast, setToast] = useState(null);

  const popularSkills = [
    'React', 'Python', 'PyTorch', 'Figma', 'Node.js', 'Go', 'Flutter', 'TypeScript', 'Rust', 'Docker'
  ];

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (availability && availability !== 'All') params.availability = availability;
      if (skillFilter) params.skill = skillFilter;

      const res = await userAPI.getAll(params);
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [availability, skillFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStudents();
  };

  const handleInviteClick = (student) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setInvitingStudent(student);
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

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Student Talent Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Find Teammates by Skills & Passion
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Discover fellow college developers, designers, and innovators ready to team up
          </p>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name, college, major, or bio keywords..."
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

        {/* Availability Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['All', 'Looking for Team', 'Open to Offers', 'Busy with Projects'].map((status) => (
            <button
              key={status}
              onClick={() => setAvailability(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                availability === status
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Skill filter chips */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Filter by Skill:</span>
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

      {/* Students Directory Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-80 rounded-2xl bg-slate-200 animate-pulse" />
          ))}
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No students found matching your criteria</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Try adjusting your search terms or clearing the skill and availability filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <StudentCard
              key={student._id}
              student={student}
              onInvite={(s) => handleInviteClick(s)}
            />
          ))}
        </div>
      )}

      {/* Invite Modal */}
      <InviteModal
        student={invitingStudent}
        isOpen={!!invitingStudent}
        onClose={() => setInvitingStudent(null)}
        onSuccess={(msg) => setToast({ message: msg, type: 'success' })}
      />
    </div>
  );
}
