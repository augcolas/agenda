import { BooleanResponse, TokenResponse } from '@agenda/proto/auth';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { Observable } from 'rxjs';

import { Public } from '../decorators/public.decorator';
import { AuthService } from './auth.service';
import { EmailDto, LoginUserDto, PasswordDto } from './dto/login-user.dto';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'User logged in successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  login(@Body() loginUser: LoginUserDto): Observable<TokenResponse> {
    return this.authService.login({
      login: loginUser.email,
      password: loginUser.password,
    });
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully.' })
  logout(@Req() req: Request): void {
    this.authService
      .invalidateToken({
        token: req['token'],
      })
      .subscribe();
  }

  @Public()
  @Post('forgotPassword')
  @ApiOperation({ summary: 'Forgot password' })
  @ApiBody({ type: EmailDto })
  @ApiResponse({ status: 200, description: 'Password reset email sent.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  forgotPassword(@Body() forgotPassword: EmailDto): Observable<BooleanResponse> {
    return this.authService.forgotPassword({ email: forgotPassword.email });
  }

  @Post('updatePassword')
  @ApiOperation({ summary: 'Update password' })
  @ApiBody({ type: PasswordDto })
  @ApiResponse({ status: 200, description: 'Password updated successfully.'})
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  updatePassword(@Body() password: PasswordDto, @Req() req: Request): Observable<BooleanResponse> {
    const hashedPassword = bcrypt.hashSync(password.password, 10);
    return this.authService.updateUserByResetToken({
      token: req['token'],
      password: hashedPassword,
    });
  }
}
