import { ConfigModule } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { type DeepPartial, type Repository } from 'typeorm';

import { User } from '../user/entities/user';
import { UserService } from '../user/user.service';
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
        TypeOrmModule.forFeature([Event, User]),
      ],
      providers: [EventService, UserService],
    }).compile();

    service = module.get<EventService>(EventService);
    repo = module.get<Repository<Event>>(getRepositoryToken(Event));
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  beforeEach(async () => {
    await repo.delete({});
    await userRepo.delete({});
    await repo.query(`ALTER SEQUENCE user_id_seq RESTART WITH 1`);
    await repo.query(`ALTER SEQUENCE event_id_seq RESTART WITH 1`);

    /* eslint-disable sonarjs/no-hardcoded-credentials */
    await userRepo.save([
      {
        email: 'test@gmail.com',
        password: 'defaultTestPassword',
        role: 'USER',
      },
      {
        email: 'test2@gmail.com',
        password: 'defaultTestPassword',
        role: 'USER',
      },
      {
        email: 'test3@gmail.com',
        password: 'defaultTestPassword',
        role: 'USER',
      },
    ] as DeepPartial<User>[]);

    const user1 = await userRepo.findOneBy({ id: 1 });
    const user2 = await userRepo.findOneBy({ id: 2 });
    await repo.save([
      {
        users: [user1],
        description: 'Test Event',
        title: 'Test Event User 1',
        date: '2024-01-01T00:00:00.000Z',
      },
      {
        users: [user2],
        description: 'Test Event',
        title: 'Test Event User 2',
        date: '2024-01-03T00:00:00.000Z',
      },
      {
        users: [user1, user2],
        description: 'Test Event Multiple Users',
        title: 'Test Event Multiple Users',
        date: '2024-01-02T00:00:00.000Z',
      },
    ]);
  });

  it('should find all events for the user', async () => {
    const events = await service.findAll(1);

    expect(events).toEqual([
      {
        date: '2024-01-01T00:00:00.000Z',
        description: 'Test Event',
        id: 1,
        title: 'Test Event User 1',
        users: [
          {
            email: 'test@gmail.com',
            id: 1,
          },
        ],
      },
      {
        date: '2024-01-02T00:00:00.000Z',
        description: 'Test Event Multiple Users',
        id: 3,
        title: 'Test Event Multiple Users',
        users: [
          {
            email: 'test@gmail.com',
            id: 1,
          },
          {
            email: 'test2@gmail.com',
            id: 2,
          },
        ],
      },
    ]);
  });

  it('should return empty array if no events for the user', async () => {
    const events = await service.findAll(3); // User 3 has no events

    expect(events).toEqual([]);
  });

  it('should find one event for the user', async () => {
    const userId = 1;
    const eventId = 1;
    const events = await service.findOne(userId, eventId);
    expect(events).toEqual({
      date: '2024-01-01T00:00:00.000Z',
      description: 'Test Event',
      id: 1,
      title: 'Test Event User 1',
      users: [
        {
          email: 'test@gmail.com',
          id: 1,
        },
      ],
    });
  });

  it('should throw an error if user not associated to event', async () => {
    const userId = 2;
    const eventId = 1;
    await expect(service.findOne(userId, eventId)).rejects.toThrow(
      'Event Not Found',
    );
  });

  it('should create an event', async () => {
    const event = await service.create(
      {
        users: [1],
        description: 'Test Event 2',
        title: 'Test Event 2',
        date: '2024-01-03T00:00:00.000Z',
      },
      1,
    );

    expect(event).toEqual({
      date: '2024-01-03T00:00:00.000Z',
      description: 'Test Event 2',
      id: 4,
      title: 'Test Event 2',
      users: [
        {
          email: 'test@gmail.com',
          id: 1,
        },
      ],
    });
  });

  it('should update an event', async () => {
    const userId = 1;
    const eventId = 1;
    const event = await service.update(userId, eventId, {
      users: [1],
      description: 'Test Event Updated',
      title: 'Test Event Updated',
    });

    expect(event).toEqual({
      date: '2024-01-01T00:00:00.000Z',
      description: 'Test Event Updated',
      id: 1,
      title: 'Test Event Updated',
      users: [
        {
          email: 'test@gmail.com',
          id: 1,
        },
      ],
    });
  });

  it('should remove an event', async () => {
    const userId = 1;
    const eventId = 1;
    const event = await service.remove(userId, eventId);

    expect(event).toEqual({
      date: '2024-01-01T00:00:00.000Z',
      description: 'Test Event',
      title: 'Test Event User 1',
      users: [
        {
          email: 'test@gmail.com',
          id: 1,
        },
      ],
    });
  });
});
