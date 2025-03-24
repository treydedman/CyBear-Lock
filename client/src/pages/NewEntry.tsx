import NewPasswordForm from '../components/NewPasswordForm';
import { useNavigate } from 'react-router-dom';

export default function NewPasswordPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-blue-950">
          Add New Password
        </h2>

        <p className="text-sm text-gray-500 text-center mt-2">
          Securely store a new password entry
        </p>

        <NewPasswordForm onEntryAdded={() => navigate('/')} />
      </div>
    </div>
  );
}
