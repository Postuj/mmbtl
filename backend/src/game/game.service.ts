import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserData } from 'src/users/interfaces/userData.interface';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
  ) {}

  public async createGame(userData: UserData) {
    const user = { id: userData.id, username: userData.username };
    const game = this.gameRepo.create({
      createdBy: user,
      players: [user],
    });
    const createdGame = await this.gameRepo.save(game);
    return createdGame;
  }

  public findGameById(gameId: number) {
    return this.gameRepo.findOneBy({ id: gameId });
  }
}
