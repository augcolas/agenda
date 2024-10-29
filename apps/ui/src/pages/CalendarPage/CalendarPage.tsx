// CalendarPage.tsx
import type React from 'react';

import {useState} from 'react';

import Day from '../../components/Day/Day';
import './Calendar.css';
import { useAuth } from '../../contexts/AuthContext';

const CalendarPage: React.FC = () => {
  const { user } = useAuth();

  const [currentDate] = useState(new Date());

  // Fonction pour obtenir le début et la fin de la semaine courante
  const getWeekDays = () => {
    const weekDays = [];
    const startOfWeek = new Date(currentDate);
    const day = currentDate.getDay();

    // Si le jour est dimanche, on ajuste pour que lundi soit le premier jour
    const adjustment = day === 0 ? -6 : 1 - day;
    startOfWeek.setDate(currentDate.getDate() + adjustment);

    for (let index = 0; index < 7; index++) {
      const startOfWeekDay = new Date(startOfWeek);
      startOfWeekDay.setDate(startOfWeek.getDate() + index);
      weekDays.push(startOfWeekDay);
    }
    return weekDays;
  };

  const renderDays = () => {
    const weekDays = getWeekDays();
    return weekDays.map((day, index) => (
      <Day key={"day-"+index} date={day} />
    ));
  };

  return (
    <div className="calendar">
      {user && <h1>Bonjour {user.firstName} {user.lastName}</h1>}
      <h2>Semaine du {currentDate.toLocaleDateString()}</h2>
      <div className="days">
        {renderDays()}
      </div>
    </div>
  );

};

export default CalendarPage;
