import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Namespace, Server } from 'socket.io';
import { AuthorizedSocket } from 'src/auth/types';
import { WsExceptionFilter } from 'src/exceptions/ws-exception.filter';
import { CreateGameDto } from './dto/CreateGameDto.dto';
import { JoinGameDto } from './dto/JoinGameDto.dto';
import { LeaveGameDto } from './dto/LeaveGameDto.dto';
import { StartGameDto } from './dto/StartGameDto.dto';
import { GameService } from './game.service';

@UsePipes(new ValidationPipe())
@UseFilters(new WsExceptionFilter())
@WebSocketGateway({
  namespace: 'game',
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(GameGateway.name);
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer() io: Namespace;

  afterInit(server: Server) {
    this.logger.log('Socket initialized');
  }

  handleConnection(client: AuthorizedSocket, ...args: any[]): void {
    this.logger.log(`Client ${client.user.email} connected`);
  }

  handleDisconnect(client: AuthorizedSocket) {
    this.logger.log(`Client ${client.user.email} disconnected`);
  }

  @SubscribeMessage('createGame')
  async createGame(client: AuthorizedSocket, payload: CreateGameDto) {
    const game = await this.gameService.createGame(client.user);
    const roomName = 'game:' + game.id;
    client.join(roomName);
    client.emit('gameCreated', { success: true, game });
  }

  @SubscribeMessage('joinGame')
  async joinGame(client: AuthorizedSocket, payload: JoinGameDto) {
    const result = await this.gameService.joinUserToGame(
      client.user,
      payload.gameId,
    );
    client.emit('gameJoined', result);
  }

  @SubscribeMessage('leaveGame')
  async leaveGame(client: AuthorizedSocket, payload: LeaveGameDto) {
    const result = await this.gameService.removeUserFromGame(client.user);
    client.emit('gameLeft', result);
  }

  @SubscribeMessage('startGame')
  async startGame(client: AuthorizedSocket, payload: StartGameDto) {
    const result = await this.gameService.startGame(
      client.user,
      payload.gameId,
    );
    client.emit('gameStarted', result);
  }

  @SubscribeMessage('submitMeme')
  handleMessage(client: any, payload: any): WsResponse<string> {
    return { event: 'memeSubmitted', data: 'hello world' };
  }
}
