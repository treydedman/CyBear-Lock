import { RegistrationForm } from './components/RegistrationForm';
import { SignInForm } from './components/SignInForm';
import { UserProvider } from './components/UserContext';
import { Route, Routes } from 'react-router-dom';
import './App.css';

export default function App() {
  return (
    <>
      <UserProvider>
        <Routes>
          <Route path="/auth/sign-in" element={<SignInForm />} />
          <Route path="/auth/sign-up" element={<RegistrationForm />} />
        </Routes>
      </UserProvider>
    </>
  );
}
