import { LoginPayload, Token } from '@agenda/proto/auth';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { AppService } from './app.service';

@Controller('protoauth')
export class AppController {
  constructor(private appService: AppService) {}

  @GrpcMethod('AuthService', 'login')
  async login(loginUser: LoginPayload): Promise<{ token: string }> {
    return this.appService.login(loginUser);
  }

  @GrpcMethod('AuthService', 'invalidateToken')
  async invalidateToken(token: Token): Promise<void> {
    return this.appService.invalidateToken(token.token);
  }

  @GrpcMethod('AuthService', 'isJwtTokenUpToDate')
  async isJwtTokenUpToDate(token: Token): Promise<{ value: boolean }> {
    return this.appService.isJwtTokenUpToDate(token.token);
  }
}
