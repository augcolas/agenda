import { TokenResponse } from '@agenda/proto/auth';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { Observable } from 'rxjs';

import { Public } from '../decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() loginUser: LoginUserDto): Observable<TokenResponse> {
    return this.authService.login({
      login: loginUser.email,
      password: loginUser.password,
    });
  }

  @Post('logout')
  logout(@Req() req: Request): void {
    this.authService
      .invalidateToken({
        token: req['token'],
      })
      .subscribe();
  }
}
