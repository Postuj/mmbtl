import { IsNumber, Max, Min } from 'class-validator';

export class SubmitMemeGradeDto {
  @IsNumber()
  @Min(1)
  memeId: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  score: number;
}
