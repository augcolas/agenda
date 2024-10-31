import { Module } from '@nestjs/common';

import { JobController } from './notification.controller';
import { JobService } from './notification.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'job',
    }),
  ],
  controllers: [JobController],
  providers: [JobService],
  exports: [JobService],
})
export class JobModule {}
