import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './entities/game.entity';
import { GameGateway } from './game.gateway';
import { UsersModule } from 'src/users/users.module';
import { GameRound } from './entities/gameRound.entity';
import { MemesModule } from 'src/memes/memes.module';
import { RoundService } from './round.service';
import { GameRepository } from './repos/game.repository';
import { PlayerRepository } from './repos/player.repository';
import { Player } from './entities/player.entity';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [
    DbModule,
    UsersModule,
    MemesModule,
    TypeOrmModule.forFeature([Game, GameRound, Player]),
  ],
  controllers: [GameController],
  providers: [GameRepository, PlayerRepository, GameService, RoundService, GameGateway],
})
export class GameModule {}
