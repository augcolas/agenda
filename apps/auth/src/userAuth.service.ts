import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findByToken(token: string): Promise<User> {
    return this.userRepository.findOneBy({ resetPasswordToken: token });
  }

  async updateUserById(userCredential: {
    id: number;
    password: string | null;
    resetPasswordToken: string | null;
  }): Promise<void> {
    const user = await this.findById(userCredential.id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (userCredential.password) user.password = userCredential.password;
    user.resetPasswordToken = userCredential.resetPasswordToken;

    await this.userRepository.save(user);
  }

  async clearResetToken(userId: number): Promise<void> {
    const user = await this.findById(userId);
    user.resetPasswordToken = null;
    await this.userRepository.save(user);
  }
}
