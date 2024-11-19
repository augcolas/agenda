import { LoginPayload } from '@agenda/proto/auth';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import * as bcrypt from 'bcrypt';
import { Redis } from 'ioredis';

import { User } from './user';

@Injectable()
export class AppService {
  constructor(
    private jwtService: JwtService,
    @InjectRedis() private redisService: Redis,
  ) {}

  async login(
    loginUser: LoginPayload,
    userDb: User,
  ): Promise<{ token: string }> {
    if (!(loginUser.password && userDb?.password)) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(loginUser.password, userDb?.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: userDb.id, email: userDb.email, role: userDb.role };
    return {
      token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async invalidateToken(token: string) {
    const decoded = this.jwtService.decode(token);
    const tokenExpiry = decoded.exp * 1000; // JWT expiry is in seconds, so we convert to milliseconds.

    // Calculate the remaining time to live (TTL) for the token.
    const currentTime = Date.now();
    const ttl = tokenExpiry - currentTime;

    if (ttl > 0) {
      await this.redisService.set(token, 'blacklisted', 'PX', ttl);
    }
  }
}
