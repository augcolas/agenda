// LogoutPage.tsx
import type React from "react";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { logoutUserService } from "../../services/user.service";

const LogoutPage: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logoutUserService()
      .then(() => {
        logout();
        navigate("/");
        return null;
      })
      .catch((error) => {
        console.error("Error logging out the user:", error);
      });
  }, [logout, navigate]);

  return (
    <div>
      <h1>Déconnexion</h1>
      <p>Vous êtes en train d&#39;être déconnecté...</p>
    </div>
  );
};

export default LogoutPage;
