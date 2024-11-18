// Day.tsx

import './Day.css';
import { type Event } from '../../models/Event';
import { EventCell } from '../EventCell/EventCell';

interface DayProps {
  readonly date: Date;
  readonly events: Event[];
}

const Day = ({ date, events }: DayProps) => {
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
          <td className="hour-cell">
            {events
              .filter(
                (event) =>
                  event.date.toDateString() === date.toDateString() &&
                  event.time === `${hour}:00`
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
