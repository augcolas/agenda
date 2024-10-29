// LogoutPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const LogoutPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // Déconnecte l'utilisateur
    navigate('/'); // Redirige vers la page de connexion
  }, [logout, navigate]);

  return (
    <div>
      <h1>Déconnexion</h1>
      <p>Vous êtes en train d'être déconnecté...</p>
    </div>
  );
};

export default LogoutPage;
