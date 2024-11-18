// Week.tsx
import type React from 'react';

import './Week.css';
import { type Event } from '../../models/Event';
import { EventCell } from '../EventCell/EventCell';

interface WeekProps {
  readonly currentDate: Date;
  readonly events: Event[];
}

const Week: React.FC<WeekProps> = ({ currentDate, events }) => {
  // Function to get the week days
  const getWeekDays = () => {
    const weekDays: Date[] = [];
    const startOfWeek = new Date(currentDate);
    const day = currentDate.getDay();

    const adjustment = day === 0 ? -6 : 1 - day; // Adjust for Monday as the start of the week
    startOfWeek.setDate(currentDate.getDate() + adjustment);

    for (let index = 0; index < 7; index++) {
      const dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + index);
      weekDays.push(dayDate);
    }
    return weekDays;
  };

  const weekDays = getWeekDays();
  const hours = Array.from({ length: 25 }, (_, index) => index);

  return (
    <table className="week-table">
      <thead>
      <tr>
        <th className="hour-header"></th>
        {weekDays.map((day, index) => (
          <th key={"week_day_"+index} className="week-day-header">
            {day.toLocaleDateString('default', { weekday: 'long' })} <br />
            {day.getDate()}
          </th>
        ))}
      </tr>
      </thead>
      <tbody>
      {hours.map((hour) => (
        <tr key={hour}>
          <td className="hour">{hour%2 === 0 ? hour+':00' : ''}</td>
          {weekDays.map((day, index) => (
            <td key={"hour_"+index} className="hour-cell">
              {events.filter(event => event.date.toDateString() === day.toDateString() && event.time === `${hour}:00`)
                .map((event, eventIndex) => (
                  <EventCell event={event} key={"event_"+hour+"_"+eventIndex} />
                ))}
            </td>
          ))}
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default Week;
