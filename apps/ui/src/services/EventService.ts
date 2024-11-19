const API_BASE_URL = 'http://localhost:3000/events';

import { type Event } from '../models/Event';

export const EventService = {
  async getEvents(): Promise<Event[]> {
    const response = await fetch(API_BASE_URL, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('agenda.token')}`,
      },
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },

  async addEvent(event: Event) {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('agenda.token')}`,
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },

  async deleteEvent(eventId: number) {
    const response = await fetch(`${API_BASE_URL}/${eventId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('agenda.token')}`,
      },
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },

  async updateEvent(event: Event) {
    const response = await fetch(`${API_BASE_URL}/${event.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionStorage.getItem('agenda.token')}`,
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },
};
