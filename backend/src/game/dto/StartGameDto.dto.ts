import { IsNumber } from 'class-validator';

export class StartGameDto {
  @IsNumber()
  gameId: number;
}
