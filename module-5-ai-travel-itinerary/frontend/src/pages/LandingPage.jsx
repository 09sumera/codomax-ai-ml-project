import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Cpu,
  GitCompare,
  ShieldCheck,
  WifiOff,
  BookOpen,
  Ship,
  Truck,
  Train,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  Activity,
  Layers,
  MapPin,
  Clock,
  DollarSign
} from 'lucide-react';
import ThemeToggle from '../components/common/ThemeToggle';
import { useAuth } from '../context/AuthContext';

// Concise Corridors with essential details
const CORRIDORS = [
  {
    id: 'maritime',
    name: 'Rotterdam (NL) ➔ Singapore (SG)',
    mode: 'Maritime Freight',
    icon: Ship,
    hazard: 'Suez Chokepoint Congestion (+96h queue)',
    action: 'Cape of Good Hope Bypass',
    timeSaved: '-4.5 Days Net',
    costSaved: '~$48,000',
    riskBefore: '82%',
    riskAfter: '14%',
    rationale: 'Bypasses severe canal backlog with high ETA certainty and zero security surcharge.',
  },
  {
    id: 'road',
    name: 'Frankfurt (DE) ➔ Istanbul (TR)',
    mode: 'Road Freight',
    icon: Truck,
    hazard: 'Alpine Blizzard & Border Queue',
    action: 'Southern Adriatic Ro-Ro Ferry',
    timeSaved: '-18 Hours Net',
    costSaved: '~$8,500',
    riskBefore: '68%',
    riskAfter: '16%',
    rationale: 'Avoids mountain pass ice alerts and heavy border delays via multimodal ferry link.',
  },
  {
    id: 'rail',
    name: 'Chicago (IL) ➔ Miami (FL)',
    mode: 'Intermodal Rail',
    icon: Train,
    hazard: 'Minor Coastal Rain Front',
    action: 'Maintain Primary Corridor (STAY)',
    timeSaved: 'On Schedule',
    costSaved: '$0 Overhead',
    riskBefore: '28%',
    riskAfter: '12%',
    rationale: 'Weather metrics remain well within tolerance thresholds. Primary rail spine retained.',
  },
];

// Essential Capabilities
const ESSENTIAL_FEATURES = [
  {
    icon: TrendingUp,
    title: 'Disruption Prediction',
    badge: 'XGBoost ML',
    description: 'Forecasts chokepoint delays, severe weather, and port congestion before shipments depart.',
    metric: '98.4% Accuracy',
  },
  {
    icon: Cpu,
    title: 'Tri-Agent Consensus',
    badge: 'Multi-Agent',
    description: 'Disruption, Route, and Consensus agents collaboratively vote to recommend STAY or REROUTE.',
    metric: 'Automated Voting',
  },
  {
    icon: GitCompare,
    title: 'Route Comparison',
    badge: 'Delta Matrix',
    description: 'Evaluates primary vs. alternate corridors across transit time, fuel burn, and cost delta.',
    metric: 'Instant Scoring',
  },
  {
    icon: ShieldCheck,
    title: 'Driver Safety Monitor',
    badge: 'Telemetry',
    description: 'Real-time GPS tracking, automated safety check-in countdowns, and geofence alerts.',
    metric: 'Live Heartbeat',
  },
  {
    icon: WifiOff,
    title: '100% Offline Routes',
    badge: 'Vector Store',
    description: 'Pre-downloads map tiles and corridor data into IndexedDB for zero-cellular navigation.',
    metric: 'Offline Cache',
  },
  {
    icon: BookOpen,
    title: 'Evidence & RAG',
    badge: 'Grounded Intelligence',
    description: 'Retrieves relevant passages from maritime advisories and freight databases to back decisions.',
    metric: 'Passage Citations',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activeCorridor, setActiveCorridor] = useState(CORRIDORS[0]);

  const handleLaunch = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/analyze');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-sans selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-150">
      
      {/* Subtle Ambient Background Light */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-cyan-500/10 via-blue-600/5 to-transparent blur-3xl" />
      </div>

      {/* Clean Modern Header - Increased Font Sizes & Comfortable Height */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-slate-950/90 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                RouteShield
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
                AI
              </span>
            </div>
          </Link>

          {/* Navigation Links - Increased from text-xs to text-sm/text-base */}
          <nav className="hidden md:flex items-center space-x-8 text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Features</a>
            <a href="#corridors" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Corridors</a>
            <a href="#safety" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Safety & Offline</a>
          </nav>

          {/* Right Action Controls - Increased Button Text & Padding */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-sm transition flex items-center space-x-1.5 shadow-sm"
              >
                <span>Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 text-sm font-semibold transition"
                >
                  Sign In
                </Link>
                <button
                  onClick={handleLaunch}
                  className="px-4.5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm transition flex items-center space-x-1.5 shadow-sm"
                >
                  <span>Analyze</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </header>


      {/* Main Body */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* HERO SECTION - Balanced & Readable Proportions */}
        <section className="pt-14 pb-12 sm:pt-20 sm:pb-16 text-center">
          

          {/* Headline - Clear & Confident */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight sm:leading-none">
            Predict Freight Disruptions.{' '}
            <span className="bg-gradient-to-r from-cyan-600 via-sky-500 to-blue-600 dark:from-cyan-400 dark:via-sky-300 dark:to-blue-400 bg-clip-text text-transparent">
              Reroute Before Bottlenecks Occur.
            </span>
          </h1>

          {/* Subtitle - Increased from text-xs to text-sm sm:text-base */}
          <p className="mt-4 text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            RouteShield combines machine learning risk prediction, tri-agent consensus rerouting, and 
            offline vector navigation to maintain shipment continuity across all transport modes.
          </p>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleLaunch}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm sm:text-base transition flex items-center space-x-2 shadow-sm cursor-pointer"
            >
              <span>Analyze Route</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to="/offline-routes"
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-sm sm:text-base transition flex items-center space-x-2"
            >
              <WifiOff className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              <span>Offline Route Store</span>
            </Link>
          </div>

          {/* Performance Metrics Strip - Clear font sizes */}
          <div className="mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-xl sm:text-2xl font-black font-mono text-cyan-600 dark:text-cyan-400">98.4%</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Disruption Precision</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">&lt;120ms</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Inference Latency</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">100%</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Offline Capable</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black font-mono text-blue-600 dark:text-blue-400">Tri-Agent</div>
              <div className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">Consensus Engine</div>
            </div>
          </div>

          {/* HERO VISUAL: Intelligent Disruption Map (Switches dynamically between Light and Dark Mode) */}
          <div className="mt-10 max-w-5xl mx-auto">
            <div className="relative rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 bg-gradient-to-b from-slate-200/90 to-slate-100 dark:from-slate-800/80 dark:to-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-colors">
              
              {/* Telemetry Header Bar */}
              <div className="px-4 py-2.5 bg-white/95 dark:bg-slate-950/95 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-slate-300 rounded-t-xl sm:rounded-t-2xl">
                <div className="flex items-center space-x-2.5">
                  <span className="flex items-center space-x-1.5 text-cyan-600 dark:text-cyan-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping"></span>
                    <span>ACTIVE REROUTE ADVISORY</span>
                  </span>
                  <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>
                  <span className="hidden sm:inline font-semibold">ROTTERDAM ➔ SINGAPORE</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">NET GAIN: -4.5 DAYS</span>
                  <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
                  <span className="text-cyan-600 dark:text-cyan-400 font-bold hidden sm:inline">~$48,000 SAVED</span>
                </div>
              </div>

              {/* Theme-Adaptive Dashboard Images */}
              <div className="relative overflow-hidden rounded-b-xl sm:rounded-b-2xl shadow-inner bg-slate-900">
                {/* Light Mode Dashboard */}
                <img
                  src="/hero-map-light.jpg"
                  alt="RouteShield Logistics Disruption & Rerouting Map (Light Mode)"
                  className="block dark:hidden w-full h-auto object-cover"
                  loading="eager"
                />

                {/* Dark Mode Dashboard */}
                <img
                  src="/hero-map-dark.jpg"
                  alt="RouteShield Logistics Disruption & Rerouting Map (Dark Mode)"
                  className="hidden dark:block w-full h-auto object-cover"
                  loading="eager"
                />
              </div>

            </div>
          </div>

        </section>


        {/* CORE FEATURES SECTION - Comfortable Typography */}
        <section id="features" className="py-14 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Platform Modules
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Essential engines operating across the RouteShield architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {ESSENTIAL_FEATURES.map((item, idx) => {
              const IconComponent = item.icon;
              return (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 hover:border-cyan-500/40 transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-400">
                    <span>{item.metric}</span>
                    <CheckCircle2 className="w-4 h-4 ml-1.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>


        {/* CORRIDORS SECTION - Comfortable Sizes */}
        <section id="corridors" className="py-14 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Corridor Simulation
            </h2>
            <p className="mt-1.5 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Deterministic routing decisions across primary freight corridors.
            </p>
          </div>

          {/* Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
            {CORRIDORS.map((c) => {
              const Icon = c.icon;
              const isSelected = activeCorridor.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCorridor(c)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold transition cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{c.mode}</span>
                </button>
              );
            })}
          </div>

          {/* Corridor Card */}
          <div className="max-w-4xl mx-auto p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 dark:border-slate-800 gap-3">
              <div>
                <span className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase tracking-wider">
                  {activeCorridor.mode} Analysis
                </span>
                <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                  {activeCorridor.name}
                </h3>
              </div>
              <button
                onClick={() => navigate('/analyze')}
                className="self-start sm:self-auto px-4 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30 text-xs sm:text-sm font-bold hover:bg-cyan-100 transition flex items-center space-x-1"
              >
                <span>Run Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 4-Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-5">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400">Risk Profile</div>
                <div className="text-sm sm:text-base font-bold font-mono text-slate-900 dark:text-white mt-1">
                  <span className="text-rose-500">{activeCorridor.riskBefore}</span> ➔ <span className="text-emerald-500">{activeCorridor.riskAfter}</span>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400">Delay Averted</div>
                <div className="text-sm sm:text-base font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                  {activeCorridor.timeSaved}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400">Est. Savings</div>
                <div className="text-sm sm:text-base font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-1">
                  {activeCorridor.costSaved}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-center">
                <div className="text-xs text-slate-500 dark:text-slate-400">Action</div>
                <div className="text-xs sm:text-sm font-bold font-mono text-slate-800 dark:text-slate-200 mt-1 truncate">
                  {activeCorridor.action}
                </div>
              </div>
            </div>

            {/* Rationale Bar - Adapts to Light and Dark Mode */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs sm:text-sm border border-slate-200 dark:border-slate-800 leading-relaxed font-sans transition-colors">
              <span className="text-cyan-600 dark:text-cyan-400 font-bold">Consensus Rationale: </span>
              {activeCorridor.rationale}
            </div>
          </div>
        </section>


        {/* SAFETY & OFFLINE SECTION */}
        <section id="safety" className="py-14 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Driver Safety */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-cyan-600 dark:text-cyan-400 mb-2.5">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">Driver Safety</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Live Fleet Tracking & Emergency SOS
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Continuous GPS heartbeat telemetry, periodic driver check-ins, and geofence hazard notifications.
                </p>
              </div>
              <Link
                to="/driver-safety"
                className="inline-flex items-center space-x-1.5 text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                <span>Open Driver Monitor</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Offline Routes */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-2.5">
                  <WifiOff className="w-5 h-5" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider">Offline Operations</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Zero-Signal Vector Navigation
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Download route corridors directly to IndexedDB. Turn-by-turn guidance remains active in dead zones.
                </p>
              </div>
              <Link
                to="/offline-routes"
                className="inline-flex items-center space-x-1.5 text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                <span>View Offline Store</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>


        {/* BOTTOM BANNER - Adapts to Light and Dark Mode */}
        <section className="py-12 border-t border-slate-200/80 dark:border-slate-800/80">
          <div className="rounded-2xl p-6 sm:p-10 bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 text-slate-900 dark:text-white border border-cyan-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 transition-colors">
            <div>
              <h3 className="text-base sm:text-xl font-bold text-slate-900 dark:text-white">
                Ready to evaluate shipment disruption risk?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Run route simulations or configure offline navigation in seconds.
              </p>
            </div>

            <div className="flex items-center space-x-3 shrink-0">
              <button
                onClick={handleLaunch}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm sm:text-base transition shadow-sm cursor-pointer"
              >
                <span>Launch Analysis</span>
              </button>
            </div>
          </div>
        </section>

      </main>


      {/* FOOTER - Increased Font Sizes & Spacing */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 py-8 sm:py-10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          
          {/* Brand & Subtitle */}
          <div className="flex items-center space-x-3 text-sm sm:text-base">
            <ShieldAlert className="w-5 h-5 text-cyan-500 shrink-0" />
            <span className="font-extrabold text-slate-900 dark:text-white">RouteShield AI</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-600 dark:text-slate-400">Logistics Disruption Intelligence</span>
          </div>

          {/* System Status Pill */}
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-mono text-slate-600 dark:text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Systems Nominal</span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-6 text-sm sm:text-base font-semibold">
            <Link to="/analyze" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Analyze</Link>
            <Link to="/offline-routes" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Offline</Link>
            <Link to="/driver-safety" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Safety</Link>
            <Link to="/login" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition">Sign In</Link>
          </div>

        </div>
      </footer>

    </div>
  );
}
