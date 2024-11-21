import {
  AddNotificationRequest,
  NotificationIdRequest,
  NotificationListResponse,
  NotificationResponse,
  UserIdRequest,
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
        job.data.delay = job.delay;
        job.data.notificationId = +job.id;
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
      job.data.delay = job.delay;
      job.data.notificationId = +job.id;
      return job.data;
    } catch {
      throw new NotFoundException();
    }
  }

  async findByUser(
    userId: UserIdRequest['id'],
  ): Promise<NotificationListResponse> {
    const notifications: Array<NotificationResponse> = [];
    try {
      const jobs = await this.notificationQueue.getJobs();
      jobs.forEach((job) => {
        if (job.data.userId === userId) {
          job.data.delay = job.delay;
          job.data.notificationId = +job.id;
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
          userId: data.userId,
          eventId: data.eventId,
        },
        {
          delay: data.delay,
          removeOnComplete: true,
        },
      );
      newJob.data.delay = newJob.delay;
      newJob.data.notificationId = +newJob.id;
      return newJob.data;
    } catch {
      throw new UnauthorizedException();
    }
  }

  async update(data: NotificationIdRequest): Promise<NotificationResponse> {
    try {
      const job = await this.notificationQueue.getJob(data.id);
      // await this.notificationQueue.updateJobProgress(job.id, {
      //   delay: job.data.delay,

      // });
      return job.data;
    } catch {
      throw new NotFoundException();
    }
  }

  async remove(data: NotificationIdRequest): Promise<NotificationResponse> {
    try {
      const job = await this.notificationQueue.getJob(data.id);
      await job.remove();
      job.data.delay = job.delay;
      job.data.notificationId = +job.id;
      return job.data;
    } catch {
      throw new NotFoundException();
    }
  }
}
