import React from 'react';

export default function MetricCard({ title, value, subtitle, icon: Icon, trend, color = 'cyan' }) {
  const getColorClasses = () => {
    switch (color) {
      case 'rose':
        return { 
          border: 'hover:border-rose-400 dark:hover:border-rose-500/40', 
          iconBg: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/30' 
        };
      case 'amber':
        return { 
          border: 'hover:border-amber-400 dark:hover:border-amber-500/40', 
          iconBg: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/30' 
        };
      case 'emerald':
        return { 
          border: 'hover:border-emerald-400 dark:hover:border-emerald-500/40', 
          iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30' 
        };
      default:
        return { 
          border: 'hover:border-sky-400 dark:hover:border-cyan-500/40', 
          iconBg: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/30' 
        };
    }
  };

  const style = getColorClasses();

  return (
    <div className={`p-5 rounded-xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all ${style.border}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className={`p-2 rounded-lg border ${style.iconBg}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mt-2 flex items-baseline justify-between">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">{value}</span>
        {trend && (
          <span className={`text-xs font-mono font-medium ${trend.isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {trend.value}
          </span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 truncate">{subtitle}</p>
      )}
    </div>
  );
}
