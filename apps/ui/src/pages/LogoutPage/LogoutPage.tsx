// LogoutPage.tsx
import type React from 'react';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import { logoutUserService } from '../../services/user.service';


const LogoutPage: React.FC = () => {
  const { logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout(); // Déconnecte l'utilisateur

    logoutUserService(token).catch((error) => {
      console.error('Error logging out the user:', error);
    });

    navigate('/'); // Redirige vers la page de connexion
  }, [logout, navigate, token]);

  return (
    <div>
      <h1>Déconnexion</h1>
      <p>Vous êtes en train d&#39;être déconnecté...</p>
    </div>
  );
};

export default LogoutPage;
