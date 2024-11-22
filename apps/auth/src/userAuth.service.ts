import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByName(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }
}
