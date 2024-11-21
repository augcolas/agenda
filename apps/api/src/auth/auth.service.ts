import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

interface MicroserviceAuthService {
  login(data: { login: string; password: string }): Observable<string>;

  invalidateToken(data: { token: string }): Observable<void>;

  isJwtTokenUpToDate(data: { token: string }): Observable<{ value: boolean }>;
}

@Injectable()
export class AuthService {
  private microserviceAuthService: MicroserviceAuthService;

  constructor(@Inject('AUTHPROTO_PACKAGE') private client: ClientGrpc) {
    this.microserviceAuthService =
      this.client.getService<MicroserviceAuthService>('AuthService');
  }

  login(login: string, password: string): Observable<string> {
    return this.microserviceAuthService.login({ login, password });
  }

  invalidateToken(token: string): Observable<void> {
    return this.microserviceAuthService.invalidateToken({ token });
  }

  isJwtTokenUpToDate(token: string): Observable<{ value: boolean }> {
    return this.microserviceAuthService.isJwtTokenUpToDate({ token });
  }
}
