import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubmitMemeDto } from 'src/game/dto/SubmitMemeDto.dto';
import { GameRound } from 'src/game/entities/gameRound.entity';
import { UserData } from 'src/users/interfaces/userData.interface';
import { In, Not, Repository } from 'typeorm';
import { CreateMemeTemplateDto } from './dto/CreateMemeTemplateDto';
import { Grade } from './entities/grade.entity';
import { InputField } from './entities/inputField.entity';
import { Meme } from './entities/meme.entity';
import { MemeTemplate } from './entities/memeTemplate.entity';

@Injectable()
export class MemesService {
  private readonly logger = new Logger(MemesService.name);
  constructor(
    @InjectRepository(Meme) private readonly memeRepo: Repository<Meme>,
    @InjectRepository(MemeTemplate)
    private readonly memeTemplateRepo: Repository<MemeTemplate>,
    @InjectRepository(InputField)
    private readonly inputFieldRepo: Repository<InputField>,
    @InjectRepository(Grade) private readonly gradeRepo: Repository<Grade>,
  ) {}

  public async createMemeTemplate(
    createMemeTemplateDto: CreateMemeTemplateDto,
    userData: UserData,
  ) {
    const fields = createMemeTemplateDto.fields.map((f) =>
      this.inputFieldRepo.create({
        ...f,
      }),
    );
    const memeTemplate = this.memeTemplateRepo.create({
      createdBy: userData,
      name: createMemeTemplateDto.name,
      imagePath: 'memes/' + createMemeTemplateDto.name,
      fields,
    });

    const createdTemplate = await this.memeTemplateRepo.save(memeTemplate);
    return createdTemplate;
  }

  public async getMemeTemplateById(memeId: number) {
    const memeTemplate = await this.findMemeTemplateById(memeId);
    if (!memeTemplate)
      throw new NotFoundException(`Meme template: ${memeId} not found`);
    return {
      ...memeTemplate,
      createdBy: memeTemplate.createdBy.toUserData(),
    };
  }
  public getRandomMemeTemplate(previousMemesIds: number[]) {
    return this.findRandomMemeTemplate(previousMemesIds);
  }

  public createMeme(
    userData: UserData,
    playerId: number,
    submittedMeme: SubmitMemeDto,
    roundId: number,
  ) {
    const meme = this.memeRepo.create({
      createdBy: userData,
      createdByPlayer: { id: playerId },
      values: submittedMeme.values,
      template: { id: submittedMeme.templateId },
      round: { id: roundId },
    });
    return this.memeRepo.save(meme);
  }

  public gradeMeme(
    memeId: number,
    userId: number,
    playerId: number,
    score: number,
  ) {
    const grade = this.gradeRepo.create({
      createdBy: { id: userId },
      createdByPlayer: { id: playerId },
      meme: { id: memeId },
      score,
    });
    // await this.memeRepo.increment({ id: memeId }, 'score', score);
    return this.gradeRepo.save(grade);
  }

  // ToDo: Move to memes.repository

  public getMemeGrades(memeId: number) {
    return this.gradeRepo.findBy({ memeId });
  }

  public getMemeById(
    memeId: number,
    options: {
      withGrades?: boolean;
      withTemplate?: boolean;
      withAuthor?: boolean;
    } = { withGrades: false, withTemplate: false, withAuthor: false },
  ) {
    return this.memeRepo.findOne({
      where: { id: memeId },
      relations: {
        grades: options.withGrades,
        template: options.withTemplate,
        createdBy: options.withAuthor,
      },
    });
  }

  public findMemeById(memeId: number) {
    return this.memeRepo.findOneBy({ id: memeId });
  }

  private findMemeTemplateById(memeId: number) {
    return this.memeTemplateRepo.findOne({
      where: { id: memeId },
      relations: {
        fields: true,
        createdBy: true,
      },
    });
  }

  private findRandomMemeTemplate(previousMemesIds: number[]) {
    return this.memeTemplateRepo
      .createQueryBuilder('meme')
      .innerJoinAndSelect('meme.fields', 'fields')
      .where('meme.id NOT IN (:...excluded)', {
        excluded: [...previousMemesIds, -1],
      })
      .orderBy('RANDOM()')
      .getOne();
  }
}
