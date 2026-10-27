import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const config = {
    success: {
      bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      icon: CheckCircle,
      iconColor: 'text-emerald-500'
    },
    error: {
      bg: 'bg-rose-50 text-rose-800 border-rose-200',
      icon: AlertCircle,
      iconColor: 'text-rose-500'
    },
    info: {
      bg: 'bg-brand-50 text-brand-800 border-brand-200',
      icon: Info,
      iconColor: 'text-brand-500'
    }
  }[type] || {
    bg: 'bg-slate-50 text-slate-800 border-slate-200',
    icon: Info,
    iconColor: 'text-slate-500'
  };

  const Icon = config.icon;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
      <div className={`flex items-center space-x-3 px-4 py-3 rounded-2xl border shadow-xl ${config.bg} max-w-md`}>
        <Icon className={`w-5 h-5 shrink-0 ${config.iconColor}`} />
        <p className="text-xs font-semibold leading-relaxed flex-1">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-black/5 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
