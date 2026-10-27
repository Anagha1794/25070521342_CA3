import React, { useState, useEffect } from 'react';
import { X, Send, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { projectAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function InviteModal({ student, isOpen, onClose, onSuccess }) {
  if (!isOpen || !student) return null;

  const { user } = useAuth();
  const [myProjects, setMyProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [roleInvite, setRoleInvite] = useState('Contributor');
  const [inviteMessage, setInviteMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingProjects, setFetchingProjects] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      projectAPI.getAll()
        .then(res => {
          // Filter projects where current user is leader
          const ledProjects = res.data.filter(p => p.leader?._id === user._id || p.leader === user._id);
          setMyProjects(ledProjects);
          if (ledProjects.length > 0) {
            setSelectedProjectId(ledProjects[0]._id);
          }
        })
        .catch(err => {
          console.error(err);
        })
        .finally(() => setFetchingProjects(false));
    }
  }, [user]);

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError('Please select one of your projects or post a new project first.');
      return;
    }

    setLoading(true);
    // In our prototype, invitation can trigger a toast notification or simulate direct outreach
    setTimeout(() => {
      setLoading(false);
      onSuccess?.(`Invitation to join sent to ${student.name}!`);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Team Invite</span>
        </div>

        <h2 className="text-xl font-extrabold text-slate-900 mb-1">
          Invite {student.name}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          {student.college} • {student.major} ({student.year})
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {fetchingProjects ? (
          <div className="py-8 text-center text-xs text-slate-400">Loading your projects...</div>
        ) : myProjects.length === 0 ? (
          <div className="py-6 text-center space-y-3">
            <p className="text-sm text-slate-600">You haven't posted any projects yet to invite teammates to.</p>
            <a
              href="/create-project"
              className="inline-block text-xs font-bold px-4 py-2 bg-brand-600 text-white rounded-xl shadow-md"
            >
              Post a Project First
            </a>
          </div>
        ) : (
          <form onSubmit={handleSendInvite} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Your Project
              </label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {myProjects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title} ({p.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Suggested Role
              </label>
              <input
                type="text"
                value={roleInvite}
                onChange={(e) => setRoleInvite(e.target.value)}
                placeholder="e.g. Frontend Engineer, ML Specialist, UI/UX Designer"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Personalized Invitation Note
              </label>
              <textarea
                rows={3}
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder={`Hey ${student.name.split(' ')[0]}, saw your background in ${student.skills?.[0] || 'tech'} and would love to build our project together!`}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl shadow-md shadow-brand-500/25 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Sending...' : 'Send Invitation'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
