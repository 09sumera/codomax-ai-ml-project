import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle({ className = '', compact = false }) {
  const { theme, isDark, toggleTheme, setTheme } = useTheme();

  return (
    <div
      role="radiogroup"
      aria-label="Theme mode selector"
      className={`relative inline-flex items-center rounded-full p-1 transition-all select-none ${
        isDark
          ? 'bg-slate-900 border border-slate-700/80 shadow-inner'
          : 'bg-slate-100/90 border border-slate-200 shadow-inner'
      } ${className}`}
    >
      {/* Light Mode Option */}
      <button
        type="button"
        role="radio"
        aria-checked={!isDark}
        onClick={() => setTheme('light')}
        title="Switch to Light Mode"
        className={`relative z-10 flex items-center justify-center rounded-full transition-all duration-200 ${
          compact ? 'w-7 h-7' : 'w-8 h-8'
        } ${
          !isDark
            ? 'bg-white text-amber-500 shadow-sm scale-100'
            : 'text-slate-400 hover:text-slate-300'
        }`}
      >
        <Sun className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} transition-transform ${!isDark ? 'rotate-0' : 'rotate-45'}`} />
        <span className="sr-only">Light Mode</span>
      </button>

      {/* Dark Mode Option */}
      <button
        type="button"
        role="radio"
        aria-checked={isDark}
        onClick={() => setTheme('dark')}
        title="Switch to Dark Mode"
        className={`relative z-10 flex items-center justify-center rounded-full transition-all duration-200 ${
          compact ? 'w-7 h-7' : 'w-8 h-8'
        } ${
          isDark
            ? 'bg-slate-800 text-cyan-400 shadow-sm scale-100'
            : 'text-slate-400 hover:text-slate-600'
        }`}
      >
        <Moon className={`${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} transition-transform ${isDark ? 'rotate-0' : '-rotate-12'}`} />
        <span className="sr-only">Dark Mode</span>
      </button>
    </div>
  );
}
