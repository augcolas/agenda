import type React from 'react';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LoginForm from '../../components/LoginForm/LoginForm';
import { useAuth } from '../../contexts/AuthContext';
import { logUserService } from '../../services/user.service';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, pwd: string) => {
    setError(null); // Clear any existing error
    try {
      const jwt = await logUserService(email, pwd);
      login(jwt.token);
      navigate('/calendar'); // Redirect to calendar page
    } catch (error_: unknown) {
      // Handle different error cases
      if (error_ instanceof Error) {
        if (error_.message.includes('401')) {
          setError('Invalid credentials. Please try again.');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      } else {
        setError('An unknown error occurred.');
      }
      console.error('Login failed:', error_);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;
