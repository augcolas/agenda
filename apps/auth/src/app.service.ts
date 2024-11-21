import {
  BooleanResponse,
  LoginPayloadRequest,
  TokenRequest,
  TokenResponse,
} from '@agenda/proto/auth';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import * as bcrypt from 'bcrypt';
import { Redis } from 'ioredis';

import { UserAuthService } from './userAuth.service';

@Injectable()
export class AppService {
  constructor(
    private jwtService: JwtService,
    private userAuthService: UserAuthService,
    @InjectRedis() private redisService: Redis,
  ) {}

  async login(loginUser: LoginPayloadRequest): Promise<TokenResponse> {
    const userDb = await this.userAuthService.findByName(loginUser.login);

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

  async invalidateToken(token: TokenRequest): Promise<BooleanResponse> {
    const decoded = this.jwtService.decode(token.token);
    const tokenExpiry = decoded.exp * 1000; // JWT expiry is in seconds, so we convert to milliseconds.

    // Calculate the remaining time to live (TTL) for the token.
    const currentTime = Date.now();
    const ttl = tokenExpiry - currentTime;

    if (ttl > 0) {
      await this.redisService.set(token.token, 'blacklisted', 'PX', ttl);
      return { value: true };
    }
    return { value: true };
  }

  async isJwtTokenUpToDate(token: TokenRequest): Promise<BooleanResponse> {
    const decodedToken = this.jwtService.decode(token.token);
    const userDb = await this.userAuthService.findById(decodedToken.sub);

    return {
      value:
        decodedToken.sub === userDb.id &&
        decodedToken.email === userDb.email &&
        decodedToken.role === userDb.role,
    };
  }
}
