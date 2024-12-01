import {
  GetNotificationListResponse,
  GetNotificationResponse,
  UserIdRequest,
} from '@agenda/proto/notification';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { SocketEvents } from 'src/alerts/alerts.gateway';

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(
    @InjectRedis() private redisService: Redis,
    private readonly socketEventsService: SocketEvents,
  ) {}

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
          const parsedError = JSON.parse(parsedMessage.error);
          this.socketEventsService.sendNotification(
            parsedError.userId,
            parsedError,
          );
        } else {
          this.socketEventsService.sendNotification(
            parsedMessage.userId,
            parsedMessage,
          );
        }
      }
    });
  }

  async getAll(): Promise<GetNotificationListResponse[]> {
    const notifications = await this.redisService.keys('user/*/notifications');

    const notificationData: GetNotificationListResponse[] = await Promise.all(
      notifications.map(async (notification) => {
        const datas = await this.redisService.lrange(notification, 0, -1);
        const userId: number = +notification.split('/')[1];
        const datasParsed: GetNotificationResponse[] = [];
        datas.forEach((data) => {
          const notificationParsed: GetNotificationResponse = JSON.parse(data);
          datasParsed.push(notificationParsed);
        });

        return {
          userId,
          notifications: datasParsed,
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
