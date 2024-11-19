import {CanActivate, ExecutionContext, Injectable, UnauthorizedException,} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {Request} from 'express';

import {Role} from '../user/entities/user';

/**
 * Guard to check that the user requesting a resource is the one concerned (same user.id) or that their role is ADMIN
 */
@Injectable()
export class UserIdGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      request['user'] = payload;

      if (payload.role === Role.ADMIN) {
        return true;
      }

      const requestedId = request.params.id;

      if (requestedId && payload.sub === +requestedId) {
        return true;
      }

      throw new UnauthorizedException('Access denied');
    } catch {
      throw new UnauthorizedException('Invalid token or access denied');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
