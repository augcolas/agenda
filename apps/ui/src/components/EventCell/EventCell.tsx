import './EventCell.css';
import { type Event } from '../../models/Event';

export interface EventCellProps {
  readonly event: Event;
}

export const EventCell = ({ event }: EventCellProps) => {

  return (
    <div className={"event"} style={{backgroundColor: "beige"}}>
      {event.title}
    </div>
  );
}
