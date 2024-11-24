import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';

@Injectable()
export class NotificationService implements OnModuleInit {
  constructor(@InjectRedis() private redisService: Redis) {}

  async onModuleInit() {
    // Subscribe to the 'notifications' channel
    const subscriber = this.redisService.duplicate(); // Create a separate Redis connection for subscriptions
    await subscriber.subscribe('notifications', (err) => {
      if (err) {
        console.error('Failed to subscribe to notifications channel:', err);
      } else {
        console.log('Subscribed to notifications channel');
      }
    });

    // Listen for published messages
    subscriber.on('message', (channel, message) => {
      if (channel === 'notifications') {
        console.log('Received notification:', JSON.parse(message));
      }
    });
  }
}
