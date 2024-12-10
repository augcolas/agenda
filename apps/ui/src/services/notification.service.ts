import {
  type AddNotificationListRequest,
  type GetNotificationListResponse,
  type UpdateNotificationListRequest,
} from "@agenda/proto/notification";

const API_BASE_URL = "http://localhost:3000/notifications";

export const NotificationService = {
  async getAllUserNotifications(
    userId: number,
  ): Promise<GetNotificationListResponse["notifications"]> {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data: GetNotificationListResponse = await response.json();
    return data.notifications;
  },

  async deleteNotification(
    notificationId: string,
    userId: number,
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/${userId}/${notificationId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`);
  },

  async updateNotifications(
    notifications: UpdateNotificationListRequest,
  ) {
    const response = await fetch(API_BASE_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(notifications),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },

  async addNotification(
    notifications: AddNotificationListRequest,
  ) {
    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
      body: JSON.stringify(notifications),
    });
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    return response.json();
  },
};
