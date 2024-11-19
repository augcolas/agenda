import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { GrpcErrorInterceptor } from './interceptor/grpc-error.interceptor';

/**
 *
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*', // Allow requests from all origins; replace with specific origins if needed
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    allowedHeaders: 'Content-Type, Accept, Authorization', // Allowed headers
    credentials: false, // Include cookies or credentials in requests if needed
  });

  // Global Validation and Interceptors
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new GrpcErrorInterceptor());

  // Start the application
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap()
  .then(() => console.log('API started'))
  .catch(console.error);
