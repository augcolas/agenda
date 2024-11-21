import {
  addNotification,
  empty,
  notification,
  notificationId,
  notificationList,
  userId,
} from '@agenda/proto/notification';
import {
  Body,
  Controller,
  Get,
  Inject,
  OnModuleInit,
  Param,
  Post,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface NotificationService {
  add(data: addNotification): Observable<notification>;
  findAll(arg0: empty): Observable<notificationList>;
  findByUser(data: userId): Observable<notificationList>;
  findOne(data: notificationId): Observable<notification>;
}

@Controller('notification')
export class NotificationController implements OnModuleInit {
  private notificationService: NotificationService;

  constructor(
    @Inject('NOTIFICATIONPROTO_PACKAGE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.notificationService = this.client.getService<NotificationService>(
      'NotificationService',
    );
  }

  @Get('findAll')
  async findAll() {
    return this.notificationService.findAll('empty');
  }

  @Get(':id')
  findOne(@Param('id') id: notificationId['id']) {
    const job = this.notificationService.findOne({ id });
    return job;
  }

  @Get('user/:id')
  findByUser(@Param('id') id: userId['id']) {
    return this.notificationService.findByUser({ id });
  }

  @Post('add')
  async add(@Body() data: addNotification) {
    return this.notificationService.add(data);
  }
}
