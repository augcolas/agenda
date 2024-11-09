import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { type MicroserviceOptions, Transport } from '@nestjs/microservices';
// eslint-disable-next-line unicorn/import-style
import { join } from 'node:path';

import { AppModule } from './app.module';

/**
 *
 */

/**
 *
 */
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'notificationproto',
        // eslint-disable-next-line unicorn/prefer-module
        protoPath: join(
          __dirname,
          '../node_modules/@agenda/proto/notification.proto',
        ),
        url: '0.0.0.0:3004',
      },
    },
  );

  Logger.log(`Server running on 0.0.0.0:3004`);

  await app.listen();
}
void bootstrap();
