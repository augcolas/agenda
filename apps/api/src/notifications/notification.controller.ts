import {
  AddNotificationRequest,
  EmptyRequest,
  NotificationIdRequest,
  NotificationListResponse,
  NotificationResponse,
  UserIdRequest,
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
  add(data: AddNotificationRequest): Observable<NotificationResponse>;
  findAll(arg0: EmptyRequest): Observable<NotificationListResponse>;
  findByUser(data: UserIdRequest): Observable<NotificationListResponse>;
  findOne(data: NotificationIdRequest): Observable<NotificationResponse>;
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
  findOne(@Param('id') id: NotificationIdRequest['id']) {
    const job = this.notificationService.findOne({ id });
    return job;
  }

  @Get('user/:id')
  findByUser(@Param('id') id: UserIdRequest['id']) {
    return this.notificationService.findByUser({ id });
  }

  @Post('add')
  async add(@Body() data: AddNotificationRequest) {
    return this.notificationService.add(data);
  }
}
