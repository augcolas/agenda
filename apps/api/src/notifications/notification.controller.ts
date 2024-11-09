import {
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
  add(empty): Observable<undefined>;
  findAll(empty): Observable<undefined>;
  findOne(id: string): Observable<undefined>;
  test(empty): Observable<string>;
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

  @Get()
  async test() {
    return this.notificationService.test('empty');
  }

  @Get('findAll')
  async findAll() {
    return this.notificationService.findAll('empty');
  }

  @Get('findOne/:id')
  async findOne(@Param('id') id: string) {
    return this.notificationService.findOne(id);
  }

  @Post('add')
  async add() {
    return this.notificationService.add('empty');
  }
}
