import { useState, FormEvent } from 'react';
import { useUser } from '../components/useUser';
import { useNavigate } from 'react-router-dom';
import { readToken } from '../lib/data';
import Sidebar from '../components/Sidebar';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handlePasswordReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (user?.username === 'Guest') {
      setError('Guest users cannot reset their password.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      const token = readToken();

      const req = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      };
      const res = await fetch('/api/auth/reset-password', req);

      if (!res.ok) {
        throw new Error(`Error: ${res.status}`);
      }

      setSuccessMessage('Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(`Failed to reset password. ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteAccount() {
    if (user?.username === 'Guest') {
      alert('Guest users cannot delete their account.');
      return;
    }

    const confirmDelete = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone.'
    );
    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      const token = readToken();
      const req = {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      };

      const res = await fetch('/api/auth/delete-account', req);
      if (!res.ok) {
        throw new Error(`Error ${res.status}`);
      }

      alert('Account deleted successfully');
      navigate('/auth/sign-up');
    } catch (err) {
      alert(`Failed to delete account: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
      <Sidebar />

      <div className="flex-1 p-6">
        <h1 className="text-2xl font-medium text-gray-900 dark:text-gray-200 mb-6">
          Profile Settings
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User Info Card */}
          <div className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md border dark:border-gray-700 w-full max-w-[500px]">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Account Info
            </h2>
            <p className="text-md text-gray-700 text-semibold dark:text-gray-300">
              Username: {user?.username}
            </p>
            <p className="text-md text-gray-700 text-semibold dark:text-gray-300">
              Email: {user?.email || 'No email'}
            </p>
          </div>

          {/* Password Reset Form */}
          <div className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md border dark:border-gray-700 w-full max-w-[500px]">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Reset Password
            </h2>

            {error && <p className="text-red-500 mb-2">{error}</p>}
            {successMessage && (
              <p className="text-green-500 mb-2">{successMessage}</p>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="New Password"
                required
                className="w-full p-2 bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                className="w-full p-2 bg-gray-600 border border-gray-300 dark:border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-950 text-white py-2 rounded-md hover:bg-teal-500 transition disabled:bg-gray-400">
                {isLoading ? 'Updating...' : 'Reset Password'}
              </button>
            </form>
          </div>

          {/* Delete Account Card */}
          <div className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow-md border dark:border-gray-700 w-full max-w-[500px]">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Danger Zone
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Caution, once deleted, your account cannot be restored!
            </p>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-700 transition disabled:bg-gray-400">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
