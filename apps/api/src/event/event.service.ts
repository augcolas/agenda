import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserService } from '../user/user.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from './entities/event';

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    private readonly userService: UserService,
  ) {}

  async create(createEventDto: CreateEventDto, userId: number): Promise<Event> {
    const users = await Promise.all(
      createEventDto.users.map(async (eventUserId) => {
        const user = await this.userService.findOne(eventUserId);
        if (!user) {
          throw new HttpException(`User with ID ${eventUserId} not found`, 404);
        }
        return user;
      }),
    );

    if (!users.some((user) => user.id === userId)) {
      throw new HttpException('User must be part of the event', 400);
    }

    const event = this.eventRepository.create({
      ...createEventDto,
      users,
    });

    await this.eventRepository.save(event);
    return this.findOne(userId, event.id);
  }

  async findAll(userId: number): Promise<Event[]> {
    try {
      return await this.eventRepository
        .createQueryBuilder('event')
        .leftJoinAndSelect('event.users', 'user')
        .select([
          'event.id',
          'event.date',
          'event.title',
          'event.description',
          'user.id',
          'user.email',
        ])
        .where((qb) => {
          const subQuery = qb
            .subQuery()
            .select('eu.eventId')
            .from('event_users_user', 'eu')
            .where('eu.userId = :userId', { userId })
            .getQuery();

          return `event.id IN ${subQuery}`;
        })
        .getMany();
    } catch (error) {
      console.error(error);
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async findOne(userId: number, id: number): Promise<Event> {
    const eventData = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.users', 'user')
      .select([
        'event.id',
        'event.date',
        'event.title',
        'event.description',
        'user.id',
        'user.email',
      ])
      .where('event.id = :id', { id })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('eu.eventId')
          .from('event_users_user', 'eu')
          .where('eu.userId = :userId', { userId })
          .getQuery();

        return `event.id IN ${subQuery}`;
      })
      .getOne();

    if (!eventData) {
      throw new HttpException('Event Not Found or Access Denied', 404);
    }

    return eventData;
  }

  async update(
    userId: number,
    id: number,
    updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    const existingEvent = await this.findOne(userId, id);

    const users = await Promise.all(
      updateEventDto.users.map(async (updateUserId) => {
        const user = await this.userService.findOne(updateUserId);
        if (!user) {
          throw new HttpException(
            `User with ID ${updateUserId} not found`,
            404,
          );
        }
        return user;
      }),
    );

    existingEvent.users = users;
    existingEvent.date = updateEventDto.date || existingEvent.date;
    existingEvent.title = updateEventDto.title || existingEvent.title;
    existingEvent.description =
      updateEventDto.description || existingEvent.description;

    await this.eventRepository.save(existingEvent);
    return this.findOne(userId, id);
  }

  async remove(userId: number, id: number): Promise<Event> {
    return this.eventRepository.remove(await this.findOne(userId, id));
  }
}
