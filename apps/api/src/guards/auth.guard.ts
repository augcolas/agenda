import {BooleanResponse} from '@agenda/proto/auth';
import {CanActivate, ExecutionContext, forwardRef, Inject, Injectable, UnauthorizedException,} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {JwtService} from '@nestjs/jwt';
import {InjectRedis} from '@nestjs-modules/ioredis';
import {Request} from 'express';
import {Redis} from 'ioredis';
import {firstValueFrom} from 'rxjs';

import {AuthService} from '../auth/auth.service';
import {IS_PUBLIC_KEY} from '../decorators/public.decorator';

/**
 * Guard to check if user is authenticated (valid JWT token)
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private reflector: Reflector,
    @InjectRedis() private redisService: Redis,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    let isBlacklisted: string;
    try {
      isBlacklisted = await this.redisService.get(token);
    } catch {
      throw new UnauthorizedException('Redis server not reachable');
    }
    if (isBlacklisted) {
      throw new UnauthorizedException('Revoked token');
    }

    let isTokenUpToDate: BooleanResponse;
    try {
      isTokenUpToDate = await firstValueFrom(
        this.authService.isJwtTokenUpToDate({ token }),
      );
    } catch {
      throw new UnauthorizedException('Authentication server unreachable');
    }
    if (!isTokenUpToDate.value) {
      throw new UnauthorizedException(
        'Token not matching registered user data',
      );
    }

    try {
      request['user'] = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      request['token'] = token;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
