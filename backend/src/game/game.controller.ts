import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { GetUser } from 'src/users/decorators/user.decorator';
import { UserData } from 'src/users/interfaces/userData.interface';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @HttpCode(HttpStatus.OK)
  @Post('')
  createGame(@GetUser() userData: UserData) {
    return this.gameService.createGame(userData);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':gameId')
  getGame(@Param('gameId') gameId) {
    return this.gameService.getGameById(gameId);
  }
}
