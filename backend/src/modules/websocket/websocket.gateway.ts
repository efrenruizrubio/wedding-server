import { SocketEvents } from '@constants/socket-events';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { UserRole } from '@type/enums';
import { Socket, Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
    allowedHeaders: ['Authorization'],
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  private readonly clients: Map<string, Socket> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  socket: Socket;

  handleConnection(client: Socket) {
    const { token } = client.handshake.auth;

    const decoded = this.jwtService.decode(token);

    if (!decoded) {
      client.disconnect();
      return;
    }

    const { sub, role } = decoded;
    const clientId = sub.toString();

    if (role === UserRole.ADMIN) {
      this.clients.set(`${role}-${client.id.toString()}`, client);
    } else {
      this.clients.set(clientId, client);
    }
  }

  handleDisconnect(client: any) {
    this.clients.forEach((socket, userId) => {
      if (socket.id === client.id) {
        this.clients.delete(userId);
      }
    });
  }

  @SubscribeMessage(SocketEvents.APPLICATION_APPROVED)
  notifyUserApplicationApproval(userId: number) {
    const client = this.clients.get(userId.toString());

    if (client) {
      client.emit(SocketEvents.APPLICATION_APPROVED);
    }
  }

  @SubscribeMessage(SocketEvents.APPLICATION_REJECTED)
  notifyUserApplicationRejection(userId: number) {
    const client = this.clients.get(userId.toString());

    if (client) {
      client.emit(SocketEvents.APPLICATION_REJECTED);
    }
  }

  @SubscribeMessage(SocketEvents.APPLICATION_UPDATED)
  notifyAdminApplicationUpdated(id) {
    this.clients.forEach((client, userId) => {
      const [role] = userId.split('-');

      if (role === UserRole.ADMIN) {
        client.emit(SocketEvents.APPLICATION_UPDATED, id);
      }
    });
  }
}
