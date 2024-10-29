// LoginForm.tsx
import React, { useState } from 'react';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email, password);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '300px' }}>
      <label>
        Adresse Email
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '0.5rem', marginTop: '0.25rem', width: '100%' }}
        />
      </label>

      <label>
        Mot de passe
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '0.5rem', marginTop: '0.25rem', width: '100%' }}
        />
      </label>

      <button type="submit" style={{ padding: '0.75rem', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
        Se connecter
      </button>
    </form>
  );
};

export default LoginForm;
