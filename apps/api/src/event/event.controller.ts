import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateEventDto } from './dto/create-event.dto';
import { EventService } from './event.service';

@ApiTags('events')
@ApiBearerAuth()
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post()
  @ApiOperation({ summary: 'Create event' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 201, description: 'The event has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createEventDto: CreateEventDto) {
    return this.eventService.create(createEventDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all events' })
  @ApiResponse({ status: 200, description: 'Return all events.' })
  async findAll(@Req() req: Request) {
    return this.eventService.findAll(req['user']?.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by id' })
  @ApiParam({ name: 'id', type: 'number', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'Return the event.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  async findOne(@Req() req: Request, @Param('id') id: number) {
    return this.eventService.findOne(req['user']?.sub, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update event by id' })
  @ApiParam({ name: 'id', type: 'number', description: 'Event ID' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({ status: 200, description: 'The event has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  async update(@Req() req: Request, @Param('id') id: number, @Body() updateEventDto: CreateEventDto) {
    return this.eventService.update(req['user']?.sub, id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete event by id' })
  @ApiParam({ name: 'id', type: 'number', description: 'Event ID' })
  @ApiResponse({ status: 200, description: 'The event has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Event not found.' })
  async remove(@Req() req: Request, @Param('id') id: number) {
    return this.eventService.remove(req['user']?.sub, id);
  }
}
