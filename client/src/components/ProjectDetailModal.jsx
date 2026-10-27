import React from 'react';
import { X, Users, Calendar, Github, ExternalLink, Trophy, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProjectDetailModal({ project, isOpen, onClose, onApply }) {
  if (!isOpen || !project) return null;
  const { user } = useAuth();

  const isLeader = user && project.leader && (project.leader._id === user._id || project.leader === user._id);
  const isMember = user && project.teamMembers && project.teamMembers.some(
    m => m.user && (m.user._id === user._id || m.user === user._id)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category & Status */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
            {project.category}
          </span>
          {project.hackathonName && (
            <span className="flex items-center gap-1 text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>{project.hackathonName}</span>
            </span>
          )}
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {project.status}
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
          {project.title}
        </h2>
        <p className="text-sm font-medium text-slate-500 mb-6 leading-relaxed">
          {project.tagline}
        </p>

        {/* Project Description */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">About The Project</h4>
          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {project.description}
          </p>
        </div>

        {/* Skills Required */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Tech Stack & Required Skills</h4>
          <div className="flex flex-wrap gap-2">
            {project.requiredSkills?.map((skill, i) => (
              <span key={i} className="text-xs font-semibold px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Open Roles */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Open Positions / Roles</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {project.openRoles?.map((r, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50">
                <span className="text-xs font-bold text-slate-800">{r.role}</span>
                <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md">
                  {Math.max(0, (r.vacancies || 1) - (r.filled || 0))} spot open
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members Roster */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Current Team ({project.teamMembers?.length || 1} / {project.maxTeamSize || 4})
          </h4>
          <div className="space-y-2">
            {project.teamMembers && project.teamMembers.length > 0 ? (
              project.teamMembers.map((member, idx) => {
                const memUser = member.user || {};
                return (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white shadow-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={memUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                        alt={memUser.name || 'Member'}
                        className="w-8 h-8 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <Link
                          to={`/profile/${memUser._id}`}
                          className="text-xs font-bold text-slate-800 hover:text-brand-600 hover:underline block"
                        >
                          {memUser.name || 'Team Contributor'}
                        </Link>
                        <p className="text-[10px] text-slate-400">{memUser.college || 'Student'}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                      {member.role || 'Member'}
                    </span>
                  </div>
                );
              })
            ) : project.leader ? (
              <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white">
                <div className="flex items-center space-x-3">
                  <img
                    src={project.leader.avatar}
                    alt={project.leader.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{project.leader.name}</p>
                    <p className="text-[10px] text-slate-400">{project.leader.college}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md">
                  Project Lead
                </span>
              </div>
            ) : null}
          </div>
        </div>

        {/* Links */}
        {(project.repoUrl || project.demoUrl) && (
          <div className="mb-6 flex items-center space-x-4">
            {project.repoUrl && (
              <a
                href={project.repoUrl.startsWith('http') ? project.repoUrl : `https://${project.repoUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 px-3 py-2 rounded-xl"
              >
                <Github className="w-4 h-4" />
                <span>GitHub Repository</span>
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl.startsWith('http') ? project.demoUrl : `https://${project.demoUrl}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center space-x-1.5 text-xs font-semibold text-brand-600 hover:text-brand-800 bg-brand-50 px-3 py-2 rounded-xl"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Live Project Demo</span>
              </a>
            )}
          </div>
        )}

        {/* Footer actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {project.deadline && (
              <span className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
              </span>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Close
            </button>
            {!isLeader && !isMember && (
              <button
                onClick={() => {
                  onClose();
                  onApply(project);
                }}
                className="flex items-center space-x-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl shadow-md shadow-brand-500/25 transition-all"
              >
                <span>Apply to Join</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
            {isLeader && (
              <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-xl border border-brand-200">
                You are leading this project
              </span>
            )}
            {isMember && !isLeader && (
              <span className="flex items-center space-x-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>You are already in this squad</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
