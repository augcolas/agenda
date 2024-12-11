const API_BASE_URL = "http://localhost:3000/events";

import { type AddEvent, type Event, type UpdateEvent } from "../models/Event";

export const EventService = {
  async getEvents(token: string): Promise<Event[]> {
    const response = await fetch(API_BASE_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },

  async addEvent(event: AddEvent) {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },

  async deleteEvent(eventId: number) {
    const response = await fetch(`${API_BASE_URL}/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },

  async updateEvent(event: UpdateEvent) {
    const response = await fetch(`${API_BASE_URL}/${event.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },
};
