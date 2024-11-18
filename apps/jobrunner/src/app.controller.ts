import { addNotification, notificationId } from '@agenda/proto/notification';
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

  @GrpcMethod('NotificationService', 'findAll')
  async findAll() {
    return this.appService.findAll();
  }

  @GrpcMethod('NotificationService', 'findOne')
  async findOne(data: notificationId) {
    return this.appService.findOne(data);
  }

  @GrpcMethod('NotificationService', 'add')
  async add(data: addNotification) {
    return this.appService.add(data);
  }
}
