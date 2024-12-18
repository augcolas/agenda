import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'node:path';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
    }),
    ClientsModule.register([
      {
        name: 'AUTHPROTO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: `${process.env.AUTH_MICROSERVICE_HOST}:${process.env.AUTH_MICROSERVICE_PORT}`,
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
