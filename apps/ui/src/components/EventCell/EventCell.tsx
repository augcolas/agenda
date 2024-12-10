import './EventCell.css';
import { type Event } from '../../models/Event';

export interface EventCellProps {
  readonly event: Event;
  readonly setEventToUpdate: (event: Event) => void;
}

export const EventCell = ({ event, setEventToUpdate  }: EventCellProps) => {

  return (
    <div className={"event"} style={{backgroundColor: "beige"}} onClick={() => setEventToUpdate(event)}>
      {event.title}
    </div>
  );
}
