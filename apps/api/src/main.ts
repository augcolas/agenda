import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';

import {AppModule} from './app.module';
import {GrpcErrorInterceptor} from './interceptor/grpc-error.interceptor';

/**
 *
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new GrpcErrorInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() => console.log('API started'))
  .catch(console.error);
