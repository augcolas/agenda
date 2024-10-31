import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
// eslint-disable-next-line unicorn/import-style
import { join } from 'node:path';

import { AuthController } from './auth.controller';

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
})
export class AuthModule {}
