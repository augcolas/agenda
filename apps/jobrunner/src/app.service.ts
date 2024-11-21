import {
  AddNotificationRequest,
  NotificationIdRequest,
  NotificationListResponse,
  NotificationResponse,
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

  async findAll(): Promise<NotificationListResponse> {
    const notifications: Array<NotificationResponse> = [];
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

  async findOne(data: NotificationIdRequest): Promise<NotificationResponse> {
    try {
      const job = await this.notificationQueue.getJob(data.id);
      return job.data;
    } catch {
      throw new NotFoundException();
    }
  }

  async findByUser(userId: string): Promise<NotificationListResponse> {
    const notifications: Array<NotificationResponse> = [];
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

  async add(data: AddNotificationRequest): Promise<NotificationResponse> {
    try {
      const newJob = await this.notificationQueue.add(
        'notification',
        {
          text: data.text,
        },
        {
          delay: data.delay,
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

  async remove(data: NotificationIdRequest): Promise<void> {
    try {
      const job = await this.notificationQueue.getJob(data.id);
      await job.remove();
    } catch {
      throw new NotFoundException();
    }
  }
}
