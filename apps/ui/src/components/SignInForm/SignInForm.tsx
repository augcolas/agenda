import type React from 'react';

import { useState } from 'react';

import './SignInForm.css';

interface LoginFormProps {
  readonly onSubmit: (email: string, password: string) => void;
}

const SignInForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError('');
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setError('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!email || !password) {
      setError('Email et mot de passe sont requis');
      return;
    }

    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Inscription</h2>
      
      <div className="input-group">
        <label htmlFor="email">Email :</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
          required
        />
      </div>

      <div className="input-group">
        <label htmlFor="password">Mot de passe :</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          required
        />
      </div>

      {error && <p className="error">{error}</p>}

      <div className="submit-group">
        <button type="submit">S inscrire</button>
      </div>
    </form>
  );
};

export default SignInForm;
