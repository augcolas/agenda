import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';

import { CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';


@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  async findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.eventService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateEventDto: CreateEventDto) {
      return this.eventService.update(id, updateEventDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
      return this.eventService.remove(id);
  }

}
