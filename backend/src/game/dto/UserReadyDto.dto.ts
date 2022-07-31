import { IsBoolean } from 'class-validator';

export class UserReadyDto {
  @IsBoolean()
  isReady: boolean;
}
