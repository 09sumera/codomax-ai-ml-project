import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, signupApi, getCurrentUserApi, getDemoAccountApi } from '../services/authApi';

const AuthContext = createContext(null);

const TOKEN_KEY = 'routeshield_auth_token';
const USER_KEY = 'routeshield_auth_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });

  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Validate or refresh session on app startup
  useEffect(() => {
    async function verifySession() {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      if (savedToken) {
        try {
          const res = await getCurrentUserApi();
          const validUser = res?.user || res?.data?.user;
          if (validUser) {
            setUser(validUser);
            localStorage.setItem(USER_KEY, JSON.stringify(validUser));
          }
        } catch (err) {
          // Token is expired or backend rejected it
          console.warn('Session verification notice:', err.message);
          // Only clear if token is definitely invalid (401)
          if (err.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    }
    verifySession();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await loginApi({ email, password });
      const authToken = res?.token || res?.data?.token;
      const authUser = res?.user || res?.data?.user;

      if (!authToken || !authUser) {
        throw new Error('Authentication response is missing user credentials');
      }

      setToken(authToken);
      setUser(authUser);
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));
      return { success: true, user: authUser };
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setAuthError(msg);
      throw err;
    }
  };

  const signup = async (formData) => {
    setAuthError(null);
    try {
      const res = await signupApi(formData);
      const authToken = res?.token || res?.data?.token;
      const authUser = res?.user || res?.data?.user;

      if (!authToken || !authUser) {
        throw new Error('Registration response is missing user credentials');
      }

      setToken(authToken);
      setUser(authUser);
      localStorage.setItem(TOKEN_KEY, authToken);
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));
      return { success: true, user: authUser };
    } catch (err) {
      const msg = err.message || 'Registration failed. Please check details.';
      setAuthError(msg);
      throw err;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const getDemoCredentials = async () => {
    try {
      const res = await getDemoAccountApi();
      return res?.data || res;
    } catch {
      return {
        email: 'demo@routeshield.ai',
        password: 'routeshield123',
        name: 'Alex Mercer',
        role: 'Chief Logistics Controller',
        company: 'Pacific-Atlantic Cargo Line'
      };
    }
  };

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    loading,
    authError,
    setAuthError,
    login,
    signup,
    logout,
    getDemoCredentials,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
