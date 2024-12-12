import {
  AuthServiceClient,
  BooleanResponse,
  EmailRequest,
  LoginPayloadRequest,
  TokenRequest,
  TokenResponse,
  UpdateUserByResetTokenRequest,
} from '@agenda/proto/auth';
import { HttpException, Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService implements AuthServiceClient {
  private microserviceAuthService: AuthServiceClient;

  constructor(@Inject('AUTHPROTO_PACKAGE') private client: ClientGrpc) {
    this.microserviceAuthService =
      this.client.getService<AuthServiceClient>('AuthService');
  }

  login(request: LoginPayloadRequest): Observable<TokenResponse> {
    return this.microserviceAuthService.login(request);
  }

  invalidateToken(request: TokenRequest): Observable<BooleanResponse> {
    return this.microserviceAuthService.invalidateToken(request);
  }

  isJwtTokenUpToDate(request: TokenRequest): Observable<BooleanResponse> {
    return this.microserviceAuthService.isJwtTokenUpToDate(request);
  }

  forgotPassword(request: EmailRequest): Observable<BooleanResponse> {
    return this.microserviceAuthService.forgotPassword(request);
  }

  updateUserByResetToken(
    request: UpdateUserByResetTokenRequest,
  ): Observable<BooleanResponse> {
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[A-Za-z]).{8,}$/;

    if (!passwordRegex.test(request.password)) {
      throw new HttpException(
        'Password must contain at least 8 characters, 1 digit, 1 lowercase letter, and 1 uppercase letter',
        400,
      );
    }

    const hashedPassword = bcrypt.hashSync(request.password, 10);
    request.password = hashedPassword;

    return this.microserviceAuthService.updateUserByResetToken(request);
  }
}
