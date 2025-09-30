import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  sendMetric(metric: any) {
    this.server.emit('metric', metric);
  }

  sendDeviceStatus(device: any) {
    this.server.emit('deviceStatus', device);
  }

  sendAlert(alert: any) {
    this.server.emit('alert', alert);
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() data: any): string {
    return 'pong';
  }
}
