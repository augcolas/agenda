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
        const parsedMessage = JSON.parse(message)

        if (parsedMessage.error) {
          console.error(`Error : ${parsedMessage.error}`);
        } else{
          console.log('Received notification:', parsedMessage);
        }
      }
    });
  }
}
