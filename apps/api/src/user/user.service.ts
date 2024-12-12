import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[A-Za-z]).{8,}$/;

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!this.passwordRegex.test(createUserDto.password)) {
      throw new HttpException(
        'Password must contain at least 8 characters, 1 digit, 1 lowercase letter, and 1 uppercase letter',
        400,
      );
    }

    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      +process.env.BCRYPT_PASSWORD_SALT,
    );

    const userData = this.userRepository.create(createUserDto);
    return this.userRepository.save(userData);
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      console.error(error);
      throw new HttpException('Internal Server Error', 500);
    }
  }

  async findOne(id: number): Promise<User> {
    const userData = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.events', 'event')
      .select([
        'user.id',
        'user.email',
        'event.id',
        'event.title',
        'event.date',
        'event.description',
      ])
      .where('user.id = :id', { id })
      .getOne();

    if (!userData) {
      throw new HttpException('User Not Found', 404);
    }

    return userData;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const existingUser = await this.findOne(id);
    if (updateUserDto.password) {
      if (!this.passwordRegex.test(updateUserDto.password)) {
        throw new HttpException(
          'Password must contain at least 8 characters, 1 digit, 1 lowercase letter, and 1 uppercase letter',
          400,
        );
      }

      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        +process.env.BCRYPT_PASSWORD_SALT,
      );
    }

    const userData = this.userRepository.merge(existingUser, {
      ...updateUserDto,
    });
    return this.userRepository.save(userData);
  }

  async remove(id: number): Promise<User> {
    const existingUser = await this.findOne(id);
    return this.userRepository.remove(existingUser);
  }
}
