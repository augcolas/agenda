import {
  AddNotificationListRequest,
  JobIdRequest,
  NotificationServiceController,
  NotificationServiceControllerMethods,
  RemoveNotificationRequest,
  UpdateNotificationListRequest,
  UserIdRequest,
} from '@agenda/proto/notification';
import { Controller } from '@nestjs/common';

import { NotificationService } from './notification.service';

@Controller()
@NotificationServiceControllerMethods()
export class NotificationController implements NotificationServiceController {
  constructor(private readonly notificationService: NotificationService) {}

  add(data: AddNotificationListRequest) {
    return this.notificationService.add(data);
  }

  update(data: UpdateNotificationListRequest) {
    return this.notificationService.update(data);
  }

  remove(data: RemoveNotificationRequest) {
    return this.notificationService.remove(data);
  }

  removeAll(data: UserIdRequest) {
    return this.notificationService.removeAll(data);
  }

  removeJob(data: JobIdRequest) {
    return this.notificationService.removeJob(data);
  }

  clearJob(){
    return this.notificationService.clearJob();
  }

  clearUserJob(data: UserIdRequest) {
    return this.notificationService.clearUserJob(data);
  }
}
