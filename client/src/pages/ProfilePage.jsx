import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI, authAPI } from '../services/api';
import {
  User,
  GraduationCap,
  MapPin,
  Calendar,
  Github,
  Linkedin,
  Globe,
  Award,
  Edit3,
  Layers,
  Sparkles,
  Trophy,
  X,
  Plus,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import Toast from '../components/Toast';

export default function ProfilePage() {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState(null);

  // Edit form state
  const [editForm, setEditForm] = useState({
    name: '',
    college: '',
    major: '',
    year: '',
    bio: '',
    availability: '',
    github: '',
    linkedin: '',
    portfolio: ''
  });
  const [editSkills, setEditSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const targetId = id || currentUser?._id;
      if (!targetId) {
        navigate('/login');
        return;
      }
      const res = await userAPI.getById(targetId);
      setProfileData(res.data);

      // Populate edit form
      setEditForm({
        name: res.data.user.name || '',
        college: res.data.user.college || '',
        major: res.data.user.major || '',
        year: res.data.user.year || '',
        bio: res.data.user.bio || '',
        availability: res.data.user.availability || 'Looking for Team',
        github: res.data.user.github || '',
        linkedin: res.data.user.linkedin || '',
        portfolio: res.data.user.portfolio || ''
      });
      setEditSkills(res.data.user.skills || []);
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id, currentUser]);

  const isOwnProfile = currentUser && profileData && currentUser._id === profileData.user._id;

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setEditError('');

    try {
      const res = await authAPI.updateProfile({
        ...editForm,
        skills: editSkills
      });
      updateUser(res.data.user);
      setIsEditing(false);
      setToast({ message: 'Profile updated and saved to MongoDB!', type: 'success' });
      fetchProfile();
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() && !editSkills.includes(newSkillInput.trim())) {
      setEditSkills([...editSkills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setEditSkills(editSkills.filter(s => s !== skill));
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500">Loading student profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Student not found</h2>
        <Link to="/teammates" className="text-sm font-semibold text-brand-600 mt-2 inline-block">
          Return to Teammates Directory
        </Link>
      </div>
    );
  }

  const { user: student, createdProjects = [], joinedProjects = [] } = profileData;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Profile Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Decorative Top Gradient */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-500 relative">
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Content Container */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
            <div className="flex items-end space-x-4 sm:space-x-5">
              <img
                src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={student.name}
                className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-xl bg-white"
              />
              <div className="pb-1">
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {student.name}
                  </h1>
                </div>
                <p className="text-sm font-semibold text-brand-600 mt-0.5">
                  {student.college}
                </p>
                <p className="text-xs text-slate-500">
                  {student.major} • {student.year}
                </p>
              </div>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-3 w-full sm:w-auto">
              {isOwnProfile ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <span className="text-xs font-semibold px-3 py-1.5 rounded-xl border bg-slate-50 text-slate-700 border-slate-200">
                  Status: <strong>{student.availability}</strong>
                </span>
              )}
            </div>
          </div>

          {/* Bio & Availability Pill */}
          <div className="mb-6 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{student.availability || 'Looking for Team'}</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed max-w-3xl">
              {student.bio || 'Passionate student developer excited to collaborate on real-world projects, hackathons, and software architecture.'}
            </p>
          </div>

          {/* Badges showcase */}
          {student.badges && student.badges.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Verified Badges & Accolades</p>
              <div className="flex flex-wrap gap-2">
                {student.badges.map((badge, i) => (
                  <span
                    key={i}
                    className="flex items-center space-x-1.5 text-xs font-bold px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills Grid */}
          <div className="mb-6">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Skills & Technologies</p>
            <div className="flex flex-wrap gap-2">
              {student.skills?.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-100 flex-wrap">
            {student.github && (
              <a
                href={student.github.startsWith('http') ? student.github : `https://${student.github}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Profile</span>
              </a>
            )}
            {student.linkedin && (
              <a
                href={student.linkedin.startsWith('http') ? student.linkedin : `https://${student.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-xl border border-blue-200 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn Profile</span>
              </a>
            )}
            {student.portfolio && (
              <a
                href={student.portfolio.startsWith('http') ? student.portfolio : `https://${student.portfolio}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-2 text-xs font-semibold text-brand-700 hover:text-brand-900 bg-brand-50 hover:bg-brand-100 px-3.5 py-2 rounded-xl border border-brand-200 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>Portfolio Website</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Projects Section: Projects Created by this student */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-brand-600" />
          <h2 className="text-xl font-bold text-slate-900">
            Projects Led by {student.name.split(' ')[0]} ({createdProjects.length})
          </h2>
        </div>

        {createdProjects.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No projects published yet by this student.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {createdProjects.map(proj => (
              <ProjectCard
                key={proj._id}
                project={proj}
                onOpenDetails={() => {}}
                onApply={() => {}}
              />
            ))}
          </div>
        )}
      </div>

      {/* Projects Section: Projects Joined / Contributed To */}
      {joinedProjects.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">
              Teams & Collaborations ({joinedProjects.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {joinedProjects.map(proj => (
              <ProjectCard
                key={proj._id}
                project={proj}
                onOpenDetails={() => {}}
                onApply={() => {}}
              />
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-extrabold text-slate-900 mb-1">
              Edit Your Profile
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Updates your profile live in MongoDB Community Server
            </p>

            {editError && (
              <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{editError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Availability Status
                  </label>
                  <select
                    value={editForm.availability}
                    onChange={(e) => setEditForm({ ...editForm, availability: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Looking for Team">Looking for Team</option>
                    <option value="Open to Offers">Open to Offers</option>
                    <option value="Busy with Projects">Busy with Projects</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    College / University
                  </label>
                  <input
                    type="text"
                    value={editForm.college}
                    onChange={(e) => setEditForm({ ...editForm, college: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Major
                  </label>
                  <input
                    type="text"
                    value={editForm.major}
                    onChange={(e) => setEditForm({ ...editForm, major: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Year
                  </label>
                  <select
                    value={editForm.year}
                    onChange={(e) => setEditForm({ ...editForm, year: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Master's">Master's</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Bio / About
                </label>
                <textarea
                  rows={3}
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>

              {/* Skills edit */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Skills
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill();
                      }
                    }}
                    placeholder="Type skill & press Add"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {editSkills.map((s, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1 bg-brand-50 text-brand-700 border border-brand-200 px-2.5 py-1 rounded-lg text-xs font-medium">
                      <span>{s}</span>
                      <button type="button" onClick={() => handleRemoveSkill(s)}>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">GitHub</label>
                  <input
                    type="text"
                    value={editForm.github}
                    onChange={(e) => setEditForm({ ...editForm, github: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">LinkedIn</label>
                  <input
                    type="text"
                    value={editForm.linkedin}
                    onChange={(e) => setEditForm({ ...editForm, linkedin: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Portfolio</label>
                  <input
                    type="text"
                    value={editForm.portfolio}
                    onChange={(e) => setEditForm({ ...editForm, portfolio: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
