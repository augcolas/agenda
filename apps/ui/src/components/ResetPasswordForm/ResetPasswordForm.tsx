import type React from "react";

import { Fragment, useState } from "react";

import "../LoginForm/LoginForm.css";

interface ResetPasswordFormProps {
  readonly onSubmit: (password: string) => void;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ onSubmit }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(password);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[A-Za-z]).{8,}$/;
    setIsPasswordValid(passwordRegex.test(event.target.value));
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <label htmlFor="password" className="form-label">
        Mot de passe
        <input
          type="password"
          id="password"
          value={password}
          onChange={(event) => handleOnChange(event)}
          required
          autoComplete="new-password"
          className="form-input"
        />
      </label>

      <label htmlFor="confirm-password" className="form-label">
        Confirmer le mot de passe
        <input
          type="password"
          id="confirm-password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
          autoComplete="new-password"
          className="form-input"
        />
      </label>

      {!isPasswordValid && (
        <Fragment>
          <p className="error-message">
            Le mot de passe doit contenir au moins :
          </p>
          <ul>
            <li>8 caractères</li>
            <li>1 chiffre</li>
            <li>1 lettre minuscule</li>
            <li>1 lettre majuscule</li>
          </ul>
        </Fragment>
      )}

      <button
        type="submit"
        className="submit-button"
        disabled={password !== confirmPassword || password.length === 0}
      >
        Envoyer
      </button>
    </form>
  );
};

export default ResetPasswordForm;
