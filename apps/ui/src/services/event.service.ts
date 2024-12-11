import api from "./api.service";
const API_BASE_URL = "/events";

import { type AddEvent, type Event, type UpdateEvent } from "../models/Event";

export const EventService = {
  async getEvents(): Promise<Event[]> {
    const response = await api.get(API_BASE_URL);
    return response.data;
  },

  async addEvent(event: AddEvent) {
    const response = await api.post(API_BASE_URL, event);
    return response.data;
  },

  async deleteEvent(eventId: number) {
    const response = await api.delete(`${API_BASE_URL}/${eventId}`);
    return response.data;
  },

  async updateEvent(event: UpdateEvent) {
    const response = await api.patch(`${API_BASE_URL}/${event.id}`, event);
    return response.data;
  },
};
