import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/layout/PageHeader';
import { Cpu, Server, Sliders, RefreshCw, CheckCircle2, Sun, Moon, User, LogOut, ShieldCheck, Lock } from 'lucide-react';
import { checkHealth } from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';

export default function Settings() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [healthStatus, setHealthStatus] = useState(null);
  const [testingConnection, setTestingConnection] = useState(false);
  const { theme, setTheme, isDark } = useTheme();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
      navigate('/welcome');
    }
  };

  const testBackend = async () => {
    setTestingConnection(true);
    const res = await checkHealth();
    setHealthStatus(res);
    setTestingConnection(false);
  };

  useEffect(() => {
    testBackend();
  }, []);

  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

  return (
    <div className="space-y-6">
      <PageHeader
        title="System Settings & Telemetry"
        subtitle="RouteShield platform configuration, ML model status, and interface theme mode."
      />

      {/* User Profile & Multi-Tenant Security Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Operator Profile & Data Isolation</h3>
          </div>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-xs font-semibold flex items-center space-x-1.5 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase">Operator Name</div>
            <div className="font-bold text-sm text-slate-900 dark:text-white mt-1">{user?.name || 'Guest Operator'}</div>
            <div className="text-[11px] text-cyan-600 dark:text-cyan-400 font-mono mt-0.5">{user?.role || 'Unauthenticated'}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase">Registered Email</div>
            <div className="font-bold text-sm text-slate-900 dark:text-white mt-1">{user?.email || 'N/A'}</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{user?.company || 'Fleet Command'}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
            <div className="text-slate-500 dark:text-slate-400 font-mono text-[10px] uppercase">Data Isolation Scope</div>
            <div className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Isolated User ID</span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5 truncate" title={user?.user_id}>
              {user?.user_id || 'anonymous_session'}
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/20 border border-cyan-200 dark:border-cyan-500/30 text-xs text-cyan-800 dark:text-cyan-300 flex items-start space-x-2">
          <Lock className="w-4 h-4 shrink-0 mt-0.5 text-cyan-600 dark:text-cyan-400" />
          <div className="leading-relaxed text-[11px]">
            <strong>Data Privacy Guaranteed:</strong> All saved routes, analysis histories, and offline packages are cryptographically segregated. Other users of RouteShield cannot view or modify your data.
          </div>
        </div>
      </div>

      {/* Application Theme & Interface Preferences */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sliders className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Application Theme & Interface</h3>
          </div>
          <ThemeToggle />
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          Select your operational display profile. Preference is automatically saved to your browser session.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          {/* Light Theme Card */}
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              !isDark
                ? 'bg-sky-50/80 border-sky-400 ring-2 ring-sky-400/20 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-2">
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Sun className="w-3.5 h-3.5" />
                </div>
                Light Telemetry Center
              </span>
              {!isDark && <CheckCircle2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Ultra-crisp off-white slate profile with high-contrast vectors, precision gauges, and day-operations maritime clarity.
            </p>
          </button>

          {/* Dark Theme Card */}
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-xl border text-left transition-all relative ${
              isDark
                ? 'bg-cyan-500/10 border-cyan-500 ring-2 ring-cyan-500/20 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white mb-2">
              <span className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center">
                  <Moon className="w-3.5 h-3.5" />
                </div>
                Dark Command Center
              </span>
              {isDark && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              High contrast slate-950 theme with cyan & emerald telemetry accents tailored for nighttime logistics operations.
            </p>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backend Configuration & Live Connection */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Server className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Backend Connection & Diagnostics</h3>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <label className="text-slate-600 dark:text-slate-400 block mb-1">API Base Endpoint URL</label>
              <input
                type="text"
                readOnly
                value={apiBaseUrl}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-200"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Configured via VITE_API_BASE_URL</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900 dark:text-slate-200">Flask Server Ping Status</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {healthStatus?.success ? 'HTTP 200 OK — Ready to receive requests' : 'Disconnected'}
                </div>
              </div>

              <button
                onClick={testBackend}
                disabled={testingConnection}
                className="px-3 py-1.5 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 flex items-center space-x-1.5 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                <span>Test Ping</span>
              </button>
            </div>
          </div>
        </div>

        {/* ML Model Specifications */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Cpu className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Machine Learning Telemetry</h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Model Architecture:</span>
              <span className="text-slate-900 dark:text-white font-semibold">XGBoost Classifier v1.2</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Feature Preprocessor:</span>
              <span className="text-slate-900 dark:text-white font-semibold">Scikit-Learn Standard Pipeline</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-800">
              <span className="text-slate-600 dark:text-slate-400">Explainability Engine:</span>
              <span className="text-cyan-700 dark:text-cyan-400 font-semibold">SHAP (SHapley Additive exPlanations)</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-600 dark:text-slate-400">Required Input Schema:</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">14 Raw Features Validated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
