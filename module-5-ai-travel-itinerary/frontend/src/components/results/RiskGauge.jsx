import React from 'react';
import { getRiskCategory, formatPercent } from '../../utils/riskUtils';
import { Activity, ShieldAlert, Cpu } from 'lucide-react';

export default function RiskGauge({ riskScore = 0.365, confidence = 0.635, isDisrupted = false }) {
  const category = getRiskCategory(riskScore);
  const percentage = Math.round(riskScore <= 1 ? riskScore * 100 : riskScore);
  const confPct = Math.round(confidence <= 1 ? confidence * 100 : confidence);
  
  // Circumference calculation for SVG progress circle
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 flex flex-col relative overflow-hidden transition-colors">
      {/* Background Subtle Radial Glow */}
      <div className={`absolute inset-0 bg-gradient-to-b ${category.bg} opacity-30 pointer-events-none`} />

      {/* Header matching reference mockup */}
      <div className="flex items-center justify-between w-full relative z-10">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            Predictive Disruption Telemetry
          </span>
        </div>
        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold border ${category.badgeBg} ${category.text} ${category.border}`}>
          {category.level === 'LOW' ? '[LOW RISK - STABLE]' : category.level === 'MEDIUM' ? '[MODERATE RISK]' : '[HIGH RISK - ALERT]'}
        </span>
      </div>

      {/* SVG Radial Gauge */}
      <div className="relative my-1 flex items-center justify-center relative z-10">
        <svg className="w-44 h-44 transform -rotate-90">
          {/* Background circle track */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Animated Risk progress ring */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            stroke={category.stroke}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Inner Gauge Text */}
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
            {percentage}%
          </span>
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-0.5">
            Disruption Risk
          </span>
        </div>
      </div>

      {/* Telemetry Metric Cards (Directly styled from reference screenshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full relative z-10 text-xs font-mono">
        {/* Composite Disruption Risk Bar */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 space-y-2">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
            COMPOSITE DISRUPTION RISK
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {percentage.toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500">/ 100%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, percentage)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            Threshold buffer <span className="text-emerald-600 dark:text-emerald-400 font-bold">-3.5%</span>
          </div>
        </div>

        {/* XGBoost Confidence Bar */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 space-y-2">
          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-semibold">
            XGBOOST CONFIDENCE
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black text-cyan-600 dark:text-cyan-400">
              {confPct.toFixed(1)}%
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30 uppercase">
              {confPct > 70 ? 'CERTAIN' : 'PROBABLE'}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-cyan-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, confPct)}%` }}
            />
          </div>
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            Disruption Event: <span className={`font-bold ${isDisrupted ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>{isDisrupted ? 'TRUE' : 'FALSE'}</span>
          </div>
        </div>
      </div>

      {/* Telemetry Footer Strip (from reference image) */}
      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-600 dark:text-slate-400 relative z-10">
        <div>
          <span className="text-slate-400 dark:text-slate-500">ENSEMBLE: </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">v4.28b</span>
        </div>
        <div>
          <span className="text-slate-400 dark:text-slate-500">LATENCY: </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">142ms</span>
        </div>
        <div>
          <span className="text-slate-400 dark:text-slate-500">SAMPLES: </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">1.2M OPS</span>
        </div>
      </div>
    </div>
  );
}
