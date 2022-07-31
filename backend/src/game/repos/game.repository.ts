import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GameNotFoundException } from 'src/exceptions/game.exception';
import { User } from 'src/users/entities/user.entity';
import { UserData } from 'src/users/interfaces/userData.interface';
import { Repository } from 'typeorm';
import { Game, GameStatus } from '../entities/game.entity';
import { GameRound } from '../entities/gameRound.entity';
import { PlayerRepository } from './player.repository';

@Injectable()
export class GameRepository {
  private readonly logger = new Logger(GameRepository.name);
  constructor(
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
    private readonly playerRepo: PlayerRepository,
  ) {}

  public async getOneById(
    gameId: number,
    options: {
      withPlayers?: boolean;
      withLobby?: boolean;
      withRounds?: boolean;
    } = {
      withPlayers: false,
      withLobby: false,
      withRounds: false,
    },
  ) {
    const game = await this.gameRepo.findOne({
      where: { id: gameId },
      relations: {
        players: options.withPlayers,
        lobby: options.withLobby,
        rounds: options.withRounds,
      },
    });
    if (!game) throw new GameNotFoundException();
    return game;
  }

  public save(game: Game) {
    return this.gameRepo.save(game);
  }

  public create(user: UserData) {
    const game = this.gameRepo.create({
      createdBy: user,
      lobby: [],
    });
    return this.save(game);
  }

  public cancel(game: Game) {
    game.status = GameStatus.CANCELED;
    game.players = [];
    return this.save(game);
  }

  public async delete(gameId: number) {
    try {
      await this.gameRepo.delete({ id: gameId });
      this.logger.log(`[Game ${gameId}] Game has been DELETED`);
    } catch (error) {
      console.error(error);
      this.logger.error(`[Game ${gameId}] Encountered an error while deleting`);
    }
  }

  public start(game: Game, firstRound: GameRound) {
    game.status = GameStatus.RUNNING;
    game.players = game.lobby;
    game.rounds = [firstRound];
    return this.save(game);
  }

  public finish(game: Game, winnerId?: number) {
    game.players = [];
    game.finishedAt = new Date();
    game.status = GameStatus.FINISHED;
    if (winnerId) {
      const winner = new User();
      winner.id = winnerId;
      game.winner = winner;
    }
    return this.save(game);
  }

  public async removePlayerFromLobby(userId: number, gameId: number) {
    const game = await this.getOneById(gameId, { withLobby: true });
    const player = game.lobby.find((p) => p.userId === userId);
    if (!player) throw new NotFoundException('Player not found');

    game.lobby = game.lobby.filter((p) => p.userId !== userId);
    await this.playerRepo.delete(player.id);

    return game.lobby;
  }

  public async removePlayerFromPlayers(userId: number, gameId: number) {
    const game = await this.getOneById(gameId, { withPlayers: true });
    game.players = game.players.filter((p) => p.userId !== userId);
    await this.save(game);
    return game.players;
  }
}
