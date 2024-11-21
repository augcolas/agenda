import {
  AddNotificationRequest,
  NotificationIdRequest,
  NotificationServiceClient,
  UserIdRequest,
} from '@agenda/proto/notification';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';

@Controller('notifications')
export class NotificationController implements OnModuleInit {
  private notificationService: NotificationServiceClient;

  constructor(
    @Inject('NOTIFICATIONPROTO_PACKAGE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.notificationService =
      this.client.getService<NotificationServiceClient>('NotificationService');
  }

  @Get()
  async findAll() {
    return this.notificationService.findAll({});
  }

  @Get(':id')
  findOne(@Param('id') id: NotificationIdRequest['id']) {
    const job = this.notificationService.findOne({ id });
    return job;
  }

  @Get('user/:id')
  findByUser(@Param('id') id: UserIdRequest['id']) {
    return this.notificationService.findByUser({ id });
  }

  @Post()
  async add(@Body() data: AddNotificationRequest) {
    return this.notificationService.add(data);
  }

  @Delete(':id')
  async remove(@Param('id') id: NotificationIdRequest['id']) {
    return this.notificationService.remove({ id });
  }

  @Patch(':id')
  async update(@Param('id') id: NotificationIdRequest['id']) {
    return this.notificationService.update({ id });
  }
}
