import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from './useUser';
import { FiHome, FiSettings, FiLogOut, FiKey } from 'react-icons/fi';

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { handleSignOut } = useUser();
  const navigate = useNavigate();

  return (
    <aside
      className={`relative min-h-screen transition-all duration-400 ${
        isCollapsed ? 'w-16' : 'w-60'
      } bg-white dark:bg-gray-700 border-r border-gray-100 dark:border-gray-700 shadow-md mt-20 rounded-xl`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 bg-gray-100 dark:bg-gray-800 border border-gray-500 dark:border-gray-400 rounded-full text-gray-500 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-500 transition">
        {isCollapsed ? '→' : '←'}
      </button>

      <nav className="mt-12 flex-1">
        <Link
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          to="/dashboard">
          <FiHome className="text-xl" />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>

        <Link
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          to="/new-password">
          <FiKey className="text-xl" />
          {!isCollapsed && <span>Add Password</span>}
        </Link>

        <Link
          className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          to="/profile">
          <FiSettings className="text-xl" />
          {!isCollapsed && <span>Profile</span>}
        </Link>
      </nav>

      <button
        onClick={() => {
          handleSignOut();
          navigate('/auth/sign-in');
        }}
        className="flex items-center space-x-3 p-3 rounded-lg text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-gray-800 transition">
        <FiLogOut className="text-xl" />
        {!isCollapsed && <span>Sign Out</span>}
      </button>
    </aside>
  );
}
