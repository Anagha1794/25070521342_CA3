import React from 'react';
import { Users, Database, Github, Heart, Code2, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">FindMyTeam</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              The premier student collaboration and team finder platform. Connect with talented developers, designers, and innovators for hackathons, college capstones, and open source projects.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-3 py-1.5 rounded-full w-fit">
              <Database className="w-3.5 h-3.5" />
              <span>MongoDB Community Server Connected</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">Explore Projects</Link>
              </li>
              <li>
                <Link to="/teammates" className="hover:text-white transition-colors">Find Teammates</Link>
              </li>
              <li>
                <Link to="/create-project" className="hover:text-white transition-colors">Post a Project</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link>
              </li>
              <li>
                <Link to="/my-teams" className="hover:text-white transition-colors">My Teams & Workspaces</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center space-x-2">
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <span>Hackathons & Competitions</span>
              </li>
              <li className="flex items-center space-x-2">
                <Code2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>College Capstone Projects</span>
              </li>
              <li className="flex items-center space-x-2">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>AI & Machine Learning Squads</span>
              </li>
              <li className="flex items-center space-x-2">
                <Github className="w-3.5 h-3.5 text-purple-400" />
                <span>Open Source Initiatives</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Compass Info */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Database & Compass</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Compatible with MongoDB Compass. Connect with connection string:
            </p>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-indigo-300 break-all select-all">
              mongodb://127.0.0.1:27017/findmyteam
            </div>
            <p className="text-[11px] text-slate-500">
              Collections: <code className="text-slate-300">users</code>, <code className="text-slate-300">projects</code>, <code className="text-slate-300">joinrequests</code>, <code className="text-slate-300">messages</code>
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FindMyTeam. Built for college creators, hackers, and builders.</p>
          <p className="flex items-center space-x-1 mt-4 sm:mt-0">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>using React, Tailwind CSS, Node.js & MongoDB</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
