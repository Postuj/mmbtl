import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';
import { GameModule } from './game/game.module';
import { Game } from './game/entities/game.entity';
import { MemesModule } from './memes/memes.module';
import { MemeTemplate } from './memes/entities/memeTemplate.entity';
import { InputField } from './memes/entities/inputField.entity';
import { Meme } from './memes/entities/meme.entity';
import { GameRound } from './game/entities/gameRound.entity';
import { CoreModule } from 'core.module';
import { Grade } from './memes/entities/grade.entity';
import { Player } from './game/entities/player.entity';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    GameModule,
    MemesModule,
    DbModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoreModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
