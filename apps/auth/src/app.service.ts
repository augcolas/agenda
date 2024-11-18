import { LoginPayload } from '@agenda/proto/auth';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from './user';

@Injectable()
export class AppService {
  constructor(private jwtService: JwtService) {}

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
}
