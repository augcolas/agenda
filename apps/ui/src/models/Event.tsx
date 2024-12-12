import { type UserInterface } from "../interfaces/user.interface";

export type Event = {
  date: Date,
  description: string,
  title: string,
  users: UserInterface[],
  id?: number,
}

export type AddEvent = {
  date: Date,
  description: string,
  title: string,
  users: UserInterface['id'][],
}

export type UpdateEvent = {
  id: number,
  date: Date,
  description: string,
  title: string,
  users: UserInterface['id'][],
}
