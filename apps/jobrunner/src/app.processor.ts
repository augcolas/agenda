import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('notification')
export class AppProcessor extends WorkerHost {
  async process(job: Job): Promise<any> {
    try {
      const data = job.data;
      const { text } = data;

      console.log(`Processing event reminder...`);
      console.log(`Event Title: ${text}`);
      console.log(job.id);
      console.log(job.opts.delay);
    } catch (error) {
      console.error('Failed to process job:', job.id, error);
    }
  }
}
