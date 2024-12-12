import type React from 'react';

import { Fragment, useState } from 'react';

import './SignInForm.css';

interface LoginFormProps {
  readonly onSubmit: (email: string, password: string) => void;
}

const SignInForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError('');
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('ici')
    setPassword(event.target.value);
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[A-Za-z]).{8,}$/;
    setIsPasswordValid(passwordRegex.test(event.target.value));
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

      {!isPasswordValid && (
        <Fragment >
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

      <div className="submit-group">
        <button disabled={!isPasswordValid || password.length === 0} type="submit">S inscrire</button>
      </div>
    </form>
  );
};

export default SignInForm;
