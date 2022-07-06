import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dto/RegisterDto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async createUser(userCredentials: RegisterDto): Promise<User> {
    const user = this.usersRepo.create(userCredentials);
    return this.usersRepo.save(user);
  }

  async findOneByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<User | undefined> {
    return this.usersRepo
      .createQueryBuilder()
      .where('username = :emailOrUsername OR email = :emailOrUsername', {
        emailOrUsername,
      })
      .getOne();
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepo.findOneBy({ email });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.usersRepo.findOneBy({ id });
  }
}
