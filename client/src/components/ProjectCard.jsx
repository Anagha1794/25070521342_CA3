import React from 'react';
import { Users, Calendar, ArrowRight, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ProjectCard({ project, onOpenDetails, onApply }) {
  const { user } = useAuth();

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Hackathon':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'College Capstone':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Coding Competition':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'Open Source':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
    }
  };

  const isLeader = user && project.leader && (project.leader._id === user._id || project.leader === user._id);
  const isMember = user && project.teamMembers && project.teamMembers.some(
    m => m.user && (m.user._id === user._id || m.user === user._id)
  );

  const totalVacancies = project.openRoles?.reduce((acc, r) => acc + Math.max(0, (r.vacancies || 1) - (r.filled || 0)), 0) || 0;
  const currentMembersCount = project.teamMembers?.length || 1;
  const maxTeamSize = project.maxTeamSize || 4;

  const deadlineFormatted = project.deadline
    ? new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div className="p-6">
        {/* Top meta tags */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${getCategoryBadge(project.category)}`}>
              {project.category}
            </span>
            {project.hackathonName && (
              <span className="flex items-center gap-1 text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-full">
                <Trophy className="w-3 h-3 text-amber-500" />
                <span className="truncate max-w-[140px]">{project.hackathonName}</span>
              </span>
            )}
          </div>
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
            project.status === 'Recruiting'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-slate-100 text-slate-600'
          }`}>
            {project.status}
          </span>
        </div>

        {/* Title and tagline */}
        <h3
          onClick={() => onOpenDetails(project)}
          className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors cursor-pointer line-clamp-1 mb-1.5"
        >
          {project.title}
        </h3>
        <p className="text-xs font-medium text-slate-500 line-clamp-1 mb-3">
          {project.tagline}
        </p>

        {/* Description */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {project.description}
        </p>

        {/* Required Skills */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tech Stack / Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {project.requiredSkills?.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md font-medium border border-slate-200"
              >
                {skill}
              </span>
            ))}
            {project.requiredSkills?.length > 4 && (
              <span className="text-xs bg-slate-50 text-slate-500 px-2 py-1 rounded-md font-medium">
                +{project.requiredSkills.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Open Roles highlight */}
        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100 mb-4">
          <div className="flex items-center justify-between text-xs text-slate-600 mb-1.5">
            <span className="font-semibold text-slate-700">Open Roles Needed:</span>
            <span className="font-bold text-brand-600">{totalVacancies} open spot{totalVacancies !== 1 ? 's' : ''}</span>
          </div>
          <div className="space-y-1">
            {project.openRoles?.slice(0, 2).map((roleObj, i) => (
              <div key={i} className="flex items-center justify-between text-xs text-slate-500">
                <span className="truncate pr-2">• {roleObj.role}</span>
                <span className="text-[11px] text-slate-400 shrink-0">
                  {Math.max(0, (roleObj.vacancies || 1) - (roleObj.filled || 0))} needed
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Team Progress & Deadline */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <div className="flex items-center space-x-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>Team: <strong>{currentMembersCount}/{maxTeamSize}</strong></span>
          </div>
          {deadlineFormatted && (
            <div className="flex items-center space-x-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Target: {deadlineFormatted}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer bar with Leader & Action Buttons */}
      <div className="bg-slate-50/70 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        {project.leader && (
          <div className="flex items-center space-x-2.5 truncate">
            <img
              src={project.leader.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
              alt={project.leader.name}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-slate-800 truncate leading-none mb-0.5">
                {project.leader.name}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {project.leader.college || 'Lead'}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onOpenDetails(project)}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            Details
          </button>

          {isLeader ? (
            <span className="text-xs font-semibold text-brand-700 bg-brand-50 border border-brand-200 px-2.5 py-1 rounded-lg">
              Lead
            </span>
          ) : isMember ? (
            <span className="flex items-center space-x-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Joined</span>
            </span>
          ) : (
            <button
              onClick={() => onApply(project)}
              className="flex items-center space-x-1 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg shadow-sm shadow-brand-500/20 hover:shadow-md transition-all duration-150"
            >
              <span>Apply</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
