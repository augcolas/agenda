import { Controller, Get, Param, Post } from '@nestjs/common';

import { JobService } from './notification.service';

@Controller('job')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
  test() {
    return 'Hello World!';
  }

  @Get('/all')
  findAll() {
    return this.jobService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobService.findOne(id);
  }

  @Post()
  addJob() {
    return this.jobService.addJob();
  }
}
