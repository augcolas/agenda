import { BooleanResponse, TokenResponse } from '@agenda/proto/auth';
import { Body, Controller, Post, Req } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Observable } from 'rxjs';

import { Public } from '../decorators/public.decorator';
import { AuthService } from './auth.service';
import { EmailDto, LoginUserDto, PasswordDto } from './dto/login-user.dto';

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

  @Public()
  @Post('forgotPassword')
  forgotPassword(
    @Body() forgotPassword: EmailDto,
  ): Observable<BooleanResponse> {
    return this.authService.forgotPassword({ email: forgotPassword.email });
  }

  @Post('updatePassword')
  updatePassword(
    @Body() password: PasswordDto,
    @Req() req: Request,
  ): Observable<BooleanResponse> {
    const hashedPassword = bcrypt.hashSync(password.password, 10);
    return this.authService.updateUserByResetToken({
      token: req['token'],
      password: hashedPassword,
    });
  }
}
