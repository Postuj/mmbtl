import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameNotFoundException } from 'src/exceptions/game.exception';
import { User, UserStatus } from 'src/users/entities/user.entity';
import { UserData } from 'src/users/interfaces/userData.interface';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Game, GameStatus } from './entities/game.entity';

@Injectable()
export class GameService {
  private readonly logger = new Logger(GameService.name);
  private activeGames: Game[];

  constructor(
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
    private readonly userService: UsersService,
  ) {
    this.activeGames = [];
  }

  // **---------------**
  // **  Game states  **
  // **---------------**

  public async createGame(userData: UserData) {
    await this.checkIfUserInGame(userData.id);

    this.logger.log('Creating game for user: ' + userData.email);
    const userObject = { id: userData.id, username: userData.username };
    const game = this.gameRepo.create({
      createdBy: userObject,
      lobby: [userObject],
    });

    const createdGame = await this.gameRepo.save(game);
    this.logger.log(`Created game ${game.id} for user: ${userData.email}`);

    await this.userService.handleUserJoinGame(userData.id, game.id);
    return createdGame;
  }

  public async startGame(userData: UserData, gameId: number) {
    const game = await this.canStartGame(userData.id, gameId);

    this.logger.log(`Game ${game.id} is starting`);
    game.status = GameStatus.RUNNING;
    game.players = game.lobby;

    const tasks: Promise<any>[] = [];
    tasks.push(this.gameRepo.save(game));
    game.players.forEach((player) =>
      tasks.push(
        this.userService.updateUserStatus(player.id, UserStatus.IN_GAME),
      ),
    );
    await Promise.all(tasks);
    return { success: true };
  }

  // **--------------**
  // ** User related **
  // **--------------**

  public async joinUserToGame(userData: UserData, gameId: number) {
    const game = await this.canUserJoinGame(userData.id, gameId);
    const user = new User();
    user.id = userData.id;
    game.lobby.push(user);
    await this.gameRepo.save(game);
    await this.userService.handleUserJoinGame(userData.id, game.id);
    return {
      success: true,
      game: {
        ...game,
        lobby: game.lobby.map((p) => p.toUserData()),
      },
    };
  }

  public async removeUserFromGame(userData: UserData) {
    const game = await this.userService.getUserCurrentGame(userData.id);
    if (!game) throw new ForbiddenException('You are not in game');
    await this.userService.handleUserLeaveGame(userData.id);

    if (game.status === GameStatus.WAITING) {
      await this.removeUserFromWaitingGame(userData.id, game.id);
      return { success: true };
    }

    if (game.status === GameStatus.RUNNING) {
      await this.removeUserFromRunningGame(userData.id, game);
      return { success: true };
    }
  }

  // ToDo: Move to game.repository.ts

  public async getGameById(
    gameId: number,
    options: { withPlayers?: boolean; withLobby?: boolean } = {
      withPlayers: false,
      withLobby: false,
    },
  ) {
    const game = await this.gameRepo.findOne({
      where: { id: gameId },
      relations: { players: options.withPlayers, lobby: options.withLobby },
    });
    if (!game) throw new GameNotFoundException();
    return game;
  }

  private async removeUserFromLobby(userId: number, gameId: number) {
    const game = await this.getGameById(gameId, { withLobby: true });
    game.lobby = game.lobby.filter((player) => player.id !== userId);
    await this.gameRepo.save(game);
    return game.lobby;
  }

  private async removeUserFromPlayers(userId: number, gameId: number) {
    const game = await this.getGameById(gameId, { withPlayers: true });
    game.players = game.players.filter((player) => player.id !== userId);
    await this.gameRepo.save(game);
    return game.players;
  }

  private async removeUserFromWaitingGame(userId: number, gameId: number) {
    this.logger.debug(`Removing user ${userId} from WAITING game ${gameId}`);
    const playersLeft = await this.removeUserFromLobby(userId, gameId);
    if (playersLeft.length > 0) return;
    await this.gameRepo.delete({ id: gameId });
    this.logger.log(`No more players in WAITING game: ${gameId}, DELETING`);
    return;
  }

  private async removeUserFromRunningGame(userId: number, game: Game) {
    this.logger.debug(`Removing user ${userId} from RUNNING game ${game.id}`);
    const playersLeft = await this.removeUserFromPlayers(userId, game.id);
    if (playersLeft.length === 1) {
      this.logger.log(
        `Not enough players in RUNNING game: ${game.id}, CANCELLING`,
      );
      game.status = GameStatus.CANCELED;
      await this.userService.handleUserLeaveGame(playersLeft[0].id);
      game.players = [];
      await this.gameRepo.save(game);
    }
  }

  private async checkIfUserInGame(userId: number) {
    const currentUserGame = await this.userService.getUserCurrentGame(userId);
    if (currentUserGame)
      throw new ForbiddenException(
        'You are already in game ' + currentUserGame.id,
      );
  }

  private async canUserJoinGame(userId: number, gameId: number) {
    await this.checkIfUserInGame(userId);
    // Get game to check if it exists
    const game = await this.getGameById(gameId, { withLobby: true });
    if (game.status !== GameStatus.WAITING)
      throw new ForbiddenException(
        'Unable to join game. Game status is not WAITING',
      );
    if (game.lobby.length > 12)
      throw new ForbiddenException('Game lobby is full');
    return game;
  }

  private async canStartGame(userId: number, gameId: number): Promise<Game> {
    const userGame = await this.userService.getUserCurrentGame(userId);
    if (!userGame) throw new ForbiddenException('You are not in game/lobby');

    const game = await this.getGameById(gameId, { withLobby: true });
    if (userGame.id !== gameId)
      throw new ForbiddenException('You are not in this game');
    if (game.status !== GameStatus.WAITING)
      throw new ForbiddenException(
        'Unable to start game. Game status is not WAITING',
      );
    if (game.lobby.length < 2)
      throw new ForbiddenException(
        'At least 2 players are required to start game',
      );
    return game;
  }
}
