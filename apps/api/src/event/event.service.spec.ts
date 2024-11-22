import { ConfigModule } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { type Repository } from 'typeorm';

import { Event } from './entities/event';
import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;
  let repo: Repository<Event>;

  beforeAll(async () => {
    // Configuration du module de test
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({
          envFilePath: '../../.env',
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number.parseInt(process.env.POSTGRES_PORT),
          password: process.env.POSTGRES_PASSWORD,
          username: process.env.POSTGRES_USER,
          autoLoadEntities: true, // typeorm loads entities from this directory
          database: process.env.POSTGRES_TEST_DB,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Event]), // Injecte le repository pour l'entité Event
      ],
      providers: [EventService],
    }).compile();

    service = module.get<EventService>(EventService);
    repo = module.get<Repository<Event>>(getRepositoryToken(Event));
  });

  beforeEach(async () => {
    await repo.save([
      {
        userIds: [1],
        description: 'Test Event',
        title: 'Test Event',
        date: new Date().toISOString(),
      },
      {
        userIds: [2],
        description: 'Test Event Not Owned',
        title: 'Test Event Not Owned',
        date: new Date().toISOString(),
      },
    ]);
  });

  afterEach(async () => {
    await repo.clear();
    await repo.query(`ALTER SEQUENCE event_id_seq RESTART WITH 1`);
  });

  // --- Tests findAll ---
  it('should find all events for the user', async () => {
    const events = await service.findAll(1);

    expect(events).toEqual([
      { id: expect.any(Number), userIds: [1], description: 'Test Event', title: 'Test Event', date: expect.any(String) }
    ]);
  });

  it('should return empty array if no events for the user', async () => {
    const events = await service.findAll(3); // User 3 has no events

    expect(events).toEqual([]);
  });

  // --- Tests findOne ---
  it('should find one event for the user', async () => {
    const userId = 1;
    const eventId = 1;
    const events = await service.findOne(userId, eventId);
    expect(events).toEqual({ id: expect.any(Number), userIds: [1], description: 'Test Event', title: 'Test Event', date: expect.any(String) });
  });

  it('should throw an error if event not found', async () => {
    const userId = 1;
    const eventId = 2;
    await expect(service.findOne(userId, eventId)).rejects.toThrow('Event Not Found');
  });

  // --- Tests create ---
  it('should create an event', async () => {
    const event = await service.create({
      userIds: [1],
      description: 'Test Event 2',
      title: 'Test Event 2',
      date: new Date().toISOString(),
    });

    expect(event).toEqual({ id: expect.any(Number), userIds: [1], description: 'Test Event 2', title: 'Test Event 2', date: expect.any(String) });
  });

  // --- Tests update ---
  it('should update an event', async () => {
    const userId = 1;
    const eventId = 1;
    const event = await service.update(userId, eventId, {
      userIds: [1],
      description: 'Test Event Updated',
      title: 'Test Event Updated',
    });

    expect(event).toEqual({ id: expect.any(Number), userIds: [1], description: 'Test Event Updated', title: 'Test Event Updated', date: expect.any(String) });
  });

  // --- Tests remove ---
  it('should remove an event', async () => {
    const userId = 1;
    const eventId = 1;
    const event = await service.remove(userId, eventId);

    expect(event).toEqual({ id:undefined, userIds: [1], description: 'Test Event', title: 'Test Event', date: expect.any(String) });
  });
});
