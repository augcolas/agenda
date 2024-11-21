import {
  AuthServiceController,
  AuthServiceControllerMethods,
  LoginPayloadRequest,
  TokenRequest,
} from '@agenda/proto/auth';
import { Controller } from '@nestjs/common';

import { AppService } from './app.service';

@Controller('protoauth')
@AuthServiceControllerMethods()
export class AppController implements AuthServiceController {
  constructor(private appService: AppService) {}

  async login(loginUser: LoginPayloadRequest): Promise<{ token: string }> {
    return this.appService.login(loginUser);
  }

  async invalidateToken(token: TokenRequest): Promise<{ value: boolean }> {
    return this.appService.invalidateToken(token);
  }

  async isJwtTokenUpToDate(token: TokenRequest): Promise<{ value: boolean }> {
    return this.appService.isJwtTokenUpToDate(token);
  }
}
