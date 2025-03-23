import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa';

const Header = () => {
  const [darkMode, setDarkMode] = useState(() => {
    return (
      localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
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
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src="/public/CyBear Lock.svg" alt="Logo" className="h-16 w-auto" />
      </Link>

      {/* Light/Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="text-gray-300 hover:text-teal-500 transition">
        {darkMode ? <FaSun size={24} /> : <FaMoon size={24} />}
      </button>
    </header>
  );
};

export default Header;
