export interface UserInterface {
    id: number,
    email: string,
    role: Role
    areNotificationsEnabled?: boolean,
}

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
  }