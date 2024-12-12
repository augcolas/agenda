import type React from "react";

import { useState } from "react";

import "../LoginForm/LoginForm.css";

interface ForgetPasswordFormProps {
  readonly onSubmit: (email: string) => void;
}

const ForgetPasswordForm: React.FC<ForgetPasswordFormProps> = ({
  onSubmit,
}) => {
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(email);
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

      <button type="submit" className="submit-button">
        Envoyer
      </button>
    </form>
  );
};

export default ForgetPasswordForm;
