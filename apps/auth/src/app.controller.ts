import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

@Controller('protoauth')
export class AppController {
  @GrpcMethod('AuthService', 'login')
  login(): { token: string } {
    console.log('test');
    return { token: 'ferz' };
  }
}
