import {Controller, Get, Inject, OnModuleInit} from '@nestjs/common';
import {ClientGrpc} from "@nestjs/microservices";
import {Observable} from "rxjs";

interface AuthService {
  login(login: string, password: string): Observable<string>;
}

@Controller('auth')
export class AuthController  implements OnModuleInit {
  private authService: AuthService;

  constructor(@Inject('AUTHPROTO_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.authService = this.client.getService<AuthService>('AuthService');
  }

  @Get()
  async getProtoUsers() {
    return this.authService.login('login', 'pwd');
  }
}
