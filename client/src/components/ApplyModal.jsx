import React, { useState } from 'react';
import { X, Send, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { projectAPI } from '../services/api';

export default function ApplyModal({ project, isOpen, onClose, onSuccess }) {
  if (!isOpen || !project) return null;

  const [requestedRole, setRequestedRole] = useState(
    project.openRoles?.[0]?.role || 'Team Member'
  );
  const [message, setMessage] = useState('');
  const [portfolioLinks, setPortfolioLinks] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      setError('Please provide a short pitch or intro message.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await projectAPI.apply(project._id, {
        requestedRole,
        message,
        portfolioLinks
      });
      onSuccess?.('Your join request has been sent to the project lead!');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
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
          <span>Apply to Project</span>
        </div>

        <h2 className="text-xl font-extrabold text-slate-900 mb-1">
          Join {project.title}
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          Lead by <strong>{project.leader?.name}</strong> • {project.category}
        </p>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center space-x-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Role You Want to Fill
            </label>
            <select
              value={requestedRole}
              onChange={(e) => setRequestedRole(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {project.openRoles && project.openRoles.length > 0 ? (
                project.openRoles.map((r, i) => (
                  <option key={i} value={r.role}>
                    {r.role} ({Math.max(0, (r.vacancies || 1) - (r.filled || 0))} open)
                  </option>
                ))
              ) : (
                <option value="Contributor">General Contributor</option>
              )}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Why are you a good fit? (Pitch / Message)
            </label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Explain your relevant experience, technical skills, and what you're excited to contribute to this project..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Relevant Work Links (GitHub, Portfolio, Previous Projects)
            </label>
            <input
              type="text"
              value={portfolioLinks}
              onChange={(e) => setPortfolioLinks(e.target.value)}
              placeholder="e.g. github.com/username, devpost.com/entry, myportfolio.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
              className="flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl shadow-md shadow-brand-500/25 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>Sending...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Join Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
