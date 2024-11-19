import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
// eslint-disable-next-line unicorn/import-style
import { join } from 'node:path';

import { NotificationController } from './notification.controller';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'NOTIFICATIONPROTO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:3004',
          package: 'notificationproto',
          protoPath: join(
            __dirname,
            '../../node_modules/@agenda/proto/notification.proto',
          ),
        },
      },
    ]),
  ],
  controllers: [NotificationController],
})
export class NotificationModule {}
