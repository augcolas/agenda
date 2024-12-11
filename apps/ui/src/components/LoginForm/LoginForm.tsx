import type React from "react";

import { useState } from "react";

import "./LoginForm.css";
import { Link } from "react-router-dom";

interface LoginFormProps {
  readonly onSubmit: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <label htmlFor="email" className="form-label">
        Adresse Email
        <input
          type="email"
          id="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          className="form-input"
        />
      </label>

      <label htmlFor="password" className="form-label">
        Mot de passe
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className="form-input"
        />
      </label>

      <Link to="/forget-password" className="forget-password-link">
        Mot de passe oublié ?
      </Link>

      <button type="submit" className="submit-button">
        Se connecter
      </button>
    </form>
  );
};

export default LoginForm;
