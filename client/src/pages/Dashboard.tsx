import { useContext, useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { UserContext } from '../components/UserContext';
import { readToken } from '../lib/data';
import { FaEye, FaEyeSlash, FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import Modal from '../components/Modal';

type PasswordEntry = {
  entryId: number;
  website: string;
  accountUsername: string;
  encryptedPassword: string;
  password: string;
  category: string | null;
  tags: string | null;
};

export default function Dashboard() {
  const { user } = useContext(UserContext);
  const [entries, setEntries] = useState<PasswordEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<{
    [key: string]: boolean;
  }>({});
  const [editEntry, setEditEntry] = useState<PasswordEntry | null>(null);
  const [newPassword, setNewPassword] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<number | null>(null);

  const fetchEntries = async () => {
    try {
      setIsLoading(true);
      const token = readToken();
      if (!token) {
        setError('Authentication failed: No token found.');
        return;
      }
      const res = await fetch('/api/passwords', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      const entries = await res.json();
      setEntries(entries);

      // Reset visiblePasswords after fetch
      setVisiblePasswords({});
    } catch (e) {
      console.error('Failed to fetch entries:', e);
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchDecryptedPassword(
    website: string,
    accountUsername: string
  ) {
    try {
      const token = readToken();
      const res = await fetch(`/api/passwords/${website}/${accountUsername}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }

      const { password } = await res.json();
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

  const handleDelete = async (entryId: number | undefined) => {
    try {
      if (!entryId) {
        console.error('Invalid entry ID:', entryId);
        throw new Error('Invalid entry ID');
      }

      const token = readToken();

      if (!token) {
        throw new Error('Authentication token missing');
      }

      const response = await fetch(`/api/passwords/${entryId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      alert('Password entry deleted successfully');
      await fetchEntries();

      setIsModalVisible(false);
      setEntryToDelete(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      alert(`Error deleting password: ${errorMessage}`);
    }
  };

  // Trigger delete with confirmation modal
  const handleDeleteClick = (entryId: number) => {
    setEntryToDelete(entryId);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEntryToDelete(null);
  };

  const handleUpdate = async (
    entryId: number | string | undefined,
    newPassword: string
  ) => {
    try {
      if (!entryId || !newPassword) {
        throw new Error('Invalid entry or password');
      }
      const token = readToken();
      if (!token) {
        throw new Error('Authentication token missing');
      }
      const response = await fetch(`/api/passwords/${entryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Error ${response.status}: ${
            errorData.message || response.statusText
          }`
        );
      }

      alert('Password updated successfully');
      setEditEntry(null);
      setNewPassword('');

      // After updating, re-fetch entries
      await fetchEntries();

      // Set visibility to true for updated entry
      const updatedEntry = entries.find((entry) => entry.entryId === entryId);
      if (updatedEntry) {
        const entryKey = `${updatedEntry.website}-${updatedEntry.accountUsername}`;
        setVisiblePasswords({ [entryKey]: true });

        // Re-fetch decrypted password
        await fetchDecryptedPassword(
          updatedEntry.website,
          updatedEntry.accountUsername
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      alert(`Error updating password: ${errorMessage}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-200 mb-6">
          {`Good ${new Date().getHours() < 12 ? 'morning' : 'afternoon'}, ${
            user?.username || 'User'
          }`}
        </h1>

        {isLoading && (
          <p className="text-gray-500 dark:text-gray-400">Loading entries...</p>
        )}
        {error && <p className="text-red-500">{error}</p>}

        {!isLoading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {entries.length > 0 ? (
              entries.map((entry) => {
                const entryKey = `${entry.website}-${entry.accountUsername}`;
                const isVisible = visiblePasswords[entryKey];

                return (
                  <div
                    key={entryKey}
                    className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-md border dark:border-gray-700 w-full max-w-[500px]">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                      {entry.website}
                    </h2>
                    <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
                      Username: {entry.accountUsername}
                    </p>

                    <div className="mt-2 flex items-center justify-between bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded-md">
                      <span className=" text-gray-900 dark:text-white font-mono truncate">
                        {entry.password && isVisible
                          ? entry.password
                          : '••••••••••••'}
                      </span>
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
                        className="text-gray-600 dark:text-gray-300 hover:text-teal-500">
                        {isVisible ? (
                          <FaEyeSlash size={18} />
                        ) : (
                          <FaEye size={18} />
                        )}
                      </button>
                    </div>

                    <div className="mt-4 flex flex-col space-y-2">
                      {editEntry?.website === entry.website &&
                      editEntry.accountUsername === entry.accountUsername ? (
                        <>
                          <input
                            type="text"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                            className="p-2 bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                          />
                          <div className="flex justify-between items-center mt-2">
                            <button
                              onClick={() => {
                                handleUpdate(entry.entryId, newPassword);
                              }}
                              className="text-gray-300 hover:text-teal-500 text-sm font-medium">
                              Save
                            </button>
                            <button
                              onClick={() => setEditEntry(null)}
                              className="text-red-400 hover:text-red-500 hover:font-semibold text-sm font-medium">
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex justify-between items-center space-x-2">
                            <button
                              onClick={() => setEditEntry(entry)}
                              className="text-teal-500 hover:text-teal-300 text-sm">
                              <FaPencilAlt size={20} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(entry.entryId)}
                              className="text-red-400 hover:text-red-500 text-sm">
                              <FaTrashAlt size={20} />
                            </button>
                          </div>
                        </>
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
      {isModalVisible && (
        <Modal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          onConfirm={() => entryToDelete && handleDelete(entryToDelete)}
        />
      )}
    </div>
  );
}
