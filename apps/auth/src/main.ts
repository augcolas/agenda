import {NestFactory} from '@nestjs/core';
import {type MicroserviceOptions, Transport} from '@nestjs/microservices';
import {join} from 'node:path';

import {AppModule} from './app.module';
import {RpcExceptionsInterceptor} from './interceptor/rpc.exceptions.interceptor';

/**
 *
 */
async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'authproto',
        protoPath: join(__dirname, '../node_modules/@agenda/proto/auth.proto'),
        url: '0.0.0.0:3001',
      },
    },
  );
  app.useGlobalInterceptors(new RpcExceptionsInterceptor());
  await app.listen();
}

void bootstrap();
