import { Module } from '@nestjs/common';
import { MemesService } from './memes.service';
import { MemesController } from './memes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemeTemplate } from './entities/memeTemplate.entity';
import { Meme } from './entities/meme.entity';
import { InputField } from './entities/inputField.entity';
import { Grade } from './entities/grade.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MemeTemplate, Meme, InputField, Grade])],
  controllers: [MemesController],
  providers: [MemesService],
  exports: [MemesService],
})
export class MemesModule {}
