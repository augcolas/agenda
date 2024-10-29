// Day.tsx
import type React from 'react';

import './Day.css';

interface DayProps {
  readonly date: Date;
}

const Day: React.FC<DayProps> = ({ date }) => {
  // Generate an array of hours (0 AM to 24 PM)
  const hours = Array.from({ length: 25 }, (_, index) => index);

  return (
    <div className="day">
      <div className="date">
        {date.toLocaleDateString('default', { weekday: 'long' })} <br />
        {date.getDate()}
      </div>
      <div className="hours">
        {hours.map((hour) => (
          <div key={hour} className="hour">
            {hour%2 === 0 ? hour+':00' : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Day;
