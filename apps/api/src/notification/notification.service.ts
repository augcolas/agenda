import {
  GetNotificationListResponse,
  GetNotificationResponse,
  UserIdRequest,
} from '@agenda/proto/notification';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(@InjectRedis() private redisService: Redis) {}

  async onModuleInit() {
    const subscriber = this.redisService.duplicate(); // Create a separate Redis connection for subscriptions
    await subscriber.subscribe('notifications', (err) => {
      if (err) {
        console.error('Failed to subscribe to notifications channel:', err);
      } else {
        console.log('Subscribed to notifications channel');
      }
    });

    subscriber.on('message', (channel, message) => {
      if (channel === 'notifications') {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.error) {
          console.error(`Error : ${parsedMessage.error}`);
        } else {
          console.log('Received notification:', parsedMessage);
        }
      }
    });
  }

  async getAll(): Promise<GetNotificationListResponse[]> {
    const redisNotifications = await this.redisService.keys(
      'user/*/notifications',
    );

    const notificationData: GetNotificationListResponse[] = await Promise.all(
      redisNotifications.map(async (notification) => {
        const datas = await this.redisService.lrange(notification, 0, -1);
        const userId: number = +notification.split('/')[1];
        const notifications: GetNotificationResponse[] = [];
        datas.forEach((data) => {
          const notificationParsed: GetNotificationResponse = JSON.parse(data);
          notifications.push(notificationParsed);
        });

        return {
          userId,
          notifications,
        };
      }),
    );

    return notificationData;
  }

  async getAllUser(
    userId: UserIdRequest['userId'],
  ): Promise<GetNotificationListResponse> {
    const notifications = await this.redisService.lrange(
      `user/${userId}/notifications`,
      0,
      -1,
    );

    const notificationData: GetNotificationListResponse = {
      userId,
      notifications: notifications.map((notification) =>
        JSON.parse(notification),
      ),
    };

    return notificationData;
  }
}
