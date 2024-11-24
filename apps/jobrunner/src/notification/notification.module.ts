import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { NotificationController } from './notification.controller';
import { AppProcessor } from './notification.processor';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notification',
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, AppProcessor],
})
export class NotificationModule {}
