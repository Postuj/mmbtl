import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dto/RegisterDto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/CreateUserDto.dto';
import { RegistrationMethod } from './entities/registrationMethod.entity';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  async createUser(
    userCredentials: RegisterDto,
    registrationMethod: RegistrationMethod,
  ): Promise<User> {
    const user = this.usersRepo.create(userCredentials);
    user.registrationMethod = registrationMethod;
    return this.usersRepo.save(user);
  }

  async updateUserRefreshTokenHash(
    userId: number,
    refreshTokenHash: string | null,
  ) {
    await this.usersRepo
      .createQueryBuilder()
      .update({ refreshToken: refreshTokenHash })
      .where({ id: userId })
      .execute();
  }

  async findOneByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<User | undefined> {
    return this.usersRepo
      .createQueryBuilder('user')
      .where(
        'user.username = :emailOrUsername OR user.email = :emailOrUsername',
        {
          emailOrUsername,
        },
      )
      .getOne();
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepo.findOneBy({ email });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.usersRepo.findOneBy({ id });
  }
}
