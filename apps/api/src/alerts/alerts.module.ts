import { Module } from '@nestjs/common';

import { SocketEvents } from './alerts.gateway';

@Module({
  providers: [SocketEvents],
})
export class SocketModule {}
