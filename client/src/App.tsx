import { useEffect, useState } from 'react';
import { readUser, readToken } from './lib/data';
import { RegistrationForm } from './components/RegistrationForm';
import { SignInForm } from './components/SignInForm';
import { UserProvider } from './components/UserContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import NewEntry from './pages/NewEntry';
import { ProfilePage } from './pages/ProfilePage';
import { Route, Routes } from 'react-router-dom';
import './App.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    readUser();
    readToken();
    setIsLoading(false);
  }, []);

  if (isLoading) return null;
  return (
    <>
      <UserProvider>
        <Header />
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<SignInForm />} />
            <Route path="/auth/sign-in" element={<SignInForm />} />
            <Route path="/auth/sign-up" element={<RegistrationForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/new-password" element={<NewEntry />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </UserProvider>
    </>
  );
}
