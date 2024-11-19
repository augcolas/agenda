import { LoginPayload, Token } from '@agenda/proto/auth';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { AppService } from './app.service';
import { UserAuthService } from './userAuth.service';

@Controller('protoauth')
export class AppController {
  constructor(
    private userAuthService: UserAuthService,
    private appService: AppService,
  ) {}

  @GrpcMethod('AuthService', 'login')
  async login(loginUser: LoginPayload): Promise<{ token: string }> {
    const user = await this.userAuthService.findByName(loginUser.login);
    return this.appService.login(loginUser, user);
  }

  @GrpcMethod('AuthService', 'invalidateToken')
  async invalidateToken(token: Token): Promise<void> {
    return this.appService.invalidateToken(token.token);
  }
}
