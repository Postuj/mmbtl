import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Server } from 'socket.io';
import { AuthorizedSocket } from 'src/auth/types';
import { WsExceptionFilter } from 'src/exceptions/ws-exception.filter';
import { CreateGameDto } from './dto/CreateGameDto.dto';
import { JoinGameDto } from './dto/JoinGameDto.dto';
import { LeaveGameDto } from './dto/LeaveGameDto.dto';
import { StartGameDto } from './dto/StartGameDto.dto';
import { SubmitMemeDto } from './dto/SubmitMemeDto.dto';
import { SubmitMemeGradeDto } from './dto/SubmitMemeGradeDto.dto';
import { UserReadyDto } from './dto/UserReadyDto.dto';
import { Game } from './entities/game.entity';
import { GameService } from './game.service';
import { RoundService } from './round.service';

@UsePipes(new ValidationPipe())
@UseFilters(new WsExceptionFilter())
@WebSocketGateway({
  namespace: 'game',
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(GameGateway.name);
  private readonly gameRoomPrefix = 'game:';
  constructor(
    private readonly gameService: GameService,
    private readonly roundService: RoundService,
  ) {}

  @WebSocketServer() io: Namespace;

  afterInit(server: Server) {
    this.logger.log('Socket initialized');
  }

  handleConnection(client: AuthorizedSocket, ...args: any[]): void {
    this.logger.log(`Client ${client.user.email} connected`);
    this.handleUserConnect(client);
  }

  handleDisconnect(client: AuthorizedSocket) {
    this.logger.log(`Client ${client.user.email} disconnected`);
    this.handleUserDisconnect(client);
  }

  @SubscribeMessage('createGame')
  async createGame(client: AuthorizedSocket, payload: CreateGameDto) {
    const game = await this.gameService.createGame(client.user);
    const roomName = this.gameRoomPrefix + game.id;
    client.join(roomName);
    this.io.to(roomName).emit('gameCreated', game);
  }

  @SubscribeMessage('joinGame')
  async joinGame(client: AuthorizedSocket, payload: JoinGameDto) {
    const game = await this.gameService.joinUserToGame(
      client.user,
      payload.gameId,
    );
    const roomName = this.gameRoomPrefix + game.id;
    this.io.to(roomName).emit('userJoinedGame', client.user);
    client.join(roomName);
    client.emit('gameJoined', game);
  }

  @SubscribeMessage('leaveGame')
  async leaveGame(client: AuthorizedSocket, payload: LeaveGameDto) {
    const game = await this.gameService.removeUserFromGame(client.user);
    const roomName = this.gameRoomPrefix + game.id;
    client.leave(roomName);
    client.emit('gameLeft', { success: true });
    this.io.to(roomName).emit('userLeftGame', client.user);
  }

  @SubscribeMessage('userReady')
  async handleUserReady(client: AuthorizedSocket, payload: UserReadyDto) {
    const game = await this.gameService.handleUserReady(client.user, payload);
    const roomName = this.gameRoomPrefix + game.id;
    this.io.to(roomName).emit('userReadyChanged', {
      userId: client.user.id,
      isReady: payload.isReady,
    });
  }

  @SubscribeMessage('startGame')
  async startGame(client: AuthorizedSocket, payload: StartGameDto) {
    const result = await this.gameService.startGame(client.user);
    const roomName = this.gameRoomPrefix + result.game.id;
    this.io.to(roomName).emit('gameStarted', {});
    this.io.to(roomName).emit('roundStarted', result.round);
  }

  @SubscribeMessage('submitMeme')
  async handleMemeSubmit(client: AuthorizedSocket, payload: SubmitMemeDto) {
    const result = await this.roundService.handleMemeSubmit(
      client.user,
      payload,
    );
    client.emit('memeSubmitted', { success: true });
    if (result.memes) {
      const roomName = this.gameRoomPrefix + result.gameId;
      this.io.to(roomName).emit('roundGrading', { memes: result.memes });
    }
  }

  @SubscribeMessage('submitMemeGrade')
  async handleMessage(client: AuthorizedSocket, payload: SubmitMemeGradeDto) {
    console.log('Controller 1');
    const result = await this.roundService.handleMemeGradeSubmit(
      client.user,
      payload,
    );
    console.log('Controller 2');
    client.emit('memeGradeSubmitted', { success: true });
    if (result.game) {
      console.log('Controller 3');
      const roomName = this.gameRoomPrefix + result.game.id;
      this.io.to(roomName).emit('roundResults', result.roundResults);
    } else return;
    console.log('Controller 4');
    if (result.finished) setTimeout(() => this.finishGame(result.game), 5000);
    else setTimeout(() => this.nextRound(result.game), 5000);
  }

  private async handleUserConnect(client: AuthorizedSocket) {
    const game = await this.gameService.handleUserConnect(client.user.id);
    if (!game) return;
    const roomName = this.gameRoomPrefix + game.id;
    client.join(roomName);
  }

  private async handleUserDisconnect(client: AuthorizedSocket) {
    const game = await this.gameService.handleUserDisconnect(client.user.id);
    if (!game) return;
    const roomName = this.gameRoomPrefix + game.id;
    this.io.to(roomName).emit('userLeftGame', client.user);
  }

  private async finishGame(game: Game) {
    const gameResults = await this.gameService.finishGame(game);
    const roomName = this.gameRoomPrefix + game.id;
    this.io.to(roomName).emit('gameFinished', gameResults);
  }

  private async nextRound(game: Game) {
    const round = await this.roundService.nextRound(game);
    const roomName = this.gameRoomPrefix + game.id;
    this.io.to(roomName).emit('roundStarted', round);
  }
}
