// CalendarPage.tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const CalendarPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Mon Calendrier</h1>
      {user && <p>Bonjour, {user.firstName} {user.lastName}!</p>}
    </div>
  );
};

export default CalendarPage;
