import NewPasswordForm from '../components/NewPasswordForm';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function NewPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-800">
      <Sidebar />
      <div className="flex flex-col flex-1 p-6">
        <div className="w-full max-w-[500px] bg-white dark:bg-gray-700 shadow-md border-none dark:border-gray-700 p-6 sm:p-8 rounded-xl shadow-lg mt-14">
          <h2 className="text-3xl font-semibold text-center text-blue-950 dark:text-white">
            Add New Password
          </h2>

          <p className="text-md text-gray-700 text-semibold dark:text-gray-300 text-center mt-2">
            Securely store a new password entry
          </p>

          <NewPasswordForm onEntryAdded={() => navigate('/dashboard')} />
        </div>
      </div>
    </div>
  );
}
