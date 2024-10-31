import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
// import JobRunner as '../../jobrunner/src/main';

/**
 *
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap()
  .then(() => console.log('API started'))
  .catch(console.error);
