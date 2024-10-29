// LoginPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/LoginForm/LoginForm';
import { useAuth } from '../../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (email: string) => {
    // Simuler un utilisateur récupéré depuis une API après la connexion
    const fakeUser = {
      id: '123',
      firstName: 'Jean',
      lastName: 'Dupont',
      email,
    };
    login(fakeUser);
    navigate('/calendar'); // Redirige vers la page d'accueil
  };

  return (
    <div>
      <h1>Connexion</h1>
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;
