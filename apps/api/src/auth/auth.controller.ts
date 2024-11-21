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
  login(@Body() loginUser: LoginUserDto): Observable<string> {
    return this.authService.login(loginUser.email, loginUser.password);
  }

  @Post('logout')
  logout(@Req() req: Request): Observable<void> {
    return this.authService.invalidateToken(req['token']);
  }
}
