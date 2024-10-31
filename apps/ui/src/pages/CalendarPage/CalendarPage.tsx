// CalendarPage.tsx
import type React from 'react';

import {useState} from 'react';

import './Calendar.css';
import Day from "../../components/Day/Day";
import Week from '../../components/Week/Week';
import { useAuth } from '../../contexts/AuthContext';

const CalendarPage: React.FC = () => {
  const { user } = useAuth();
  const [view, setView] = useState<'day' | 'week'>('day');
  const [currentDate] = useState(new Date());

  // Sample events for the week (replace this with your actual event data)
  const eventsData = [
    { date: new Date(currentDate), time: "10:00", description: "Meeting" },
    { date: new Date(currentDate), time: "10:00", description: "Lunch" },
    { date: new Date(currentDate), time: "14:00", description: "Project deadline" },
    // Add more events as needed...
  ];

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
        (<Day date={currentDate} events={eventsData} />)
        :
        (<Week currentDate={currentDate} events={eventsData} />)
      }
    </div>
  );

};

export default CalendarPage;
