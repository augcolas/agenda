import {
  addNotification,
  notification,
  notificationId,
  notificationList,
} from '@agenda/proto/notification';
import { InjectQueue } from '@nestjs/bullmq';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class AppService {
  constructor(@InjectQueue('notification') private notificationQueue: Queue) {}

  async findAll(): Promise<notificationList> {
    const notifications: Array<notification> = [];
    try {
      const jobs = await this.notificationQueue.getJobs();
      jobs.forEach((job) => {
        notifications.push(job.data);
      });

      return { notifications };
    } catch {
      throw new NotFoundException();
    }
  }

  async findOne(data: notificationId): Promise<notification> {
    try {
      const job = await this.notificationQueue.getJob(data.id);
      return job.data;
    } catch {
      throw new NotFoundException();
    }
  }

  async findByUser(userId: string): Promise<notificationList> {
    const notifications: Array<notification> = [];
    try {
      const jobs = await this.notificationQueue.getJobs();
      jobs.forEach((job) => {
        if (job.data.userId === userId) {
          notifications.push(job.data);
        }
      });

      return { notifications };
    } catch {
      throw new NotFoundException();
    }
  }

  async add(data: addNotification): Promise<notification> {
    try {
      const newJob = await this.notificationQueue.add(
        'notification',
        {
          text: data.text,
          // userId: data.userId,
          // eventId: data.eventId,
        },
        {
          delay: data.delay,
          removeOnComplete: true,
        },
      );
      return newJob.data;
    } catch {
      throw new UnauthorizedException();
    }
  }

  // async update(data: notificationId): Promise<notification> {
  //   try {
  //     const job = await this.notificationQueue.getJob(data.id);
  //     await job.update(data);
  //     return job.data;
  //   } catch {
  //     throw new NotFoundException();
  //   }
  // }

  async remove(data: notificationId): Promise<void> {
    try {
      const job = await this.notificationQueue.getJob(data.id);
      await job.remove();
    } catch {
      throw new NotFoundException();
    }
  }
}
