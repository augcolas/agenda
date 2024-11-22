import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number.parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    NotificationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
