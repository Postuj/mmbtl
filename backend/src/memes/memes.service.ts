import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserData } from 'src/users/interfaces/userData.interface';
import { Repository } from 'typeorm';
import { CreateMemeTemplateDto } from './dto/CreateMemeTemplateDto';
import { InputField } from './entities/inputField.entity';
import { Meme } from './entities/meme.entity';
import { MemeTemplate } from './entities/memeTemplate.entity';

@Injectable()
export class MemesService {
  constructor(
    @InjectRepository(Meme) private readonly memeRepo: Repository<Meme>,
    @InjectRepository(MemeTemplate)
    private readonly memeTemplateRepo: Repository<MemeTemplate>,
    @InjectRepository(InputField)
    private readonly inputFieldRepo: Repository<InputField>,
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

  public async getMemeTemplate(memeId: number) {
    const memeTemplate = await this.findMemeTemplateById(memeId);
    return {
      ...memeTemplate,
      createdBy: memeTemplate.createdBy.toUserData(),
    };
  }

  public findMemeById(memeId: number) {
    return this.memeRepo.findOneBy({ id: memeId });
  }

  public findMemeTemplateById(memeId: number) {
    return this.memeTemplateRepo.findOne({
      where: { id: memeId },
      relations: {
        fields: true,
        createdBy: true,
      },
    });
  }
}
