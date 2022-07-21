import { Exclude } from 'class-transformer';
import { Game } from 'src/game/entities/game.entity';
import { Meme } from 'src/memes/entities/meme.entity';
import { MemeTemplate } from 'src/memes/entities/memeTemplate.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserData } from '../interfaces/userData.interface';

export enum RegistrationMethod {
  LOCAL = 'local',
  GOOGLE = 'google',
}

export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  IN_LOBBY = 'in_lobby',
  IN_GAME = 'in_game',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @Exclude()
  @Column({ nullable: true })
  refreshToken?: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ONLINE,
  })
  status: UserStatus;

  @Exclude()
  @Column({
    type: 'enum',
    enum: RegistrationMethod,
    default: RegistrationMethod.LOCAL,
  })
  registrationMethod: RegistrationMethod;

  @Exclude()
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  registeredAt: Date;

  @ManyToOne(() => Game, (game) => game.players)
  currentGame: Game;

  @ManyToMany(() => Game, (game) => game.players)
  games: Game[];

  @OneToMany(() => Game, (game) => game.createdBy)
  createdGames: Game[];

  @OneToMany(() => Game, (game) => game.winner)
  wonGames: Game[];

  @OneToMany(() => MemeTemplate, (memeTemplate) => memeTemplate.createdBy)
  createdMemeTemplates: MemeTemplate[];

  @OneToMany(() => Meme, (meme) => meme.createdBy)
  memes: Meme[];

  toUserData(): UserData {
    const { password, refreshToken, registeredAt, registrationMethod, ...result } = this;
    return result;
  }
}
