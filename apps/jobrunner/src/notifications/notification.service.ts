import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class JobService {
  constructor(@InjectQueue('job') private jobQueue: Queue) {}

  async findAll() {
    return this.jobQueue.getJobCounts();
  }

  async findOne(id: string) {
    return this.jobQueue.getJob(id);
  }

  async addJob() {
    await this.jobQueue.add('job', {
      name: 'job',
    });
  }
}
