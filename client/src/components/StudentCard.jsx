import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Globe, Award, Sparkles, UserPlus } from 'lucide-react';

export default function StudentCard({ student, onInvite }) {
  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'Looking for Team':
        return { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'Open to Offers':
        return { dot: 'bg-sky-500', badge: 'bg-sky-50 text-sky-700 border-sky-200' };
      default:
        return { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
    }
  };

  const statusConfig = getAvailabilityColor(student.availability || 'Looking for Team');

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      <div className="p-6">
        {/* Top Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <img
                src={student.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={student.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm"
              />
              <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${statusConfig.dot}`} />
            </div>
            <div>
              <Link
                to={`/profile/${student._id}`}
                className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors block leading-tight hover:underline"
              >
                {student.name}
              </Link>
              <p className="text-xs font-semibold text-brand-600 mt-0.5">
                {student.college}
              </p>
              <p className="text-[11px] text-slate-400">
                {student.major} • {student.year}
              </p>
            </div>
          </div>
        </div>

        {/* Availability Badge */}
        <div className="mb-3">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${statusConfig.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
            {student.availability || 'Looking for Team'}
          </span>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed">
          {student.bio || 'Eager to collaborate on student projects, build products, and tackle coding challenges.'}
        </p>

        {/* Badges / Accolades */}
        {student.badges && student.badges.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {student.badges.slice(0, 2).map((badge, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/60 px-2 py-0.5 rounded-md"
              >
                <Award className="w-3 h-3 text-amber-500" />
                <span>{badge}</span>
              </span>
            ))}
          </div>
        )}

        {/* Skills */}
        <div>
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Skills & Proficiencies</p>
          <div className="flex flex-wrap gap-1.5">
            {student.skills?.slice(0, 5).map((skill, idx) => (
              <span
                key={idx}
                className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium border border-slate-200"
              >
                {skill}
              </span>
            ))}
            {student.skills?.length > 5 && (
              <span className="text-xs text-slate-400 px-1 py-0.5">
                +{student.skills.length - 5}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer bar with social links and Action button */}
      <div className="bg-slate-50/70 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between gap-3">
        {/* Social Icons */}
        <div className="flex items-center space-x-2 text-slate-400">
          {student.github && (
            <a
              href={student.github.startsWith('http') ? student.github : `https://${student.github}`}
              target="_blank"
              rel="noreferrer"
              className="p-1 hover:text-slate-900 transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {student.linkedin && (
            <a
              href={student.linkedin.startsWith('http') ? student.linkedin : `https://${student.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="p-1 hover:text-blue-600 transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
          {student.portfolio && (
            <a
              href={student.portfolio.startsWith('http') ? student.portfolio : `https://${student.portfolio}`}
              target="_blank"
              rel="noreferrer"
              className="p-1 hover:text-brand-600 transition-colors"
              title="Portfolio Website"
            >
              <Globe className="w-4 h-4" />
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2">
          <Link
            to={`/profile/${student._id}`}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            Profile
          </Link>
          <button
            onClick={() => onInvite(student)}
            className="flex items-center space-x-1 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white px-3 py-1.5 rounded-lg shadow-sm shadow-brand-500/20 hover:shadow-md transition-all duration-150"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite</span>
          </button>
        </div>
      </div>
    </div>
  );
}
