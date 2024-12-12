import {
  type AddNotificationListRequest,
  type GetNotificationListResponse,
  type UpdateNotificationListRequest,
} from "@agenda/proto/notification";

import api from "./api.service";

const NOTIFICATION_BASE_URL = "/notifications";

export const NotificationService = {
  async getAllUserNotifications(
    userId: number,
  ): Promise<GetNotificationListResponse["notifications"]> {
    const response = await api.get(`${NOTIFICATION_BASE_URL}/user/${userId}`);
    return response.data.notifications;
  },

  async deleteNotification(
    notificationId: string,
    userId: number,
  ): Promise<void> {
    await api.delete(`${NOTIFICATION_BASE_URL}/${userId}/${notificationId}`);
  },

  async updateNotifications(notifications: UpdateNotificationListRequest) {
    const response = await api.patch(NOTIFICATION_BASE_URL, notifications);
    return response.data;
  },

  async addNotification(notifications: AddNotificationListRequest) {
    const response = await api.post(NOTIFICATION_BASE_URL, notifications);
    return response.data;
  },
};
