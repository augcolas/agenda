
import type React from 'react';

import { useEffect, useState } from 'react';

import './Calendar.css';

import type { Event } from '../../models/Event';

import { useAuth } from '../../contexts/AuthContext';
import { EventService } from '../../services/EventService';
import { EventCell } from '../EventCell/EventCell';

interface WeekProps {
  readonly currentDate: Date;
  readonly view: string;
}

const Calendar: React.FC<WeekProps> = ({ currentDate, view }) => {
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    EventService.getEvents(token)
      .then((eventArray: Event[]) => {
        setEvents(eventArray);
        return eventArray;
      })
      .catch((error) => {
        console.error('Failed to fetch events:', error);
      });
  },[token]);

  // Function to get the week days
  const getWeekDays = () => {
    const weekDays: Date[] = [];
    const startOfWeek = new Date(currentDate);

    switch(view) {
      case 'day': {
        weekDays.push(currentDate);
        break;
      }
      case 'week': {
        const day = currentDate.getDay();

        const adjustment = day === 0 ? -6 : 1 - day; // Adjust for Monday as the start of the week
        startOfWeek.setDate(currentDate.getDate() + adjustment);

        for (let index = 0; index < 7; index++) {
          const dayDate = new Date(startOfWeek);
          dayDate.setDate(startOfWeek.getDate() + index);
          weekDays.push(dayDate);
        }
        break;
      }
    }

    return weekDays;
  };

  const weekDays = getWeekDays();
  const hours = Array.from({ length: 25 }, (_, index) => index);

  return (
    <table className="table">
      <thead>
      <tr>
        <th className="hour-header"></th>
        {weekDays.map((day, index) => (
          <th key={"day_"+index} className="day-header">
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
              {events
                .filter(
                  (event) =>
                    new Date(event.date).toDateString() === day.toDateString() &&
                    new Date(event.date).getHours() === hour
                )
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

export default Calendar;
