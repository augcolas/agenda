import { InjectQueue } from '@nestjs/bullmq';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { Queue } from 'bullmq';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectQueue('notification') private notificationQueue: Queue,
  ) {}

  @GrpcMethod('NotificationService', 'test')
  test() {
    return { text: 'jorunner service test' };
  }

  @GrpcMethod('NotificationService', 'findAll')
  async findAll() {
    console.log('findAll');
    const notifications = await this.notificationQueue.getJobCounts();
    console.log(typeof notifications);

    console.log(notifications);

    return notifications;
  }

  @GrpcMethod('NotificationService', 'findOne')
  async findOne(id: string) {
    return this.notificationQueue.getJob(id);
  }

  @GrpcMethod('NotificationService', 'add')
  async addNotification() {
    return this.notificationQueue.add('notification', {
      text: 'jobrunner service add',
    });
  }
}
