// Day.tsx
import type React from 'react';

import './Day.css';

interface DayProps {
  readonly date: Date;
  readonly events: { date: Date; description: string; time: string }[];
}

const Day: React.FC<DayProps> = ({ date, events }) => {
  const hours = Array.from({ length: 25 }, (_, index) => index);

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
          <td className="event-cell">
            {events
              .filter(
                (event) =>
                  event.date.toDateString() === date.toDateString() &&
                  event.time === `${hour}:00`
              )
              .map((event, eventIndex) => (
                <div key={"event_" + hour + "_" + eventIndex} className="event">
                  {event.description}
                </div>
              ))}
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  );
};

export default Day;
