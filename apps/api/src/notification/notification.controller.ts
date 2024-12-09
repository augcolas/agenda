import {
  AddNotificationListRequest,
  EmptyRequest,
  GetNotificationListResponse,
  JobIdRequest,
  NotificationIdRequest,
  NotificationServiceClient,
  UpdateNotificationListRequest,
  UserIdRequest,
} from '@agenda/proto/notification';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  private microserviceNotificationService: NotificationServiceClient;

  constructor(
    @Inject('NOTIFICATIONPROTO_PACKAGE') private client: ClientGrpc,
    private readonly notificationService: NotificationService,
  ) {
    this.microserviceNotificationService =
      this.client.getService<NotificationServiceClient>('NotificationService');
  }

  @Get()
  async getAll(): Promise<GetNotificationListResponse[]> {
    return this.notificationService.getAll();
  }

  @Get('/user/:id')
  async get(@Param('id') userId: UserIdRequest['userId']) {
    return this.notificationService.getAllUser(userId);
  }

  @Post()
  async add(@Body() data: AddNotificationListRequest) {
    return this.microserviceNotificationService.add(data);
  }

  @Patch()
  async update(@Body() data: UpdateNotificationListRequest) {
    return this.microserviceNotificationService.update(data);
  }

  @Delete('/:userId/:id')
  async remove(
    @Param('id') id: NotificationIdRequest['id'],
    @Param('userId') userId: UserIdRequest['userId'],
  ) {
    return this.microserviceNotificationService.remove({ id, userId });
  }

  @Delete('/user/:id')
  async removeAll(@Param('id') userId: UserIdRequest['userId']) {
    return this.microserviceNotificationService.removeAll({ userId });
  }

  @Delete('/job/:id')
  async removeJob(@Param('id') id: JobIdRequest['id']) {
    return this.microserviceNotificationService.removeJob({ id });
  }

  @Delete('/queue')
  async clearJob(data: EmptyRequest) {
    return this.microserviceNotificationService.clearJob(data);
  }

  @Delete('/queue/:id')
  async clearUserJob(@Param('id') userId: UserIdRequest['userId']) {
    return this.microserviceNotificationService.clearUserJob({ userId });
  }
}
