import {
  Body,
  Controller,
  Inject,
  OnModuleInit,
  Post,
  Req,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

import { Public } from '../decorators/public.decorator';
import { LoginUserDto } from './dto/login-user.dto';

interface AuthService {
  login(data: { login: string; password: string }): Observable<string>;

  invalidateToken(data: { token: string }): Observable<void>;
}

@Controller('auth')
export class AuthController implements OnModuleInit {
  private authService: AuthService;

  constructor(@Inject('AUTHPROTO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  @Public()
  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    return this.authService.login({
      login: loginUser.email,
      password: loginUser.password,
    });
  }

  @Post('logout')
  async logout(@Req() req: Request) {
    return this.authService.invalidateToken({
      token: req['token'],
    });
  }
}
