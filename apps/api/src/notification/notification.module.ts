import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
// eslint-disable-next-line unicorn/import-style
import { join } from 'node:path';
import { SocketModule } from 'src/alerts/alerts.module';

import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
    }),
    ClientsModule.register([
      {
        name: 'NOTIFICATIONPROTO_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: `${process.env.JOBRUNNER_MICROSERVICE_HOST}:${process.env.JOBRUNNER_MICROSERVICE_PORT}`,
          package: 'notificationproto',
          protoPath: join(
            __dirname,
            '../../node_modules/@agenda/proto/notification.proto',
          ),
        },
      },
    ]),
    SocketModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationService],
})
export class NotificationModule {}
