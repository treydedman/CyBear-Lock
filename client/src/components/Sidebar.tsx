import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiSettings, FiLogOut, FiKey } from 'react-icons/fi';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`relative h-screen transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-60'
      } bg-white dark:bg-gray-700 border-r border-gray-300 dark:border-gray-700 shadow-md mt-20 rounded-t-xl`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-300 rounded-full text-gray-300 hover:text-gray-900 dark:hover:text-teal-500 transition">
        {isCollapsed ? '→' : '←'}
      </button>

      <nav className="mt-12 flex-1">
        <Link
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          to="/">
          <FiHome className="text-xl" />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>

        <Link
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          to="/new-password">
          <FiKey className="text-xl" />
          {!isCollapsed && <span>New Password</span>}
        </Link>

        <Link
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          to="/settings">
          <FiSettings className="text-xl" />
          {!isCollapsed && <span>Settings</span>}
        </Link>
      </nav>

      <button className="flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-800 transition">
        <FiLogOut className="text-xl" />
        {!isCollapsed && <span>Sign Out</span>}
      </button>
    </aside>
  );
}
