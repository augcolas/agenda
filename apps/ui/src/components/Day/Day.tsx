// Day.tsx
import type React from 'react';

import './Day.css';

interface DayProps {
  readonly date: Date;
}

const Day: React.FC<DayProps> = ({ date }) => {
  // Generate an array of hours (6 AM to 10 PM)
  const hours = Array.from({ length: 16 }, (_, index) => 6 + index); // 6 AM to 10 PM

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
