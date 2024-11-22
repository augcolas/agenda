import {
  AddNotificationRequest,
  NotificationIdRequest,
  NotificationServiceController,
  NotificationServiceControllerMethods,
  UpdateNotificationRequest,
  UserIdRequest,
} from '@agenda/proto/notification';
import { Controller } from '@nestjs/common';

import { NotificationService } from './notification.service';

@Controller()
@NotificationServiceControllerMethods()
export class NotificationController implements NotificationServiceController {
  constructor(private readonly notificationService: NotificationService) {}

  findAll() {
    return this.notificationService.findAll();
  }

  findOne(data: NotificationIdRequest) {
    return this.notificationService.findOne(data);
  }

  findByUser(data: UserIdRequest) {
    return this.notificationService.findByUser(data.id);
  }

  add(data: AddNotificationRequest) {
    return this.notificationService.add(data);
  }

  remove(data: NotificationIdRequest) {
    return this.notificationService.remove(data);
  }

  update(data: UpdateNotificationRequest) {
    return this.notificationService.update(data);
  }
}
