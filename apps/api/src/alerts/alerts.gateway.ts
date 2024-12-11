import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SocketEvents {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`client connected: ${client.id}`);
  }

  async handleDisconnect(client: Socket) {
    try {
      await Promise.all(
        Array.from(client.rooms).map(async (room) => {
          try {
            await client.leave(room);
          } catch (error) {
            console.error(`Failed to leave room ${String(room)}:`, error);
          }
        }),
      );
    } catch (error) {
      console.error(`Error during disconnect handling:`, error);
    }
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() roomId: string,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      await client.join(roomId);
    } catch (error) {
      console.error(`Failed to join room ${roomId}:`, error);
    }
  }

  @SubscribeMessage('alert')
  handleEvent(@ConnectedSocket() client: Socket) {
    const roomId = client.id;
    this.server.to(roomId).emit('alert', {
      from: client.id,
      message: 'Alerte type à modifier !',
    });

    console.log(`Alert sent`);
  }

  sendNotification(userId: number, message: string) {
    this.server.to(`user-${userId}`).emit('notification', message);
  }
}
