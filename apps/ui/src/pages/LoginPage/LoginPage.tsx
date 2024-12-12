import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LoginForm from "../../components/LoginForm/LoginForm";
import { useAuth } from "../../contexts/AuthContext";
import { logUserService } from "../../services/user.service";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (email: string, pwd: string) => {
    setError(null);
    try {
      const jwt = await logUserService(email, pwd);
      login(jwt.token);
      navigate("/");
    } catch (error_: unknown) {
      if (error_ instanceof Error) {
        if (error_.message.includes("401")) {
          setError("Email ou mot de passe incorrect.");
        } else {
          setError("Une erreur est survenue.");
        }
      } else {
        setError("Une erreur est survenue.");
      }
      console.error("Login failed:", error_);
    }
  };

  return (
    <div className="auth-form">
      <h1>Connexion</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <LoginForm onSubmit={handleLogin} />
    </div>
  );
};

export default LoginPage;
