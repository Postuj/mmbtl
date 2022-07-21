import { IsNumber } from 'class-validator';

export class JoinGameDto {
  @IsNumber()
  gameId: number;
}
