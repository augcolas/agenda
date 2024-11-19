import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppProcessor } from './app.processor';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number.parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'notification',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppProcessor],
})
export class AppModule {}
