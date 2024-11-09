import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

/**
 *
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  Logger.log(`Server running on http://localhost:${process.env.PORT ?? 3000}`);
}
bootstrap()
  .then(() => console.log('API started'))
  .catch(console.error);
