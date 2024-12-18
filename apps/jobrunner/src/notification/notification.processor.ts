import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Job, Queue } from 'bullmq';
import { Redis } from 'ioredis';

@Processor('notification')
export class AppProcessor extends WorkerHost {
  constructor(
    @InjectRedis() private redisService: Redis,
    @InjectQueue('notification') private notificationQueue: Queue,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    try {
      const data = job.data;
      const {
        id,
        userId,
        action,
      }: { id: string; action: string; userId: number } = data;
      const redisKey = `user/${userId}/notifications`;

      switch (action) {
        case 'add': {
          await this.add(job, data, redisKey, userId, action);
          break;
        }
        case 'remove': {
          await this.remove(job, id, redisKey, userId, action);
          break;
        }
        case 'removeAll': {
          await this.removeAll(redisKey, userId, action);
          break;
        }
        case 'update': {
          await this.update(job, data, redisKey, userId, action);
          break;
        }
        default: {
          job.discard();
          return;
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.notificationQueue.emit('error', error);
        throw error;
      } else {
        this.notificationQueue.emit('error', new Error('An error occurred'));
        throw new Error('An error occurred');
      }
    }
  }

  async add(
    job: Job,
    data: { id: string; eventId: number },
    redisKey: string,
    userId: number,
    action: string,
  ) {
    const serializedNotificationAdd = {
      id: data.id,
      eventId: data.eventId,
      viewed: false,
    };

    const notifications = await this.redisService.lrange(redisKey, 0, -1);
    for (const notification of notifications) {
      const notificationParsed = JSON.parse(notification);
      if (
        notificationParsed.id === data.id ||
        notificationParsed.eventId === data.eventId
      ) {
        job.discard();
        throw new Error(
          JSON.stringify({
            error: 'Notification already exists',
            userId,
            action,
          }),
        );
      }
    }

    await this.redisService.rpush(
      redisKey,
      JSON.stringify(serializedNotificationAdd),
    );
    await this.redisService.publish(
      'notifications',
      JSON.stringify({ ...serializedNotificationAdd, userId, action }),
    );
  }

  async update(
    job: Job,
    data: { id: string; eventId: number; viewed: boolean },
    redisKey: string,
    userId: number,
    action: string,
  ) {
    const notifications = await this.redisService.lrange(redisKey, 0, -1);
    const notificationFound = notifications.filter((notification) => {
      const notificationParsed = JSON.parse(notification);
      return notificationParsed.id === data.id;
    });

    if (notificationFound.length === 0) {
      job.discard();
      throw new Error(
        JSON.stringify({
          error: 'Notifications not found',
          userId,
          action,
        }),
      );
    }

    notifications.forEach(async (notification, index) => {
      const notificationParsed = JSON.parse(notification);

      if (notificationParsed.id === data.id) {
        notificationParsed.viewed = data.viewed;
        await this.redisService.lset(
          redisKey,
          index,
          JSON.stringify({
            ...notificationParsed,
            viewed: data.viewed,
          }),
        );
        await this.redisService.publish(
          'notifications',
          JSON.stringify({ ...data, userId, action }),
        );
      }
    });
  }

  async remove(
    job: Job,
    id: string,
    redisKey: string,
    userId: number,
    action: string,
  ) {
    const notifications = await this.redisService.lrange(redisKey, 0, -1);
    if (!notifications) {
      job.discard();
      throw new Error(
        JSON.stringify({
          error: 'Notifications not found',
          userId,
          action,
        }),
      );
    }

    const notificationFound = notifications.filter((notification) => {
      const notificationParsed = JSON.parse(notification);
      return notificationParsed.id === id;
    });

    if (notificationFound.length === 0) {
      job.discard();
      throw new Error(
        JSON.stringify({
          error: 'Notifications not found',
          userId,
          action,
        }),
      );
    } else {
      await this.redisService.lrem(redisKey, 0, notificationFound[0]);
      await this.redisService.publish(
        'notifications',
        JSON.stringify({
          action,
          userId,
          message: `Notification with id ${id} removed from user ${redisKey}`,
        }),
      );
    }
  }

  async removeAll(redisKey: string, userId: number, action: string) {
    await this.redisService.del(redisKey);
    await this.redisService.publish(
      'notifications',
      JSON.stringify({
        action,
        userId,
        message: `All notifications removed from user ${redisKey}`,
      }),
    );
  }
}
