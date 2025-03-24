import { useContext, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { UserContext } from '../components/UserContext';
import { readToken } from '../lib/data';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

type PasswordEntry = {
  website: string;
  accountUsername: string;
  password?: string; // Decrypted password
};

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    async function fetchEntries() {
      try {
        setIsLoading(true);
        const token = readToken();

        if (!token) {
          setError('Authentication failed: No token found.');
          return;
        }

        const response = await fetch('/api/passwords', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const entries = await response.json();
        setEntries(entries);
      } catch (e) {
        console.error('Failed to fetch entries:', e);
        setError(e instanceof Error ? e.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    }

    fetchEntries();
  }, []);

  async function fetchDecryptedPassword(
    website: string,
    accountUsername: string
  ) {
    try {
      const token = readToken();
      const response = await fetch(
        `/api/passwords/${website}/${accountUsername}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const { password } = await response.json();
      setEntries((prev) =>
        prev.map((entry) =>
          entry.website === website && entry.accountUsername === accountUsername
            ? { ...entry, password }
            : entry
        )
      );
    } catch (e) {
      console.error('Failed to fetch password:', e);
    }
  }

  function togglePasswordVisibility(entryKey: string) {
    setVisiblePasswords((prev) => ({
      ...prev,
      [entryKey]: !prev[entryKey],
    }));
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          {`Good ${new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}, ${
            user?.username || 'User'
          }`}
        </h1>

        {isLoading && (
          <p className="text-gray-500 dark:text-gray-400">Loading entries...</p>
        )}
        {error && <p className="text-red-500">{error}</p>}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.length > 0 ? (
              entries.map((entry) => {
                const entryKey = `${entry.website}-${entry.accountUsername}`;
                return (
                  <div
                    key={entryKey}
                    className="p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md border dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {entry.website}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300">
                      Username: {entry.accountUsername}
                    </p>

                    <div className="mt-2 flex items-center">
                      <button
                        onClick={() => {
                          if (!entry.password) {
                            fetchDecryptedPassword(
                              entry.website,
                              entry.accountUsername
                            );
                          }
                          togglePasswordVisibility(entryKey);
                        }}
                        className="text-blue-500 hover:underline">
                        {visiblePasswords[entryKey]
                          ? 'Hide Password'
                          : 'Show Password'}
                      </button>
                      {entry.password && visiblePasswords[entryKey] && (
                        <span className="ml-2 text-gray-900 dark:text-white">
                          {entry.password}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No password entries found.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
