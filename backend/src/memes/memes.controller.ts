import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { GetUser } from 'src/users/decorators/user.decorator';
import { UserData } from 'src/users/interfaces/userData.interface';
import { CreateMemeTemplateDto } from './dto/CreateMemeTemplateDto';
import { MemesService } from './memes.service';

@Controller('memes')
export class MemesController {
  constructor(private readonly memesService: MemesService) {}

  @Post('templates')
  @HttpCode(HttpStatus.CREATED)
  createMemeTemplate(
    @Body() createMemeTemplateDto: CreateMemeTemplateDto,
    @GetUser() userData: UserData,
  ) {
    return this.memesService.createMemeTemplate(
      createMemeTemplateDto,
      userData,
    );
  }

  @Get('templates/:memeId')
  @HttpCode(HttpStatus.OK)
  getMemeTemplate(@Param('memeId') memeId: number) {
    return this.memesService.getMemeTemplateById(memeId);
  }
}
