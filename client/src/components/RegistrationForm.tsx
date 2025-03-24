import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
          {/* Moved Email to the Top */}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 block text-sm"
            />
          </div>

          {/* Username in the Middle */}
          <div>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 block text-sm"
            />
          </div>

          {/* Password at the Bottom */}
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 block text-sm"
            />
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
