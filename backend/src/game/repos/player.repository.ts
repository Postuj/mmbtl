import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserStatus } from 'src/users/entities/user.entity';
import { UserData } from 'src/users/interfaces/userData.interface';
import { Repository } from 'typeorm';
import { Game } from '../entities/game.entity';
import { Player } from '../entities/player.entity';

@Injectable()
export class PlayerRepository {
  private readonly logger = new Logger(PlayerRepository.name);
  constructor(
    @InjectRepository(Player) private readonly playerRepo: Repository<Player>,
  ) {}

  public getPlayerByUserId(userId: number, gameId: number) {
    return this.playerRepo.findOne({
      where: { user: { id: userId }, lobby: { id: gameId } },
    });
  }

  public updatePlayerIsReady(playerId: number, isReady: boolean) {
    return this.playerRepo.update({ id: playerId }, { isReady });
  }

  public create(user: UserData, game: Game) {
    const player = this.playerRepo.create({
      lobby: game,
      user: { ...user, status: UserStatus.IN_LOBBY, currentGameId: game.id },
    });
    return this.playerRepo.save(player);
  }

  public createWithoutGame(user: UserData) {
    const player = this.playerRepo.create({ user });
    return player;
  }

  public delete(playerId: number) {
    return this.playerRepo.delete({ id: playerId });
  }

  public addPlayerScore(playerId: number, score: number) {
    this.logger.debug(`Incrementing player ${playerId} score by ${score}`);
    return this.playerRepo.increment({ id: playerId }, 'score', score);
  }
}
