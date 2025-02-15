import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../hooks/useDarkMode';

export default function DarkModeToggle() {
  const { isDark, setIsDark } = useDarkMode();

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative inline-flex h-10 w-16 items-center rounded-full bg-gray-200 p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:bg-gray-700"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
    >
      <span
        className={`${
          isDark ? 'translate-x-6' : 'translate-x-0'
        } inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out dark:bg-gray-800`}
      >
        {isDark ? (
          <Moon className="h-8 w-8 p-1.5 text-blue-600" />
        ) : (
          <Sun className="h-8 w-8 p-1.5 text-yellow-500" />
        )}
      </span>
    </button>
  );
}