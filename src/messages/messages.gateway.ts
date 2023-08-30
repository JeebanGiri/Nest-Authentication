import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnModuleInit } from '@nestjs/common';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway()
export class MessagesGateway implements OnModuleInit {
  constructor(
    // private messagesService: MessagesService,
    private jwtStrategy: JwtStrategy,
    private usersService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', async (socket) => {
      try {
        console.log(socket.id);
        console.log('connected');

        const users = this.jwtStrategy;
        if (!users) {
          socket.disconnect();
        } else {
          const userData = await this.usersService.findOne({ id: users['id'] });
          const { password, ...remainingData } = userData;
          socket.data = { ...remainingData };

        }
      } catch (e) {
        console.log(e, 'error');
        return socket.disconnect();
      }
    });
  }

  @SubscribeMessage('send_message')
  listenForMessages(@MessageBody() data: string) {
    this.server.sockets.emit('receive_message', data);
  }
}
