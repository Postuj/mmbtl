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
    const { password, refreshToken, ...result } = this;
    return result;
  }
}
