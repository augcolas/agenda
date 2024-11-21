import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'node:path';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTHPROTO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:3001',
          package: 'authproto',
          protoPath: join(
            __dirname,
            '../../node_modules/@agenda/proto/auth.proto',
          ),
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
