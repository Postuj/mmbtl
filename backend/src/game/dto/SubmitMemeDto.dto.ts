import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

export class SubmitMemeDto {
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(12)
  @IsString({ each: true })
  values: string[];

  @IsNumber()
  @Min(1)
  templateId: number;
}
