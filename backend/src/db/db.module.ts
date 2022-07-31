import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/game/entities/game.entity';
import { GameRound } from 'src/game/entities/gameRound.entity';
import { Player } from 'src/game/entities/player.entity';
import { Grade } from 'src/memes/entities/grade.entity';
import { InputField } from 'src/memes/entities/inputField.entity';
import { Meme } from 'src/memes/entities/meme.entity';
import { MemeTemplate } from 'src/memes/entities/memeTemplate.entity';
import { User } from 'src/users/entities/user.entity';
import { DbService } from './db.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'mmbtl',
      entities: [
        User,
        Game,
        GameRound,
        MemeTemplate,
        InputField,
        Meme,
        Grade,
        Player,
      ],
      synchronize: true,
    }),
  ],
  providers: [DbService],
  exports: [DbService],
})
export class DbModule {}
