import { ValidationPipe } from '@nestjs/common';
import { type CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

/**
 *
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Active la validation globale des pipes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const corsOptions: CorsOptions = {
    origin: '*', // Autorise toutes les origines
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true,
  };

  app.enableCors(corsOptions);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() => console.log('API started'))
  .catch(console.error);
