import { HttpException } from '@nestjs/common';
/* eslint-disable sonarjs/no-hardcoded-credentials */
import { ConfigModule } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { GenericContainer, type StartedTestContainer } from 'testcontainers';
import { type DeepPartial, type Repository } from 'typeorm';

import { Event } from '../event/entities/event';
import { Role, User } from './entities/user';
import { UserService } from './user.service';

jest.mock('bcrypt', () => ({ hash: jest.fn() }));

describe('UserService', () => {
  let userService: UserService;
  let userRepo: Repository<User>;
  let container: StartedTestContainer;
  let databaseUrl: string;

  beforeAll(async () => {
    container = await new GenericContainer('postgres')
      .withExposedPorts(5432)
      .withEnvironment({
        POSTGRES_USER: 'testuser',
        POSTGRES_PASSWORD: 'testpassword',
        POSTGRES_DB: 'testdb',
      })
      .start();

    const host = container.getHost();
    const port = container.getMappedPort(5432);

    databaseUrl = `postgres://testuser:testpassword@${host}:${port}/testdb`;

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
          type: 'postgres',
          url: databaseUrl,
          autoLoadEntities: true,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User, Event]),
      ],
      providers: [UserService],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  }, 30_000);

  afterAll(async () => {
    await container.stop();
  });

  beforeEach(async () => {
    await userRepo.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE');
  });

  it('should create a user and validate the password', async () => {
    const password = 'fakePassword1!';
    const hashedPassword = 'hashedFakePassword';

    (bcrypt.hash as jest.Mock).mockImplementation(() => {
      return hashedPassword;
    });

    const user = await userService.create({
      email: 'test@test.fr',
      password: password,
      role: Role.USER,
      events: null,
    });

    expect(user).toEqual({
      id: 1,
      email: 'test@test.fr',
      role: 'USER',
      password: hashedPassword,
      resetPasswordToken: null,
    });
  });

  it('should fail on user creation du to invalid password format', async () => {
    await expect(
      userService.create({
        email: 'test@test.fr',
        password: 'invalidPassword',
        role: Role.USER,
        events: null,
      }),
    ).rejects.toThrow(
      new HttpException(
        'Password must contain at least 8 characters, 1 digit, 1 lowercase letter, and 1 uppercase letter',
        400,
      ),
    );
  });

  it('should return all users', async () => {
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
        resetPasswordToken: 'resetPasswordToken',
      },
      {
        email: 'test3@gmail.com',
        password: 'defaultTestPassword',
        role: 'USER',
      },
    ] as DeepPartial<User>[]);

    const users = await userService.findAll();

    expect(users).toEqual([
      {
        email: 'test@gmail.com',
        id: 1,
        password: 'defaultTestPassword',
        resetPasswordToken: null,
        role: 'USER',
      },
      {
        email: 'test2@gmail.com',
        id: 2,
        password: 'defaultTestPassword',
        resetPasswordToken: 'resetPasswordToken',
        role: 'USER',
      },
      {
        email: 'test3@gmail.com',
        id: 3,
        password: 'defaultTestPassword',
        resetPasswordToken: null,
        role: 'USER',
      },
    ]);
  });

  it('should return one specific user based on its id', async () => {
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
        resetPasswordToken: 'resetPasswordToken',
      },
      {
        email: 'test3@gmail.com',
        password: 'defaultTestPassword',
        role: 'USER',
      },
    ] as DeepPartial<User>[]);

    const user = await userService.findOne(1);

    expect(user).toEqual({
      email: 'test@gmail.com',
      events: [],
      id: 1,
    });
  });

  it('should fail when looking for one specific user not existing', async () => {
    await expect(userService.findOne(1)).rejects.toThrow(
      new HttpException('User Not Found', 404),
    );
  });

  it('should update one user', async () => {
    await userRepo.save([
      {
        email: 'test@gmail.com',
        password: 'defaultTestPassword',
        role: 'USER',
      },
    ] as DeepPartial<User>);

    (bcrypt.hash as jest.Mock).mockImplementation(() => {
      return 'updatedTestPassword!1';
    });

    const user = await userService.update(1, {
      email: 'updatedEmail@gmail.com',
      password: 'updatedTestPassword!1',
      role: Role.ADMIN,
    });

    expect(user).toEqual({
      email: 'updatedEmail@gmail.com',
      events: [],
      id: 1,
      password: 'updatedTestPassword!1',
      resetPasswordToken: null,
      role: 'ADMIN',
    });
  });

  it('should fail on user update du to invalid password format', async () => {
    await expect(
      userService.update(1, {
        password: 'invalidPassword',
      }),
    ).rejects.toThrow(
      new HttpException(
        'Password must contain at least 8 characters, 1 digit, 1 lowercase letter, and 1 uppercase letter',
        400,
      ),
    );
  });

  it('should delete one user', async () => {
    await userRepo.save([
      {
        email: 'test@gmail.com',
        password: 'defaultTestPassword',
        role: 'USER',
      },
    ] as DeepPartial<User>);

    (bcrypt.hash as jest.Mock).mockImplementation(() => {
      return 'updatedTestPassword!1';
    });

    const user = await userService.remove(1);

    expect(user).toEqual({
      email: 'test@gmail.com',
      events: [],
    });
  });
});
