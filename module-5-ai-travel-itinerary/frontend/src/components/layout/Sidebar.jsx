import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Route, 
  History, 
  Settings, 
  ShieldAlert, 
  Cpu, 
  ChevronRight,
  Activity,
  Compass,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/analyze', label: 'Analyze Route', icon: Route },
  { path: '/safety', label: 'Driver Safety', icon: ShieldAlert },
  { path: '/saved-routes', label: 'Offline Routes', icon: Activity },
  { path: '/history', label: 'Analysis History', icon: History },
  { path: '/welcome', label: 'About & Features', icon: Compass },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
      onClose();
      navigate('/welcome');
    }
  };
  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar navigation drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
            <NavLink to="/" onClick={onClose} className="flex items-center space-x-3 group">
              <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-500/30 flex items-center justify-center text-sky-600 dark:text-cyan-400 shadow-sm group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 text-sky-600 dark:text-cyan-400" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                  RouteShield
                  <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded bg-sky-100 dark:bg-cyan-500/20 text-sky-700 dark:text-cyan-300 border border-sky-200 dark:border-cyan-500/40">AI</span>
                </span>
                <span className="block text-[10px] font-medium text-slate-500 dark:text-slate-400">Disruption Intelligence</span>
              </div>
            </NavLink>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Core Modules
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/30 shadow-xs font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60'
                    }`
                  }
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom System Status Widget */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Multi-Agent Suite
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Disruption Agent</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-medium">Ready</span>
              </div>
              <div className="flex justify-between">
                <span>Route Optimization</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-medium">Ready</span>
              </div>
              <div className="flex justify-between">
                <span>XGBoost Predictor</span>
                <span className="text-cyan-600 dark:text-cyan-400 font-mono font-medium">Loaded</span>
              </div>
            </div>
          </div>

          {/* User Account Bar */}
          {isAuthenticated && (
            <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 truncate">
                <div className="w-7 h-7 rounded-lg bg-cyan-600 dark:bg-cyan-500/20 text-white dark:text-cyan-300 font-bold flex items-center justify-center shrink-0 text-[11px]">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                <div className="truncate">
                  <div className="font-bold text-slate-800 dark:text-slate-200 truncate leading-tight">
                    {user?.name || 'Dispatcher'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">
                    {user?.role || 'Fleet Operator'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="text-[10px] text-slate-400 text-center font-mono">
            RouteShield AI v2.4 • Isolated Profile
          </div>
        </div>
      </aside>
    </>
  );
}
