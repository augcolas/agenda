/* eslint-disable */
export interface empty {}

export interface text {
  text: string;
}

export interface notificationList {
  notifications: notification[];
}

export interface notificationId {
  id: string;
}

export interface notification {
  text: string;
}

export interface addNotification {
  text: string;
  delay: number;
}
