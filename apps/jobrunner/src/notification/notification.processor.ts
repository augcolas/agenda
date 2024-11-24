import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Job } from 'bullmq';
import { Redis } from 'ioredis';

@Processor('notification')
export class AppProcessor extends WorkerHost {

  constructor(
    @InjectRedis() private redisService: Redis,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    try {
      const data = job.data;
      const { id, userId, action } = data;
      const redisKey = `user/${userId}/notifications`;

      switch (action) {
        case 'add': {
          await this.add(job, data, redisKey);
          break;
        }
        case 'remove': {
          await this.remove(job, id, redisKey);
          break;
        }
        case 'removeAll': {
          await this.removeAll(redisKey);
          break;
        }
        case 'update': {
          await this.update(job, data, redisKey);
          break;
        }
        default: {
          job.discard();
          return;
        }
      }

    } catch (error) {
      console.error('Failed to process job:', job.id, error);
      throw error;
    }
  }

  async add(job: Job, data: {id: string, eventId: number}, redisKey: string){
    const serializedNotificationAdd = JSON.stringify({
      id: data.id,
      eventId: data.eventId,
      viewed: false
    });

    // if notification already exists
    const notifications = await this.redisService.lrange(redisKey, 0, -1);
    for (const notification of notifications) {
      const notificationParsed = JSON.parse(notification);
      if (notificationParsed.id === data.id || notificationParsed.eventId === data.eventId) {
        console.log('Notification already exists');

        job.discard();
        return;
      }
    }

    await this.redisService.rpush(redisKey, serializedNotificationAdd);
    await this.redisService.publish('notifications' , JSON.stringify(data));
  }

  async update (job: Job, data: {id: string, eventId: number, viewed: boolean}, redisKey: string){
    const serializedNotificationUpdate = JSON.stringify({
      id: data.id,
      eventId: data.eventId,
      viewed: data.viewed
    });

    const notifications = await this.redisService.lrange(redisKey, 0, -1);
    if (!notifications) {
      job.discard();
      return;
    }

    notifications.forEach(async (notification, index) => {
      const notificationParsed = JSON.parse(notification);

      if (notificationParsed.id === data.id) {
        notificationParsed.viewed = data.viewed;
        await this.redisService.lset(redisKey, index, serializedNotificationUpdate);
        await this.redisService.publish('notifications', JSON.stringify(data));
      }
    });

  }

  async remove(job: Job, id: string, redisKey: string){

    const notifications = await this.redisService.lrange(redisKey, 0, -1);
    if (!notifications) {
      job.discard();
      return;
    }

    notifications.forEach(async (notification) => {
      const notificationParsed = JSON.parse(notification);
      if (notificationParsed.id === id) {
        const message = {
          message: `Notification with id ${id} removed from user ${redisKey}`,
        };

        await this.redisService.lrem(redisKey, 0, notification);
        await this.redisService.publish('notifications', JSON.stringify(message));
      }
    });
  }

  async removeAll(redisKey: string){
    await this.redisService.del(redisKey);
    await this.redisService.publish('notifications', JSON.stringify({
      message: `All notifications removed from user ${redisKey}`,
    }));
  }
}
