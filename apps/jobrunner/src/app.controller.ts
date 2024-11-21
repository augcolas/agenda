import {
  AddNotificationRequest,
  NotificationIdRequest,
  NotificationServiceController,
  NotificationServiceControllerMethods,
  UserIdRequest,
} from '@agenda/proto/notification';
import { Controller } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
@NotificationServiceControllerMethods()
export class AppController implements NotificationServiceController {
  constructor(private readonly appService: AppService) {}

  async findAll() {
    return this.appService.findAll();
  }

  async findOne(data: NotificationIdRequest) {
    return this.appService.findOne(data);
  }

  async findByUser(data: UserIdRequest) {
    return this.appService.findByUser(data.id);
  }

  async add(data: AddNotificationRequest) {
    return this.appService.add(data);
  }
}
