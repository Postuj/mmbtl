import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dto/RegisterDto';
import { Game } from 'src/game/entities/game.entity';
import { In, Repository, UpdateQueryBuilder } from 'typeorm';
import { RegistrationMethod, User, UserStatus } from './entities/user.entity';
import { UserData } from './interfaces/userData.interface';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {}

  public async createUser(
    userCredentials: RegisterDto,
    registrationMethod: RegistrationMethod,
  ): Promise<User> {
    UpdateQueryBuilder;
    const user = this.usersRepo.create(userCredentials);
    user.registrationMethod = registrationMethod;
    return this.usersRepo.save(user);
  }

  public async updateUserRefreshTokenHash(
    userId: number,
    refreshTokenHash: string | null,
  ) {
    await this.usersRepo
      .createQueryBuilder()
      .update({ refreshToken: refreshTokenHash })
      .where({ id: userId })
      .execute();
  }

  public async handleUserJoinGame(userId: number, gameId: number) {
    this.logger.debug(`User ${userId} is joining game ${gameId}`);
    try {
      await this.usersRepo
        .createQueryBuilder()
        .update({ currentGame: { id: gameId }, status: UserStatus.IN_LOBBY })
        .where({ id: userId })
        .execute();
    } catch (error) {
      console.error(error);
      return;
    }
    this.logger.debug(`User has ${userId} joined game ${gameId}`);
  }

  public async handleUserLeaveGame(userId: number) {
    this.logger.debug(`User is ${userId} leaving game`);
    try {
      this.usersRepo
        .createQueryBuilder()
        .update({ currentGame: null, status: UserStatus.ONLINE })
        .where({ id: userId })
        .execute();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Error while handling user leave');
    }
    this.logger.debug(`User ${userId} has left game`);
  }

  public async removePlayersFromGame(gameId) {
    return this.usersRepo
      .createQueryBuilder()
      .update({ currentGame: null, status: UserStatus.ONLINE })
      .where({ currentGameId: gameId })
      .execute();
  }

  // ToDo: Move to user.repository.ts

  public async getUserCurrentGame(userId: number) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: { currentGame: true },
    });
    return user.currentGame;
  }

  public async checkIfUserInGame(userId: number, gameId?: number) {
    const user = await this.usersRepo.findOneBy({ id: userId });
    if (gameId) return user.currentGameId === gameId;
    else return user.currentGameId !== null;
  }

  public updateUserStatus(userId: number, status: UserStatus) {
    this.logger.debug(`User ${userId} status changed to ${status}`);
    return this.usersRepo.update({ id: userId }, { status });
  }

  public updateManyUsersStatus(userIds: number[], status: UserStatus) {
    return this.usersRepo.update({ id: In(userIds) }, { status });
  }

  public updateUsersInGameStatus(gameId: number, status: UserStatus) {
    return this.usersRepo.update({ currentGameId: gameId }, { status });
  }

  public async findOneByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<User | undefined> {
    return this.usersRepo
      .createQueryBuilder('user')
      .select('*')
      .where(
        'user.username = :emailOrUsername OR user.email = :emailOrUsername',
        {
          emailOrUsername,
        },
      )
      .getOne();
  }

  public async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepo.findOneBy({ email });
  }

  public async findOneById(id: number): Promise<User | undefined> {
    return this.usersRepo.findOneBy({ id });
  }
}
