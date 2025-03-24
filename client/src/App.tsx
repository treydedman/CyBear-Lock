import { RegistrationForm } from './components/RegistrationForm';
import { SignInForm } from './components/SignInForm';
import { UserProvider } from './components/UserContext';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import NewEntry from './pages/NewEntry';
import { Route, Routes } from 'react-router-dom';
import './App.css';

export default function App() {
  return (
    <>
      <UserProvider>
        <Header />
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auth/sign-in" element={<SignInForm />} />
            <Route path="/auth/sign-up" element={<RegistrationForm />} />
            <Route path="/new-password" element={<NewEntry />} />
          </Routes>
        </div>
      </UserProvider>
    </>
  );
}
