export interface UserInterface {
    id: number,
    email: string,
    areNotificationsEnabled?: boolean,
    role?: Role
}

export enum Role {
    ADMIN = 'ADMIN',
    USER = 'USER',
  }
