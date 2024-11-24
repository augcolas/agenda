import {
  AddNotificationListRequest,
  EmptyRequest,
  JobIdRequest,
  NotificationIdRequest,
  NotificationServiceClient,
  RemoveNotificationRequest,
  UpdateNotificationListRequest,
  UserIdRequest,
} from '@agenda/proto/notification';
import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Controller('notifications')
export class NotificationController {
  private notificationService: NotificationServiceClient;

  constructor(
    @Inject('NOTIFICATIONPROTO_PACKAGE') private client: ClientGrpc,
  ) {
    this.notificationService =
      this.client.getService<NotificationServiceClient>('NotificationService');
  }

  @Post()
  async add(@Body() data: AddNotificationListRequest) {
    return this.notificationService.add(data);
  }

  @Patch()
  async update(@Body() data: UpdateNotificationListRequest) {
    return this.notificationService.update(data);
  }

  @Delete('/id/:id')
  async remove(@Param('id') id: NotificationIdRequest['id'], @Body() data: RemoveNotificationRequest) {
    data.id = id;
    return this.notificationService.remove(data);
  }

  @Delete('/user/:id')
  async removeAll(@Param('id') userId: UserIdRequest['userId']) {
    return this.notificationService.removeAll({ userId });
  }

  @Delete('/job/:id')
  async removeJob(@Param('id') id: JobIdRequest['id']) {
    return this.notificationService.removeJob({ id });
  }

  @Delete('/queue')
  async clearJob(data: EmptyRequest) {
    return this.notificationService.clearJob(data);
  }

  @Delete('/queue/:id')
  async clearUserJob(@Param('id') userId: UserIdRequest['userId']) {
    return this.notificationService.clearUserJob({ userId });
  }

}
