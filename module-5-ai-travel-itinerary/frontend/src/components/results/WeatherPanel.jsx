import React from 'react';
import { CloudRain, Wind, Thermometer, Sun, CloudLightning } from 'lucide-react';

export default function WeatherPanel({ inputData }) {
  const weatherCond = inputData?.Weather_Condition || 'Stormy';
  const geoRisk = inputData?.Geopolitical_Risk_Score ?? 0.45;

  const isSevere = weatherCond === 'Stormy' || weatherCond === 'Typhoon' || weatherCond === 'Blizzard';

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <CloudLightning className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Weather & Corridor Risk Enrichment</h3>
        </div>
        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-mono font-bold uppercase border ${
          isSevere 
            ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30' 
            : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30'
        }`}>
          {isSevere ? 'Severe Weather Alert' : 'Normal Conditions'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-sky-50 dark:bg-cyan-500/10 text-sky-700 dark:text-cyan-400 border border-sky-200 dark:border-cyan-500/30">
            {isSevere ? <CloudRain className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </div>
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Weather Condition</div>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">{weatherCond}</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
            <Wind className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Geopolitical Risk Score</div>
            <div className="font-bold text-slate-900 dark:text-white mt-0.5">{geoRisk.toFixed(2)} / 1.0</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/90 dark:border-slate-800/80 flex items-center space-x-3">
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
            <Thermometer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Environmental Telemetry</div>
            <div className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">Enriched via NOAA</div>
          </div>
        </div>
      </div>
    </div>
  );
}
