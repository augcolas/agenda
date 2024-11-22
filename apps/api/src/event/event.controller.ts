import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';

import { CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';


@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Req() req: Request, @Body() createEventDto: CreateEventDto) {
    return this.eventService.create(req['user']?.sub, createEventDto);
  }

  @Get()
  async findAll(@Req() req: Request,) {
    return this.eventService.findAll(req['user']?.sub);
  }

  @Get(':id')
  async findOne(@Req() req: Request, @Param('id') id: number) {
    return this.eventService.findOne(req['user']?.sub, id);
  }

  @Patch(':id')
  async update(@Req() req: Request, @Param('id') id: number, @Body() updateEventDto: CreateEventDto) {
      return this.eventService.update(req['user']?.sub, id, updateEventDto);
  }

  @Delete(':id')
  async remove(@Req() req: Request, @Param('id') id: number) {
      return this.eventService.remove(req['user']?.sub, id);
  }

}
