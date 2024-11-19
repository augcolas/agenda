// Day.tsx

import './Day.css';

import { useEffect, useState } from 'react';

import { type Event } from '../../models/Event';
import { EventService } from '../../services/EventService';
import { EventCell } from '../EventCell/EventCell';

interface DayProps {
  readonly date: Date;
}

const Day = ({ date }: DayProps) => {

  const hours = Array.from({ length: 25 }, (_, index) => index);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    EventService.getEvents()
      .then((eventArray: Event[]) => {
        setEvents(eventArray);
        return eventArray
      })
      .catch((error) => {
        console.error('Failed to fetch events:', error);
      });
  },[]);

  return (
    <table className="day-table">
      <thead>
      <tr>
        <th className="hour-header"></th>
        <th className="day-header">
          {date.toLocaleDateString('default', { weekday: 'long' })} <br />
          {date.getDate()}
        </th>
      </tr>
      </thead>
      <tbody>
      {hours.map((hour) => (
        <tr key={hour}>
          <td className="hour">{hour % 2 === 0 ? hour + ':00' : ''}</td>
          <td className="hour-cell">
            {events
              .filter(
                (event) =>
                  new Date(event.date).toDateString() === date.toDateString() &&
                  new Date(event.date).getHours() === hour
              )
              .map((event, eventIndex) => (
                <EventCell key={"event_" + hour + "_" + eventIndex} event={event} />
              ))}
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default Day;
