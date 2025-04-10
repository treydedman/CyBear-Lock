import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';

const Header = () => {
  // Initialize dark mode state from localStorage (default to light)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <header className="w-full bg-gray-700 px-6 py-4 flex items-center justify-between">
      <Link to="/dashboard" className="flex items-center">
        <img src="/cybear-lock.svg" alt="Logo" className="h-16 w-auto" />
      </Link>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="text-gray-300 hover:text-teal-500 transition">
        {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
      </button>
    </header>
  );
};

export default Header;
