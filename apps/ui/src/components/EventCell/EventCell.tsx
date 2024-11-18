import './EventCell.css';

import uniqolor from 'uniqolor';

import { type Event } from '../../models/Event';

export interface EventCellProps {
  readonly event: Event;
}

export const EventCell = ({ event }: EventCellProps) => {

  return (
    <div className={"event"} style={{backgroundColor: uniqolor.random().color}}>
      {event.description}
    </div>
  );
}
