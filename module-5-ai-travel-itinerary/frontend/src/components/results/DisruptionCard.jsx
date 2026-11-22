import React from 'react';
import { Ship, Truck, Plane, Train, MapPin, Radio, Compass } from 'lucide-react';
import { formatDistance, formatDate } from '../../utils/formatters';

export default function DisruptionCard({ inputData, resultData }) {
  const origin = inputData?.Origin_Port || 'Shanghai';
  const destination = inputData?.Destination_Port || 'Rotterdam';
  const mode = inputData?.Transport_Mode || 'Maritime';
  const product = inputData?.Product_Category || 'High-Val SemiCon';
  const distance = inputData?.Distance_km || 10450;
  const leadTime = inputData?.Lead_Time_Days || 14;

  const ModeIcon = mode === 'Road' ? Truck : mode === 'Air' ? Plane : mode === 'Rail' ? Train : Ship;
  
  // Format origin and destination 5-letter port vector (e.g. CNSHA -> NLRTM)
  const getPortCode = (city, defaultCode) => {
    if (!city) return defaultCode;
    const clean = city.replace(/port of\s*/i, '').trim();
    if (clean.length < 3) return defaultCode;
    return (clean.substring(0, 3) + clean.slice(-2)).toUpperCase();
  };

  const originCode = getPortCode(origin, 'CNSHA');
  const destCode = getPortCode(destination, 'NLRTM');

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
      {/* Header matching reference mockup */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-sky-50 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-500/30 text-sky-600 dark:text-cyan-400">
            <ModeIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono tracking-tight">
              SHP-8842-XGB
            </h3>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              Autonomous Fleet Unit • Telemetry Active
            </span>
          </div>
        </div>
        <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30 uppercase tracking-wider">
          PRIORITY ALPHA
        </span>
      </div>

      {/* Two Main Telemetry Sub-panels (Directly matching reference mockup) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Transit Vector Panel */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 space-y-1">
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
            TRANSIT VECTOR
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono tracking-tight flex items-center space-x-2">
            <span className="text-cyan-700 dark:text-cyan-400">{originCode}</span>
            <span className="text-slate-400">→</span>
            <span className="text-emerald-700 dark:text-emerald-400">{destCode}</span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
            {origin} → {destination}
          </div>
        </div>

        {/* Manifest Profile Panel */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 space-y-1">
          <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase font-semibold">
            MANIFEST PROFILE
          </div>
          <div className="text-base sm:text-lg font-black text-slate-900 dark:text-white font-mono tracking-tight truncate">
            {product}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400">
            Tier-1 Temp/Shock Sens • {leadTime}d Window
          </div>
        </div>
      </div>

      {/* Corridor Map/Telemetry Banner (matching reference mockup) */}
      <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-slate-800 dark:text-slate-200 font-bold">GEO-CORRIDOR #04 ACTIVE</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-600 dark:text-slate-400">
            SAT-TEL-4&2N
          </span>
        </div>

        {/* Telemetry bottom banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-900 text-white font-mono text-xs shadow-sm">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-cyan-400 animate-spin-slow" />
            <span className="text-slate-200">AIS Trajectory: <span className="font-bold text-white">21.4 kts / Hdg 284°</span></span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-300 hidden sm:inline">{formatDistance(distance)}</span>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-bold uppercase text-[10px] self-start sm:self-auto">
            EN ROUTE NOMINAL
          </span>
        </div>
      </div>
    </div>
  );
}
