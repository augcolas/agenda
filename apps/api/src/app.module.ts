import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SocketModule } from './alerts/alerts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../../.env',
    }),
    SocketModule,
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number.parseInt(process.env.POSTGRES_PORT),
      password: process.env.POSTGRES_PASSWORD,
      username: process.env.POSTGRES_USER,
      autoLoadEntities: true, // typeorm loads entities from this directory
      database: process.env.POSTGRES_DATABASE,
      synchronize: true,
      logging: true,
    }),
    UserModule,
    EventModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
