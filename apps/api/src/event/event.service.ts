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
    createEventDto.userIds = [userId]; //forcing userId so you can't create an event for another user
    const eventData = this.eventRepository.create(createEventDto);
    return this.eventRepository.save(eventData);
  }

  async findAll(userId: number): Promise<Event[]> {
    return this.eventRepository
      .createQueryBuilder('event')
      .where(':userId = ANY (event.userIds)', { userId })
      .getMany();
  }

  async findOne(userId: number, id: number): Promise<Event> {
    const EventData = await this.eventRepository
      .createQueryBuilder('event')
      .where(':userId = ANY (event.userIds)', { userId })
      .andWhere('event.id = :id', { id })
      .getOne();

    if (!EventData) {
      throw new HttpException('Event Not Found', 404);
    }
    return EventData;
  }

  async update(userId: number, id: number, updateEventDto: UpdateEventDto): Promise<Event> {

    const eventData = this.eventRepository.merge(await this.findOne(userId, id), updateEventDto);
    return this.eventRepository.save(eventData);
  }

  async remove(userId: number, id: number): Promise<Event> {
      return this.eventRepository.remove(await this.findOne(userId, id));
  }
}
