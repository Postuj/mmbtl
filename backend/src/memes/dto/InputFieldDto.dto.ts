import { IsNumber, Max, Min } from 'class-validator';

export class InputFieldDto {
  @IsNumber()
  @Min(0)
  @Max(4000)
  x: number;

  @IsNumber()
  @Min(0)
  @Max(4000)
  y: number;

  @IsNumber()
  @Min(0)
  @Max(4000)
  width: number;

  @IsNumber()
  @Min(0)
  @Max(4000)
  height: number;
}
