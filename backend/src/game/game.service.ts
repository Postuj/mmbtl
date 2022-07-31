import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { FunctionQuery } from 'src/db/queries';
import { User, UserStatus } from 'src/users/entities/user.entity';
import { UserData } from 'src/users/interfaces/userData.interface';
import { UsersService } from 'src/users/users.service';
import { UserReadyDto } from './dto/UserReadyDto.dto';
import { Game, GameStatus } from './entities/game.entity';
import { GameRepository } from './repos/game.repository';
import { PlayerRepository } from './repos/player.repository';
import { RoundService } from './round.service';
import { PlayerResult } from './types';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);

  constructor(
    private readonly gameRepo: GameRepository,
    private readonly playerRepo: PlayerRepository,
    private readonly userService: UsersService,
    private readonly roundService: RoundService,
    private readonly dbService: DbService,
  ) {}

  public async getGameById(gameId: number) {
    return this.gameRepo.getOneById(gameId);
  }

  // **---------------**
  // **  Game states  **
  // **---------------**

  public async createGame(user: UserData) {
    await this.checkIfUserInGame(user.id);

    this.logger.log('Creating game for user: ' + user.email);
    const game = await this.gameRepo.create(user);
    this.logger.log(`[Game ${game.id}] Created for user: ${user.email}`);

    return await this.joinUserToGame(user, game.id);
  }

  public async startGame(userData: UserData) {
    const game = await this.canUserStartGame(userData.id);

    this.logger.log(`[Game ${game.id}] Starting`);
    const round = await this.roundService.createRound(game.id, 1);

    await Promise.all([
      this.gameRepo.start(game, round),
      this.userService.updateUsersInGameStatus(game.id, UserStatus.IN_GAME),
    ]);
    return { game, round };
  }

  public async finishGame(game: Game) {
    this.logger.log(`[Game ${game.id}] Finishing`);
    const gameResults = await this.getGameResults(game);
    const firstPlayer = gameResults[gameResults.length - 1];
    const secondPlayer = gameResults[gameResults.length - 2];
    const winnerId =
      firstPlayer.score > secondPlayer.score ? firstPlayer.userId : null;

    await Promise.all([
      this.gameRepo.finish(game, winnerId),
      this.userService.removePlayersFromGame(game.id),
    ]);

    return gameResults;
  }

  // **--------------**
  // ** User related **
  // **--------------**

  public async joinUserToGame(user: UserData, gameId: number) {
    const game = await this.canUserJoinGame(user.id, gameId);
    this.logger.debug(`[Game ${gameId}] User ${user.email} is joining`);

    const player = await this.playerRepo.create(user, game);
    game.lobby.push(player);
    await this.userService.handleUserJoinGame(user.id, game.id);
    const lobby = game.lobby.map((p) => p.user?.toUserData() ?? { ...p.user });

    this.logger.debug(`[Game ${gameId}] User ${user.email} has joined`);
    return { ...game, lobby };
  }

  public async removeUserFromGame(user: UserData) {
    const game = await this.userService.getUserCurrentGame(user.id);
    if (!game) throw new ForbiddenException('You are not in game');
    await this.userService.handleUserLeaveGame(user.id);

    if (game.status === GameStatus.WAITING) {
      await this.removePlayerFromLobby(user.id, game.id);
      return game;
    }

    if (game.status === GameStatus.RUNNING) {
      await this.removePlayerFromGame(user.id, game);
      return game;
    }
  }

  public async handleUserConnect(userId: number) {
    const game = await this.userService.getUserCurrentGame(userId);
    if (game)
      this.logger.debug(`[Game ${game.id}] User ${userId} got back to game`);
    return game;
  }

  public async handleUserDisconnect(userId: number) {
    const game = await this.userService.getUserCurrentGame(userId);
    if (!game) return null;
    this.logger.debug(`[Game ${game.id}] User ${userId} disconnected`);

    if (game.status === GameStatus.RUNNING)
      await this.removePlayerFromGame(userId, game);
    else if (game.status === GameStatus.WAITING)
      await Promise.all([
        this.removePlayerFromLobby(userId, game.id),
        this.userService.handleUserLeaveGame(userId),
      ]);

    return game;
  }

  public async handleUserReady(user: UserData, userReadyDto: UserReadyDto) {
    const { game, player } = await this.canUserUpdateIsReady(user.id);
    this.logger.debug(
      `[Game ${game.id}] User ${user.email} is now ${
        userReadyDto.isReady ? 'READY' : 'NOT READY'
      }]`,
    );
    await this.playerRepo.updatePlayerIsReady(player.id, userReadyDto.isReady);

    return game;
  }

  private async removePlayerFromLobby(userId: number, gameId: number) {
    this.logger.debug(`[Game ${gameId}] Removing user ${userId} from lobby`);
    const playersLeft = await this.gameRepo.removePlayerFromLobby(
      userId,
      gameId,
    );
    if (playersLeft.length > 0) return;
    this.logger.log(`[Game ${gameId}] No more players in lobby, DELETING`);

    // Postgres was thinking that user was still refrencing this game, even that he wasn't
    setTimeout(() => {
      this.gameRepo.delete(gameId);
    }, 50);
  }

  private async removePlayerFromGame(userId: number, game: Game) {
    this.logger.debug(`[Game ${game.id}] Removing user ${userId} from game`);
    const playersLeft = await this.gameRepo.removePlayerFromPlayers(
      userId,
      game.id,
    );
    if (playersLeft.length > 1) return;

    this.logger.log(`[Game ${game.id}] Not enough players in game, CANCELLING`);
    await this.userService.removePlayersFromGame(game.id);
    await this.gameRepo.cancel(game);
    this.logger.log(`[Game ${game.id}] Game has been CANCELLED`);
  }

  private async checkIfUserInGame(userId: number) {
    const isUserInGame = await this.userService.checkIfUserInGame(userId);
    if (isUserInGame)
      throw new ForbiddenException('You are already in game/lobby');
  }

  private async canUserJoinGame(userId: number, gameId: number) {
    await this.checkIfUserInGame(userId);
    // Get game to check if it exists
    const game = await this.gameRepo.getOneById(gameId, { withLobby: true });
    if (game.status !== GameStatus.WAITING)
      throw new ForbiddenException(
        'Unable to join game. Game status is not WAITING',
      );
    if (game.lobby.length > 12)
      throw new ForbiddenException('Game lobby is full');
    return game;
  }

  private async canUserStartGame(userId: number) {
    const user = await this.userService.findOneById(userId);
    if (!user.currentGameId)
      throw new ForbiddenException('You are not in game/lobby');
    const game = await this.gameRepo.getOneById(user.currentGameId, {
      withLobby: true,
    });
    if (game.status !== GameStatus.WAITING)
      throw new ForbiddenException(
        'Unable to start game. Game status is not lobby',
      );
    if (game.lobby.length < 2)
      throw new ForbiddenException(
        'At least 2 players are required to start game',
      );
    for (let i = 0; i < game.lobby.length; i++)
      if (!game.lobby[i].isReady)
        throw new ForbiddenException('Everyone must be ready');

    return game;
  }

  private async canUserUpdateIsReady(userId: number) {
    const game = await this.userService.getUserCurrentGame(userId);
    if (!game || game.status !== GameStatus.WAITING)
      throw new ForbiddenException('You are not in game/lobby');
    const player = await this.playerRepo.getPlayerByUserId(userId, game.id);
    if (!player) throw new NotFoundException('Player not found');

    return { game, player };
  }

  private async getGameResults(game: Game) {
    const results: PlayerResult[] = await this.dbService.excecuteQuery(
      FunctionQuery.GET_GAME_RESULTS,
      game.id,
    );
    return results;
  }
}
