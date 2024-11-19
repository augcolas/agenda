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

  async create(userId: number, createEventDto: CreateEventDto): Promise<Event> {
    createEventDto.userId = userId; //forcing userId so you can't create an event for another user
    const eventData = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(eventData);
  }

  async findAll(userId: number): Promise<Event[]> {
    console.log(userId);
    return this.eventRepository.find({ where: { userId } });
  }

  async findOne(id: number, userId: number): Promise<Event> {
    const EventData = await this.eventRepository.findOne({ where: { id, userId } });
    if (!EventData) {
      throw new HttpException('Event Not Found', 404);
    }
    return EventData;
  }

  async update(id: number,userId: number, updateEventDto: UpdateEventDto): Promise<Event> {
    const ExistingEvent = await this.eventRepository.findOne({ where: { id, userId } });
    if (!ExistingEvent) {
      throw new HttpException('Event Not Found', 404);
    }
    const eventData = this.eventRepository.merge(ExistingEvent, updateEventDto);
    return this.eventRepository.save(eventData);
  }

  async remove(id: number, userId: number): Promise<Event> {
      const ExistingEvent = await this.eventRepository.findOne({ where: { id, userId } });
      if (!ExistingEvent) {
          throw new HttpException('Event Not Found', 404);
      }
      return this.eventRepository.remove(ExistingEvent);
  }
}
