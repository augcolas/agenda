// CalendarPage.tsx
import { useState } from "react";

import "./CalendarPage.css";
import Calendar from "../../components/Calendar/Calendar";
import { useAuth } from "../../contexts/AuthContext";

const CalendarPage = () => {
  const { user } = useAuth();
  const [view, setView] = useState<"day" | "week">("day");
  const [currentDate] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());

  const handleViewChange = (newView: "day" | "week") => {
    setView(newView);
  };

  const updateDate = (offset: number) => {
    const newDate = new Date(calendarDate);
    newDate.setDate(calendarDate.getDate() + offset);
    return newDate;
  };

  const nextDate = () => updateDate(view === "day" ? 1 : 7);
  const previousDate = () => updateDate(view === "day" ? -1 : -7);

  return (
    <div className="calendar">
      {user && <h1 className="page-title">Bienvenue, {user.email}!</h1>}
      <div className="view-selector">
        <button onClick={() => handleViewChange("day")}>Par Jour</button>
        <button onClick={() => handleViewChange("week")}>Par Semaine</button>
        <button
          className="prev"
          onClick={() => setCalendarDate(previousDate())}
        >
          Précédent
        </button>
        <button onClick={() => setCalendarDate(nextDate())}>Suivant</button>
        <button onClick={() => setCalendarDate(currentDate)}>
          Aujourd&apos;hui
        </button>
      </div>

      <Calendar currentDate={calendarDate} view={view} />
    </div>
  );
};

export default CalendarPage;
