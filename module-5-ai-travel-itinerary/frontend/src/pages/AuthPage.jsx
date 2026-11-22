import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  Lock, 
  Mail, 
  User, 
  Building, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  RefreshCw,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/common/ThemeToggle';

export default function AuthPage({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup, isAuthenticated, getDemoCredentials, authError, setAuthError } = useAuth();

  // Determine mode from prop or path
  const isSignupPath = location.pathname === '/signup' || initialMode === 'signup';
  const [isLogin, setIsLogin] = useState(!isSignupPath);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Fleet Dispatcher',
    company: 'Global Logistics Corp',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    setIsLogin(location.pathname !== '/signup');
    setLocalError('');
    setAuthError(null);
  }, [location.pathname, setAuthError]);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    setAuthError(null);

    if (isLogin) {
      if (!formData.email || !formData.password) {
        setLocalError('Please enter both email and password.');
        return;
      }

      setLoading(true);
      try {
        await login(formData.email, formData.password);
        navigate('/dashboard', { replace: true });
      } catch (err) {
        setLocalError(err.message || 'Login failed. Please check credentials.');
      } finally {
        setLoading(false);
      }
    } else {
      // Signup validation
      if (!formData.name.trim()) {
        setLocalError('Please enter your full name.');
        return;
      }
      if (!formData.email.trim() || !formData.email.includes('@')) {
        setLocalError('Please enter a valid work email.');
        return;
      }
      if (formData.password.length < 6) {
        setLocalError('Password must be at least 6 characters.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setLocalError('Passwords do not match.');
        return;
      }

      setLoading(true);
      try {
        await signup({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role,
          company: formData.company.trim(),
        });
        navigate('/dashboard', { replace: true });
      } catch (err) {
        setLocalError(err.message || 'Registration failed. Email may already be in use.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleQuickDemoLogin = async () => {
    setDemoLoading(true);
    setLocalError('');
    try {
      const demo = await getDemoCredentials();
      setFormData((prev) => ({
        ...prev,
        email: demo.email,
        password: demo.password,
      }));
      await login(demo.email, demo.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setLocalError('Demo login error: ' + err.message);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-slate-950 relative overflow-hidden font-sans transition-colors duration-200">
      {/* Ambient background gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-cyan-200/50 dark:bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-200/50 dark:bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link to="/welcome" className="flex items-center space-x-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-105 transition-transform shadow-xs">
            <ShieldAlert className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                RouteShield
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-100 dark:bg-cyan-500/20 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/40">
                AI
              </span>
            </div>
          </div>
        </Link>

        <div className="flex items-center space-x-3">
          <Link
            to="/welcome"
            className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition flex items-center space-x-1"
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Project Overview</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Authentication Card Grid */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-xl dark:shadow-2xl backdrop-blur-xl p-6 sm:p-8 transition-colors">
          
          {/* Brand Icon & Heading */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mx-auto mb-3 shadow-xs">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {isLogin ? 'Sign In to RouteShield' : 'Create Operator Account'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isLogin
                ? 'Enter your credentials to access your isolated fleet intelligence cockpit.'
                : 'Join enterprise dispatchers and operators using AI disruption protection.'}
            </p>
          </div>
            {/* Tab Switcher */}
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-950 p-1 border border-slate-200 dark:border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  navigate('/login', { replace: true });
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  isLogin
                    ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  navigate('/signup', { replace: true });
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  !isLogin
                    ? 'bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Create Account (Sign Up)
              </button>
            </div>

            {/* Error Notification Alert */}
            {(localError || authError) && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-400 text-xs flex items-start space-x-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-tight">{localError || authError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <>
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Jordan Hayes"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                        required
                      />
                    </div>
                  </div>

                  {/* Role & Company */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Operational Role
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                      >
                        <option value="Fleet Dispatcher">Fleet Dispatcher</option>
                        <option value="Chief Logistics Officer">Chief Logistics Officer</option>
                        <option value="Logistics Analyst">Logistics Analyst</option>
                        <option value="Commercial Driver">Commercial Driver</option>
                        <option value="Terminal Operator">Terminal Operator</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                        Fleet / Company Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Building className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          name="company"
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="e.g. TransPacific Freight"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@logistics.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {!isLogin && (
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 block">
                    Must be at least 6 characters.
                  </span>
                )}
              </div>

              {/* Confirm Password (only on Signup) */}
              {!isLogin && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white dark:from-cyan-400 dark:to-blue-500 dark:hover:from-cyan-300 dark:hover:to-blue-400 dark:text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20 transition flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white dark:text-slate-950" />
                  ) : (
                    <>
                      <span>{isLogin ? 'Sign In to RouteShield' : 'Create Account & Start'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* 1-Click Demo Sandbox */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 dark:text-slate-500">
                  Or instant sandbox
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={demoLoading}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-cyan-500/40 bg-cyan-50/50 hover:bg-cyan-100/50 dark:bg-cyan-950/20 dark:hover:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 font-semibold text-xs transition flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {demoLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-600 dark:text-cyan-400" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                  <span>1-Click Demo Controller Sign In</span>
                </>
              )}
            </button>

            {/* Toggle Link Footer */}
            <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
              {isLogin ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      navigate('/signup');
                    }}
                    className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    Sign up now
                  </button>
                </span>
              ) : (
                <span>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      navigate('/login');
                    }}
                    className="font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
                  >
                    Sign in here
                  </button>
                </span>
              )}
            </div>
          </div>
        </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-[11px] font-mono text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800">
        RouteShield AI Logistics Disruption Prediction & Rerouting &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
