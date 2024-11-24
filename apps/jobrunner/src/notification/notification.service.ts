import {
  AddNotificationListRequest,
  AddNotificationRequest,
  JobIdRequest,
  MessageResponse,
  NotificationIdRequest,
  UpdateNotificationListRequest,
  UpdateNotificationRequest,
  UserIdRequest,
} from '@agenda/proto/notification';
import { InjectQueue } from '@nestjs/bullmq';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Queue } from 'bullmq';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationService {
  constructor(
    @InjectQueue('notification') private notificationQueue: Queue,
  ) {}

  async add(data: AddNotificationListRequest): Promise<MessageResponse> {
    try {
      await Promise.all(
        data.notifications.map(async (notification: AddNotificationRequest) => {
          await this.notificationQueue.add(
            'notification',
            {
              action: 'add',
              id: uuidv4(),
              userId: notification.userId,
              eventId: notification.eventId,
              viewed: false,
            },
            {
              removeOnComplete: true,
            },
          );
        }),
      );

      return {
        message: `Notification(s) added to the Queue`,
        status: 'success',
      };
    } catch {
      throw new UnauthorizedException('Failed to add notifications to the queue');
    }
  }

  async update(data: UpdateNotificationListRequest){
    try{
      await Promise.all(
        data.notifications.map(async (notification: UpdateNotificationRequest) => {
          await this.notificationQueue.add(
            'notification',
            {
              action: 'update',
              ...notification
            },
            {
              removeOnComplete: true,
            },
          );
        }),
      );

      return {
        message: `Notification(s) updates added to the Queue`,
        status: 'success',
      };
    }catch{
      throw new NotFoundException();
    }
  }

  async remove(data: NotificationIdRequest): Promise<MessageResponse> {
    try {
      await this.notificationQueue.add(
        'notification',
        {
          action: 'remove',
          ...data
        },
        {
          removeOnComplete: true,
        },
      );

      return {
        message: `Notification remove added to the Queue`,
        status: 'success',
      };
    } catch {
      throw new NotFoundException();
    }
  }

  async removeAll(data: UserIdRequest): Promise<MessageResponse> {
    try {
      await this.notificationQueue.add(
        'notification',
        {
          action: 'removeAll',
          ...data
        },
        {
          removeOnComplete: true,
        },
      );

      return {
        message: `Notifications removes added to the Queue for user ${data.userId}`,
        status: 'success',
      };
    } catch {
      throw new NotFoundException();
    }
  }

  async removeJob(data: JobIdRequest): Promise<MessageResponse> {
    try {
      const job = await this.notificationQueue.getJob(data.id);
      await job.remove();
      return {
        message: 'Job removed',
        status: 'success',
      };
    } catch {
      throw new NotFoundException();
    }
  }

  async clearJob() : Promise<MessageResponse> {
    console.log('clearJob');

    try{
      await this.notificationQueue.obliterate();

      return {
        message: 'All jobs cleaned',
        status: 'success',
      };
    }catch{
      throw new NotFoundException();
    }
  }

  async clearUserJob(data: UserIdRequest) : Promise<MessageResponse>{
    try{
      const jobs = await this.notificationQueue.getJobs(['completed', 'failed', 'delayed', 'paused', 'wait', 'active', 'prioritized']);
      const userJobs = jobs.filter((job) => job.data.userId === data.userId);
      await Promise.all(userJobs.map((job) => job.remove()));

      return {
        message: 'All jobs for user cleaned',
        status: 'success',
      };
    }catch{
      throw new NotFoundException();
    }
  }

}
