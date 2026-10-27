import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { requestAPI } from '../services/api';
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  ExternalLink,
  Users,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import Toast from '../components/Toast';

export default function JoinRequestsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' | 'outgoing'
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [inRes, outRes] = await Promise.all([
        requestAPI.getIncoming(),
        requestAPI.getOutgoing()
      ]);
      setIncoming(inRes.data);
      setOutgoing(outRes.data);
    } catch (err) {
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchRequests();
  }, [user]);

  const handleUpdateStatus = async (requestId, newStatus) => {
    setActionLoading(requestId);
    try {
      await requestAPI.updateStatus(requestId, newStatus);
      setToast({
        message: `Application ${newStatus} successfully! Team roster updated in MongoDB.`,
        type: 'success'
      });
      fetchRequests();
    } catch (err) {
      setToast({
        message: err.response?.data?.message || `Failed to update request.`,
        type: 'error'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const pendingIncoming = incoming.filter(r => r.status === 'pending');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>Collaboration Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Team Join Requests & Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review incoming student applications for your projects and track your own requests
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('incoming')}
          className={`flex items-center space-x-2 pb-3 px-2 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'incoming'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>Incoming Requests for Your Projects</span>
          {pendingIncoming.length > 0 && (
            <span className="px-2 py-0.5 text-xs font-bold bg-amber-500 text-white rounded-full">
              {pendingIncoming.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('outgoing')}
          className={`flex items-center space-x-2 pb-3 px-2 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'outgoing'
              ? 'border-brand-600 text-brand-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span>Your Outgoing Applications</span>
          <span className="px-2 py-0.5 text-xs font-semibold bg-slate-100 text-slate-600 rounded-full">
            {outgoing.length}
          </span>
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-32 bg-slate-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : activeTab === 'incoming' ? (
        /* Tab 1: Incoming Requests */
        incoming.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No incoming applications yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              When students apply to join your projects, their applications with skills and pitch messages will show up here.
            </p>
            <Link
              to="/create-project"
              className="inline-block px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Post a New Project
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {incoming.map(req => {
              const applicant = req.applicant || {};
              const project = req.project || {};
              const isPending = req.status === 'pending';

              return (
                <div
                  key={req._id}
                  className={`bg-white rounded-3xl p-6 border shadow-xs transition-all ${
                    isPending ? 'border-brand-200 shadow-brand-500/5' : 'border-slate-200 opacity-85'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
                    {/* Applicant details */}
                    <div className="flex items-center space-x-4">
                      <img
                        src={applicant.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                        alt={applicant.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/profile/${applicant._id}`}
                            className="text-base font-bold text-slate-900 hover:text-brand-600 hover:underline"
                          >
                            {applicant.name}
                          </Link>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Role: {req.requestedRole}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {applicant.college} • {applicant.major} ({applicant.year})
                        </p>
                      </div>
                    </div>

                    {/* Status Pill / Project Ref */}
                    <div className="flex items-center space-x-3">
                      <div className="text-right hidden sm:block">
                        <p className="text-[11px] text-slate-400">Applying for Project:</p>
                        <p className="text-xs font-bold text-slate-800">{project.title}</p>
                      </div>
                      <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        req.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                        req.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                  </div>

                  {/* Message / Pitch */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4 text-xs text-slate-700 leading-relaxed">
                    <p className="font-bold text-slate-900 mb-1">Applicant's Pitch:</p>
                    <p className="whitespace-pre-line">{req.message}</p>
                    {req.portfolioLinks && (
                      <p className="mt-2 text-[11px] text-brand-600 font-medium">
                        Portfolio / Links: {req.portfolioLinks}
                      </p>
                    )}
                  </div>

                  {/* Skills */}
                  {applicant.skills && applicant.skills.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap mb-4">
                      <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Skills:</span>
                      {applicant.skills.map((s, idx) => (
                        <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions Bar */}
                  {isPending ? (
                    <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                      <button
                        onClick={() => handleUpdateStatus(req._id, 'rejected')}
                        disabled={actionLoading === req._id}
                        className="flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Decline</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(req._id, 'accepted')}
                        disabled={actionLoading === req._id}
                        className="flex items-center space-x-1.5 px-5 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Accept & Add to Team Roster</span>
                      </button>
                    </div>
                  ) : (
                    <div className="text-right text-[11px] text-slate-400 italic">
                      Application was {req.status} on {new Date(req.updatedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Tab 2: Outgoing Applications */
        outgoing.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-3">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Send className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">You haven't applied to any projects yet</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Browse available hackathon and capstone projects and apply with your preferred role.
            </p>
            <Link
              to="/projects"
              className="inline-block px-4 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl shadow-md"
            >
              Browse Projects
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {outgoing.map(req => {
              const project = req.project || {};
              const leader = project.leader || {};

              return (
                <div key={req._id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-slate-900">{project.title || 'Project'}</h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {project.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Team Lead: <strong>{leader.name || 'Student'}</strong> ({leader.college})
                    </p>
                    <p className="text-xs text-brand-600 font-semibold">
                      Applied for: {req.requestedRole}
                    </p>
                    <p className="text-xs text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-xl">
                      "{req.message}"
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                      req.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                      req.status === 'rejected' ? 'bg-rose-100 text-rose-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {req.status}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Sent {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                    {req.status === 'accepted' && (
                      <Link
                        to="/my-teams"
                        className="text-xs font-bold text-brand-600 hover:underline"
                      >
                        Go to Team Workspace →
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}
