import {
  BooleanResponse,
  EmailRequest,
  LoginPayloadRequest,
  TokenRequest,
  TokenResponse,
  UpdateUserByResetTokenRequest,
} from '@agenda/proto/auth';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import * as bcrypt from 'bcrypt';
import { Redis } from 'ioredis';

import { EmailService } from './email/email.service';
import { Role } from './user';
import { UserAuthService } from './userAuth.service';

@Injectable()
export class AppService {
  constructor(
    private jwtService: JwtService,
    private userAuthService: UserAuthService,
    private emailService: EmailService,
    @InjectRedis() private redisService: Redis,
  ) {}

  async login(loginUser: LoginPayloadRequest): Promise<TokenResponse> {
    const userDb = await this.userAuthService.findByEmail(loginUser.login);

    if (!(loginUser.password && userDb?.password)) {
      throw new UnauthorizedException();
    }

    const isMatch = await bcrypt.compare(loginUser.password, userDb?.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    await this.userAuthService.clearResetToken(userDb.id);
    if (userDb.resetPasswordToken)
      await this.invalidateToken({ token: userDb.resetPasswordToken });

    const payload = { sub: userDb.id, email: userDb.email, role: userDb.role };
    return {
      token: await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      }),
    };
  }

  async invalidateToken(token: TokenRequest): Promise<BooleanResponse> {
    const decoded = this.jwtService.decode(token.token);
    const tokenExpiry = decoded.exp * 1000;

    const currentTime = Date.now();
    const ttl = tokenExpiry - currentTime;

    if (ttl > 0) {
      await this.redisService.set(token.token, 'blacklisted', 'PX', ttl);
      return { value: true };
    }
    return { value: true };
  }

  async isJwtTokenUpToDate(token: TokenRequest): Promise<BooleanResponse> {
    const decodedToken = this.jwtService.decode(token.token);
    if (decodedToken.role === Role.RESET_TOKEN) {
      return {
        value: true,
      };
    }

    const userDb = await this.userAuthService.findById(decodedToken.sub);

    return {
      value:
        decodedToken.sub === userDb.id &&
        decodedToken.email === userDb.email &&
        decodedToken.role === userDb.role,
    };
  }

  async forgotPassword(email: EmailRequest): Promise<BooleanResponse> {
    const user = await this.userAuthService.findByEmail(email.email);
    if (!user) {
      throw new NotFoundException(`No user found for email: ${email.email}`);
    }

    const emailValue = email.email;
    const payload = { email: emailValue, role: Role.RESET_TOKEN };

    const resetPasswordToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });

    user.resetPasswordToken = resetPasswordToken;

    await this.emailService.sendResetPasswordEmail(
      emailValue,
      resetPasswordToken,
    );

    await this.userAuthService.updateUserById({
      id: user.id,
      password: null,
      resetPasswordToken: resetPasswordToken,
    });

    return {
      value: true,
    };
  }

  async updateUserByResetToken(
    userCredential: UpdateUserByResetTokenRequest,
  ): Promise<BooleanResponse> {
    const user = await this.userAuthService.findByToken(userCredential.token);
    if (!user) {
      throw new UnauthorizedException('Invalid reset token.');
    }

    await this.userAuthService.updateUserById({
      id: user.id,
      password: userCredential.password,
      resetPasswordToken: null,
    });

    return this.invalidateToken({ token: userCredential.token });
  }
}
