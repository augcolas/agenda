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

  findAll() {
    return this.appService.findAll();
  }

  findOne(data: NotificationIdRequest) {
    return this.appService.findOne(data);
  }

  findByUser(data: UserIdRequest) {
    return this.appService.findByUser(data.id);
  }

  add(data: AddNotificationRequest) {
    return this.appService.add(data);
  }

  remove(data: NotificationIdRequest) {
    return this.appService.remove(data);
  }

  update(data: NotificationIdRequest) {
    return this.appService.update(data);
  }
}
