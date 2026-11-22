import React from 'react';

export default function StatusBadge({ status, type = 'risk' }) {
  const getStyle = () => {
    const s = String(status || '').toUpperCase();
    if (type === 'risk') {
      if (s === 'HIGH' || s === 'CRITICAL') {
        return 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 font-semibold';
      }
      if (s === 'MEDIUM' || s === 'MODERATE') {
        return 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30 font-semibold';
      }
      return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 font-semibold';
    }
    if (type === 'decision') {
      if (s === 'REROUTE') {
        return 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-500/40 font-bold';
      }
      return 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-500/40 font-bold';
    }
    if (type === 'agent') {
      if (s === 'COMPLETED' || s === 'SUCCESS') {
        return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30';
      }
      if (s === 'RUNNING' || s === 'PROCESSING') {
        return 'bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/30 animate-pulse';
      }
      return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700';
    }
    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono border transition-colors ${getStyle()}`}>
      {status || 'UNKNOWN'}
    </span>
  );
}
