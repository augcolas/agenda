import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JobModule } from './notifications/notification.module';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number.parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    JobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
