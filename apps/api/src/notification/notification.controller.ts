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
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { NotificationService } from './notification.service';

@ApiTags('notifications')
@ApiBearerAuth()
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
  @ApiOperation({ summary: 'Get all notifications' })
  @ApiResponse({ status: 200, description: 'Return all notifications'})
  async getAll(): Promise<GetNotificationListResponse[]> {
    return this.notificationService.getAll();
  }

  @Get('/user/:id')
  @ApiOperation({ summary: 'Get notifications for a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Return notifications for a user' })
  async get(@Param('id') userId: UserIdRequest['userId']) {
    return this.notificationService.getAllUser(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new notification' })
  @ApiResponse({ status: 201, description: 'Notification added successfully' })
  async add(@Body() data: AddNotificationListRequest) {
    return this.microserviceNotificationService.add(data);
  }

  @Patch()
  @ApiOperation({ summary: 'Update a notification' })
  @ApiResponse({ status: 200, description: 'Notification updated successfully' })
  async update(@Body() data: UpdateNotificationListRequest) {
    return this.microserviceNotificationService.update(data);
  }

  @Delete('/:userId/:id')
  @ApiOperation({ summary: 'Remove a notification' })
  @ApiParam({ name: 'userId', description: 'User ID' })
  @ApiParam({ name: 'id', description: 'Notification ID' })
  @ApiResponse({ status: 200, description: 'Notification removed successfully' })
  async remove(
    @Param('id') id: NotificationIdRequest['id'],
    @Param('userId') userId: UserIdRequest['userId'],
  ) {
    return this.microserviceNotificationService.remove({ id, userId });
  }

  @Delete('/user/:id')
  @ApiOperation({ summary: 'Remove all notifications for a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'All notifications for the user removed successfully' })
  async removeAll(@Param('id') userId: UserIdRequest['userId']) {
    return this.microserviceNotificationService.removeAll({ userId });
  }

  @Delete('/job/:id')
  @ApiOperation({ summary: 'Remove a job notification' })
  @ApiParam({ name: 'id', description: 'Job ID' })
  @ApiResponse({ status: 200, description: 'Job notification removed successfully' })
  async removeJob(@Param('id') id: JobIdRequest['id']) {
    return this.microserviceNotificationService.removeJob({ id });
  }

  @Delete('/queue')
  @ApiOperation({ summary: 'Clear job queue' })
  @ApiResponse({ status: 200, description: 'Job queue cleared successfully' })
  async clearJob(@Body() data: EmptyRequest) {
    return this.microserviceNotificationService.clearJob(data);
  }

  @Delete('/queue/:id')
  @ApiOperation({ summary: 'Clear job queue for a user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Job queue for the user cleared successfully' })
  async clearUserJob(@Param('id') userId: UserIdRequest['userId']) {
    return this.microserviceNotificationService.clearUserJob({ userId });
  }
}
