// CalendarPage.tsx

import {useState} from 'react';

import './Calendar.css';
import Calendar from '../../components/Calendar/Calendar';
import { useAuth } from '../../contexts/AuthContext';

const CalendarPage = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'day' | 'week'>('day');
  const [currentDate] = useState(new Date());

  const handleViewChange = (newView: 'day' | 'week') => {
    setView(newView);
  };

  return (
    <div className="calendar">
      {user && <h1>Welcome, {user.email}!</h1>}
      <div className="view-selector">
        <button onClick={() => handleViewChange('day')}>Day View</button>
        <button onClick={() => handleViewChange('week')}>Week View</button>
      </div>

      <Calendar currentDate={currentDate} view={view} />
    </div>
  );

};

export default CalendarPage;
