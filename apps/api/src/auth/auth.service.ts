import {
  AuthServiceClient,
  BooleanResponse,
  LoginPayloadRequest,
  TokenRequest,
  TokenResponse,
} from '@agenda/proto/auth';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
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
}
