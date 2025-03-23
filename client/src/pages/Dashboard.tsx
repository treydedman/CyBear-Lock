import Sidebar from '../components/Sidebar';
import { useContext } from 'react';
import { UserContext } from '../components/UserContext';
// import ThemeToggle from '../components/ThemeToggle';

export default function Dashboard() {
  const { user } = useContext(UserContext);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Dashboard Content */}
      <div className="flex-1 p-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {`Good ${new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, ${
              user?.username || 'User'
            }`}
          </h1>
          {/* <ThemeToggle /> */}
        </div>

        {/* Placeholder for password entries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Password cards will go here */}
          <div className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md border dark:border-gray-700">
            <p className="text-gray-700 dark:text-gray-300">Password Entry</p>
          </div>
        </div>
      </div>
    </div>
  );
}
