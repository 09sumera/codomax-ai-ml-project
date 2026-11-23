import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import AnalyzeRoute from './pages/AnalyzeRoute';
import Results from './pages/Results';
import History from './pages/History';
import Settings from './pages/Settings';
import SavedRoutes from './pages/SavedRoutes';
import OfflineRouteView from './pages/OfflineRouteView';
import DriverSafety from './pages/DriverSafety';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

function HomeRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 text-cyan-400 font-mono text-sm">
        <div className="w-9 h-9 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <div>Initializing RouteShield Platform...</div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <AppShell>
        <Dashboard />
      </AppShell>
    );
  }

  return <LandingPage />;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 text-cyan-400 font-mono text-sm">
        <div className="w-9 h-9 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <div>Verifying Credentials...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell>{children}</AppShell>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Root Route: Landing Page if unauth, Dashboard if auth */}
            <Route path="/" element={<HomeRoute />} />

            {/* Standalone Project Overview & Features Page */}
            <Route path="/welcome" element={<LandingPage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<AuthPage initialMode="login" />} />
            <Route path="/signup" element={<AuthPage initialMode="signup" />} />

            {/* Protected Core Application Modules */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/analyze"
              element={
                <ProtectedRoute>
                  <AnalyzeRoute />
                </ProtectedRoute>
              }
            />
            <Route
              path="/results"
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              }
            />
            <Route
              path="/history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/saved-routes"
              element={
                <ProtectedRoute>
                  <SavedRoutes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/safety"
              element={
                <ProtectedRoute>
                  <DriverSafety />
                </ProtectedRoute>
              }
            />
            <Route
              path="/offline-routes/:id"
              element={
                <ProtectedRoute>
                  <OfflineRouteView />
                </ProtectedRoute>
              }
            />

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
