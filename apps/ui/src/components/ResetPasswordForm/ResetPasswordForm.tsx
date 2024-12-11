import type React from "react";

import { useState } from "react";

import "../LoginForm/LoginForm.css";

interface ResetPasswordFormProps {
  readonly onSubmit: (email: string) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSubmit }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(password);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <label htmlFor="password" className="form-label">
        Mot de passe
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          autoComplete="new-password"
          className="form-input"
        />
      </label>

      <button type="submit" className="submit-button">
        Envoyer
      </button>
    </form>
  );
};

export default ResetPasswordForm;
