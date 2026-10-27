import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { teamAPI } from '../services/api';
import {
  Layers,
  Users,
  MessageSquare,
  Send,
  Calendar,
  Github,
  ExternalLink,
  Shield,
  Sparkles,
  Trophy,
  CheckCircle2,
  Clock
} from 'lucide-react';
import Toast from '../components/Toast';

export default function MyTeamsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const res = await teamAPI.getMyTeams();
      setTeams(res.data);
      if (res.data.length > 0) {
        setSelectedTeam(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load teams:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTeams();
  }, [user]);

  // Fetch messages when selectedTeam changes
  useEffect(() => {
    if (selectedTeam) {
      teamAPI.getMessages(selectedTeam._id)
        .then(res => setMessages(res.data))
        .catch(err => console.error('Failed to fetch messages:', err));
    }
  }, [selectedTeam]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTeam) return;

    setSendingMsg(true);
    try {
      const res = await teamAPI.sendMessage(selectedTeam._id, newMessage.trim());
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Failed to post message.',
        type: 'error'
      });
    } finally {
      setSendingMsg(false);
    }
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
      <div>
        <div className="flex items-center space-x-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Layers className="w-4 h-4" />
          <span>Team Collaboration Workspaces</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          My Teams & Projects
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Active squads you belong to. Coordinate roles, milestones, and chat with teammates
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 h-96 bg-slate-200 rounded-3xl animate-pulse" />
          <div className="md:col-span-8 h-96 bg-slate-200 rounded-3xl animate-pulse" />
        </div>
      ) : teams.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 border border-slate-200 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">You are not part of any team yet</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Form your own team by posting a project, or apply to join an existing hackathon or capstone project.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              to="/create-project"
              className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Post a Project
            </Link>
            <Link
              to="/projects"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
            >
              Browse Projects
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Teams List (4 Cols) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Your Active Squads ({teams.length})
            </h3>

            {teams.map((t) => {
              const isSelected = selectedTeam && selectedTeam._id === t._id;
              const isLeader = t.leader && (t.leader._id === user._id || t.leader === user._id);
              return (
                <div
                  key={t._id}
                  onClick={() => setSelectedTeam(t)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brand-50/70 border-brand-300 shadow-sm ring-1 ring-brand-400/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                      {t.category}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isLeader
                        ? 'bg-brand-100 text-brand-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {isLeader ? 'Lead' : 'Member'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                    {t.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                    {t.tagline}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{t.teamMembers?.length || 1}/{t.maxTeamSize} Members</span>
                    </span>
                    <span className="text-[11px] font-medium text-emerald-600">
                      {t.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Selected Team Workspace (8 Cols) */}
          {selectedTeam && (
            <div className="lg:col-span-8 space-y-6">
              {/* Workspace Header Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                    {selectedTeam.category}
                  </span>
                  {selectedTeam.hackathonName && (
                    <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 flex items-center space-x-1">
                      <Trophy className="w-3 h-3 text-amber-500" />
                      <span>{selectedTeam.hackathonName}</span>
                    </span>
                  )}
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                    {selectedTeam.status}
                  </span>
                </div>

                <h2 className="text-2xl font-extrabold text-slate-900 mb-1">
                  {selectedTeam.title}
                </h2>
                <p className="text-sm text-slate-600 mb-6">
                  {selectedTeam.tagline}
                </p>

                {/* Team Roster Grid */}
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Active Team Roster ({selectedTeam.teamMembers?.length || 1} members)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedTeam.teamMembers?.map((m, idx) => {
                      const memberUser = m.user || {};
                      const isLeader = selectedTeam.leader && (selectedTeam.leader._id === memberUser._id || selectedTeam.leader === memberUser._id);
                      return (
                        <div key={idx} className="flex items-center space-x-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                          <img
                            src={memberUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                            alt={memberUser.name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          />
                          <div className="truncate flex-1">
                            <div className="flex items-center justify-between">
                              <Link
                                to={`/profile/${memberUser._id}`}
                                className="text-xs font-bold text-slate-900 hover:text-brand-600 truncate hover:underline"
                              >
                                {memberUser.name || 'Member'}
                              </Link>
                              {isLeader && (
                                <span className="text-[10px] font-bold text-brand-700 bg-brand-100 px-1.5 py-0.5 rounded">
                                  Lead
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{m.role || 'Contributor'}</p>
                            <p className="text-[10px] text-slate-400 truncate">{memberUser.college}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Useful links */}
                {(selectedTeam.repoUrl || selectedTeam.demoUrl) && (
                  <div className="flex items-center space-x-4 pt-6 mt-6 border-t border-slate-100">
                    {selectedTeam.repoUrl && (
                      <a
                        href={selectedTeam.repoUrl.startsWith('http') ? selectedTeam.repoUrl : `https://${selectedTeam.repoUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-xl"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>Code Repository</span>
                      </a>
                    )}
                    {selectedTeam.demoUrl && (
                      <a
                        href={selectedTeam.demoUrl.startsWith('http') ? selectedTeam.demoUrl : `https://${selectedTeam.demoUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1.5 text-xs font-semibold text-brand-600 bg-brand-50 px-3 py-1.5 rounded-xl"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Live Deployment</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Team Real-Time Chat & Discussion Board */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[520px]">
                <div className="p-4 px-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MessageSquare className="w-4 h-4 text-brand-600" />
                    <h3 className="text-sm font-bold text-slate-800">Team Workspace Chat & Updates</h3>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-semibold flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>MongoDB Saved Chat</span>
                  </span>
                </div>

                {/* Message Log */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center p-6 text-xs text-slate-400">
                      No team messages yet. Break the ice and say hello to your squad!
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const sender = msg.sender || {};
                      const isMe = user && (sender._id === user._id || sender === user._id);
                      return (
                        <div
                          key={msg._id}
                          className={`flex items-start space-x-3 ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}
                        >
                          <img
                            src={sender.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                            alt={sender.name}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 mt-0.5"
                          />
                          <div className={`max-w-[75%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                            isMe
                              ? 'bg-brand-600 text-white rounded-tr-none'
                              : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                          }`}>
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className={`font-bold ${isMe ? 'text-brand-100' : 'text-slate-900'}`}>
                                {sender.name || 'Teammate'}
                              </span>
                              <span className={`text-[10px] ${isMe ? 'text-brand-200' : 'text-slate-400'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="whitespace-pre-line">{msg.content}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white flex items-center gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a team message, share updates or links..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="submit"
                    disabled={sendingMsg || !newMessage.trim()}
                    className="flex items-center space-x-1.5 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-40"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
