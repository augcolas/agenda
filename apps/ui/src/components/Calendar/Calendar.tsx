import type React from "react";

import { type AddNotificationListRequest } from "@agenda/proto/notification";

import "./Calendar.css";

import { useEffect, useState } from "react";

import type { Event } from "../../models/Event";

import { useAuth } from "../../contexts/AuthContext";
import { EventService } from "../../services/event.service";
import { NotificationService } from "../../services/notification.service";
import CreateEventModal from "../CreateEventModal/CreateEventModal";
import { EventCell } from "../EventCell/EventCell";

interface WeekProps {
  readonly currentDate: Date;
  readonly view: string;
}

const Calendar: React.FC<WeekProps> = ({ currentDate, view }) => {
  const { token, user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [modalData, setModalData] = useState<{ date: Date; isOpen: boolean }>({
    date: new Date(),
    isOpen: false,
  });

  useEffect(() => {
    if (!token) return;
    EventService.getEvents(token)
      .then((eventArray: Event[]) => setEvents(eventArray))
      .catch((error) => console.error("Failed to fetch events:", error));
  }, [token, modalData.isOpen]);

  // Function to get the week days
  const getWeekDays = () => {
    const weekDays: Date[] = [];
    const startOfWeek = new Date(currentDate);

    switch (view) {
      case "day": {
        weekDays.push(currentDate);
        break;
      }
      case "week": {
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
  const hours = Array.from({ length: 24 }, (_, index) => index);

  const handleEvent = (day: Date, hour: number) => {
    const eventDate = new Date(day);
    eventDate.setHours(hour, 0, 0, 0);

    // Ouvrir la modale avec la date sélectionnée
    setModalData({ date: eventDate, isOpen: true });
  };

  const handleAddEvent = async (newEvent: Event) => {
    const addEvent = await EventService.addEvent(newEvent);
    setModalData((previous) => ({ ...previous, isOpen: false })); // Fermer la modale
    const fetchedEvent = await EventService.getEvents(token);
    setEvents(fetchedEvent);

    const notifications: AddNotificationListRequest["notifications"] = [];
    newEvent.userIds.forEach((userId) => {
      notifications.push({
        userId: userId,
        eventId: addEvent.id,
      });
    });
    await NotificationService.addNotification(token, {
      notifications: notifications,
    });
  };

  const handleCloseModal = () => {
    setModalData((previous) => ({ ...previous, isOpen: false }));
  };

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th className="hour-header"></th>
            {weekDays.map((day, index) => (
              <th key={"day_" + index} className="day-header">
                {day.toLocaleDateString("default", { weekday: "long" })} <br />
                {day.getDate()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              <td className="hour">{hour % 2 === 0 ? hour + ":00" : ""}</td>
              {weekDays.map((day, index) => (
                <td
                  key={"hour_" + index}
                  className="hour-cell"
                  onClick={() => handleEvent(day, hour)}
                >
                  {events
                    .filter(
                      (event) =>
                        new Date(event.date).toDateString() ===
                          day.toDateString() &&
                        new Date(event.date).getHours() === hour,
                    )
                    .map((event, eventIndex) => (
                      <EventCell
                        event={event}
                        key={"event_" + hour + "_" + eventIndex}
                      />
                    ))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {modalData.isOpen && user && (
        <CreateEventModal
          eventDate={modalData.date}
          userId={user.id}
          setEvent={handleAddEvent}
          closeModal={handleCloseModal}
        />
      )}
    </div>
  );
};

export default Calendar;
