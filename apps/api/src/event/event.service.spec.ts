import { ConfigModule } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user';
import { type DeepPartial, type Repository } from 'typeorm';

import { Event } from './entities/event';
import { EventService } from './event.service';

describe('EventService', () => {
  let service: EventService;
  let repo: Repository<Event>;
  let userRepo: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        await ConfigModule.forRoot({
          envFilePath: '../../.env',
        }),
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.POSTGRES_HOST,
          port: Number.parseInt(process.env.POSTGRES_TEST_PORT),
          password: process.env.POSTGRES_PASSWORD,
          username: process.env.POSTGRES_USER,
          autoLoadEntities: true,
          database: process.env.POSTGRES_TEST_DB,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Event]),
      ],
      providers: [EventService],
    }).compile();

    service = module.get<EventService>(EventService);
    repo = module.get<Repository<Event>>(getRepositoryToken(Event));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));

    /* eslint-disable sonarjs/no-hardcoded-credentials */
    await userRepo.save([
      {
        email: 'test@gmail.com',
        password: 'defaultTestPassword',
        areNotificationsEnabled: true,
        role: 'USER',
      },
      {
        email: 'test2@gmail.com',
        password: 'defaultTestPassword',
        areNotificationsEnabled: true,
        role: 'USER',
      },
    ] as DeepPartial<User>[]);
    /* eslint-enable sonarjs/no-hardcoded-credentials */
  });

  beforeEach(async () => {
    const user1 = await userRepo.findOneBy({ id: 1 });
    const user2 = await userRepo.findOneBy({ id: 2 });

    await repo.save([
      {
        users: [user1],
        description: 'Test Event',
        title: 'Test Event',
        date: new Date().toISOString(),
      },
      {
        users: [user2],
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
      {
        id: expect.any(Number),
        users: [1],
        description: 'Test Event',
        title: 'Test Event',
        date: expect.any(String),
      },
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
    expect(events).toEqual({
      id: expect.any(Number),
      users: [1],
      description: 'Test Event',
      title: 'Test Event',
      date: expect.any(String),
    });
  });

  it('should throw an error if event not found', async () => {
    const userId = 1;
    const eventId = 2;
    await expect(service.findOne(userId, eventId)).rejects.toThrow(
      'Event Not Found',
    );
  });

  // --- Tests create ---
  it('should create an event', async () => {
    const event = await service.create({
      users: [1],
      description: 'Test Event 2',
      title: 'Test Event 2',
      date: new Date().toISOString(),
    });

    expect(event).toEqual({
      id: expect.any(Number),
      users: [1],
      description: 'Test Event 2',
      title: 'Test Event 2',
      date: expect.any(String),
    });
  });

  // --- Tests update ---
  it('should update an event', async () => {
    const userId = 1;
    const eventId = 1;
    const event = await service.update(userId, eventId, {
      users: [1],
      description: 'Test Event Updated',
      title: 'Test Event Updated',
    });

    expect(event).toEqual({
      id: expect.any(Number),
      users: [1],
      description: 'Test Event Updated',
      title: 'Test Event Updated',
      date: expect.any(String),
    });
  });

  // --- Tests remove ---
  it('should remove an event', async () => {
    const userId = 1;
    const eventId = 1;
    const event = await service.remove(userId, eventId);

    expect(event).toEqual({
      id: undefined,
      users: [1],
      description: 'Test Event',
      title: 'Test Event',
      date: expect.any(String),
    });
  });
});
