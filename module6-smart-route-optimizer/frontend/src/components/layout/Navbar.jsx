import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ShieldAlert, Settings, RefreshCw, PlusCircle, LogOut, Compass, User } from 'lucide-react';
import { checkHealth } from '../../services/api';
import ThemeToggle from '../common/ThemeToggle';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onToggleSidebar, isSidebarOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [systemStatus, setSystemStatus] = useState('checking'); // checking, healthy, offline
  const [utcTime, setUtcTime] = useState(() => {
    return new Date().toISOString().substring(11, 19);
  });

  const getInitials = (name) => {
    if (!name) return 'OP';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    if (window.confirm('Sign out of RouteShield?')) {
      logout();
      navigate('/welcome');
    }
  };

  const verifySystem = async () => {
    setSystemStatus('checking');
    const res = await checkHealth();
    if (res.success) {
      setSystemStatus('healthy');
    } else {
      setSystemStatus('offline');
    }
  };

  useEffect(() => {
    verifySystem();
    const timer = setInterval(verifySystem, 45000);
    const clockTimer = setInterval(() => {
      setUtcTime(new Date().toISOString().substring(11, 19));
    }, 1000);
    return () => {
      clearInterval(timer);
      clearInterval(clockTimer);
    };
  }, []);

  return (
    <div className="sticky top-0 z-30 flex flex-col">
      {/* Main Top Header */}
      <header className="h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 flex items-center justify-between transition-colors">
        <div className="flex items-center space-x-3">
          {/* Mobile Hamburger Menu Toggle */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800 transition"
            aria-label="Toggle Navigation Menu"
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-cyan-500/10 border border-sky-200 dark:border-cyan-500/30 flex items-center justify-center text-sky-600 dark:text-cyan-400 shadow-sm group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5 text-sky-600 dark:text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                  RouteShield
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-100 dark:bg-cyan-500/20 text-sky-700 dark:text-cyan-300 border border-sky-200 dark:border-cyan-500/40">
                  AI
                </span>
              </div>
              <div className="hidden sm:flex items-center space-x-2 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold">AI Engine Active</span>
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-slate-500 dark:text-slate-400">#SHP-8842-XGB</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Right Topbar Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick System Health Status Indicator */}
          <button
            onClick={verifySystem}
            title="Click to re-check backend status"
            className={`hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-medium border transition ${
              systemStatus === 'healthy'
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
                : systemStatus === 'checking'
                ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/30 hover:bg-rose-100 dark:hover:bg-rose-500/20'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${
              systemStatus === 'healthy' ? 'bg-emerald-500 animate-pulse' :
              systemStatus === 'checking' ? 'bg-amber-500 animate-spin' : 'bg-rose-500'
            }`}></span>
            <span className="font-mono text-[11px]">
              {systemStatus === 'healthy' ? 'Engine Online' :
               systemStatus === 'checking' ? 'Connecting...' : 'Engine Offline'}
            </span>
            <RefreshCw className={`w-3 h-3 text-slate-400 ${systemStatus === 'checking' ? 'animate-spin' : ''}`} />
          </button>

          {/* Quick Analyze Button */}
          {location.pathname !== '/analyze' && (
            <Link
              to="/analyze"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-500/10 dark:hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 text-xs font-semibold transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Analysis</span>
            </Link>
          )}

          {/* Theme Mode Switcher (Light / Dark) */}
          <ThemeToggle />

          {/* Settings Shortcut Button */}
          <Link
            to="/settings"
            title="System Settings"
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <Settings className="w-4 h-4" />
            <span className="sr-only">Settings</span>
          </Link>

          {/* Project Overview Link */}
          <Link
            to="/welcome"
            title="RouteShield System Overview & Features"
            className="hidden xl:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition text-xs font-semibold"
          >
            <Compass className="w-4 h-4 text-cyan-500" />
            <span>Overview</span>
          </Link>

          {/* User Profile Avatar with Details */}
          <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-800 pl-2 sm:pl-3">
            <Link
              to="/settings"
              title="View Profile in Settings"
              className="w-8 h-8 rounded-full bg-cyan-600 dark:bg-cyan-500/20 text-white dark:text-cyan-300 border border-cyan-500/30 flex items-center justify-center font-bold text-xs shadow-sm hover:scale-105 transition-transform"
            >
              {getInitials(user?.name)}
            </Link>
            <div className="hidden lg:block text-left leading-tight">
              <div className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate max-w-[130px]">
                {user?.name || 'Dispatcher'}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate max-w-[130px]">
                {user?.company || 'Fleet Command'}
              </div>
            </div>

            {/* Logout Action Button */}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                title="Sign out of RouteShield"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="sr-only">Sign out</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* OPS MONITOR & UTC Telemetry Strip (Directly from reference design) */}
      <div className="bg-slate-100/90 dark:bg-slate-950/90 backdrop-blur border-b border-slate-200 dark:border-slate-800 px-4 lg:px-6 py-1.5 flex items-center justify-between text-[11px] font-mono transition-colors">
        <div className="flex items-center space-x-2 text-cyan-800 dark:text-cyan-400 font-bold tracking-wider uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>OPS MONITOR // SECTOR 04-ATLANTIC</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded px-2.5 py-0.5 shadow-xs">
            <span className="text-slate-500 dark:text-slate-400">UTC</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{utcTime}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1"></span>
            <span className="text-emerald-700 dark:text-emerald-400 font-bold tracking-wider">SYNC</span>
          </div>
        </div>
      </div>
    </div>
  );
}
