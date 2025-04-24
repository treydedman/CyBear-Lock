import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import zxcvbn from 'zxcvbn';

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<number | null>(null);
  const [passwordFeedback, setPasswordFeedback] = useState('');
  const navigate = useNavigate();

  // Password strength meter logic
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value;
    setPassword(newPassword);

    if (!newPassword) {
      setPasswordStrength(null);
      setPasswordFeedback('');
      return;
    }

    const result = zxcvbn(newPassword);
    setPasswordStrength(result.score);

    // Password validation conditions
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    const isLongEnough = newPassword.length >= 8;

    const passwordConditions = [
      hasUpperCase
        ? ''
        : 'Password should contain at least one uppercase letter.',
      hasNumber ? '' : 'Password should contain at least one number.',
      hasSpecialChar
        ? ''
        : 'Password should contain at least one special character.',
      isLongEnough ? '' : 'Password should be at least 8 characters long.',
    ].filter(Boolean);

    setPasswordFeedback(passwordConditions.join('\n'));
  };

  // Handle form submission
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIsLoading(true);
      const formData = new FormData(event.currentTarget);
      const userData = Object.fromEntries(formData);

      const req = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          username: userData.username,
          password: userData.password,
        }),
      };

      const res = await fetch('/api/auth/sign-up', req);

      if (!res.ok) {
        throw new Error(`fetch Error ${res.status}`);
      }
      const user = await res.json();
      alert(`Successfully registered ${user.username}.`);
      navigate('/auth/sign-in');
    } catch (err) {
      alert(`Error registering user: ${err}`);
    } finally {
      setIsLoading(false);
    }
  }

  // Password strength display
  const getStrengthText = (score: number) => {
    if (!password) return '';

    switch (score) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Strong';
      case 4:
        return 'Very Strong';
      default:
        return '';
    }
  };

  const getStrengthClass = (score: number | null) => {
    if (score === null) return 'bg-white';
    return (
      [
        'bg-red-500',
        'bg-amber-500',
        'bg-yellow-400',
        'bg-green-500',
        'bg-green-700',
      ][score] || 'bg-white'
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm sm:max-w-sm md:max-w-sm lg:max-w-sm bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-blue-950">
          Sign Up
        </h2>
        <p className="text-sm text-gray-500 text-center mt-2">
          Create an account with us
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col space-y-6">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 block text-sm"
            />
          </div>

          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 block text-sm"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 block text-sm"
            />

            {/* Password Strength Meter */}
            <div>
              <div
                className={`w-full h-3 rounded-full mt-2 ${getStrengthClass(
                  passwordStrength
                )}`}
              />
              <p className="mt-1 text-medium text-center text-gray-700 font-semibold">
                {getStrengthText(passwordStrength ?? 0)}
              </p>
              {passwordFeedback && (
                <pre className="mt-2 text-xs text-red-500 font-sans">
                  {passwordFeedback}
                </pre>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full px-4 py-2 text-white bg-blue-950 rounded-lg hover:bg-blue-900 transition disabled:bg-gray-400">
            {isLoading ? 'Registering...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500 text-center">
          Already have an account?{' '}
          <Link
            to="/auth/sign-in"
            className="relative font-bold text-blue-950 hover:underline before:absolute before:bottom-0 before:left-0 before:h-[2px] before:w-0 before:bg-blue-950 before:transition-all before:duration-500 hover:before:w-full">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
