// CalendarPage.tsx

import {useState} from 'react';

import './Calendar.css';
import Day from "../../components/Day/Day";
import Week from '../../components/Week/Week';
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
      {user && <h1>Welcome, {user.firstName}!</h1>}
      <div className="view-selector">
        <button onClick={() => handleViewChange('day')}>Day View</button>
        <button onClick={() => handleViewChange('week')}>Week View</button>
      </div>

      {view === 'day' ?
        (<Day date={currentDate} />)
        :
        (<Week currentDate={currentDate} />)
      }
    </div>
  );

};

export default CalendarPage;
