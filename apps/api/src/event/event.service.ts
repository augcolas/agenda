import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event';

@Injectable()
export class EventService {
  constructor(
      @InjectRepository(Event)
      private readonly eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const eventData = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(eventData);
  }

  async findAll(): Promise<Event[]> {
    return this.eventRepository.find();
  }

  async findOne(id: number): Promise<Event> {
    const EventData = await this.eventRepository.findOneBy({ id });
    if (!EventData) {
      throw new HttpException('Event Not Found', 404);
    }
    return EventData;
  }

  async update(id: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const ExistingEvent = await this.findOne(id);
    const eventData = this.eventRepository.merge(ExistingEvent, updateEventDto);
    return this.eventRepository.save(eventData);
  }

  async remove(id: number): Promise<Event> {
      const ExistingEvent = await this.findOne(id);
      return this.eventRepository.remove(ExistingEvent);
  }
}
