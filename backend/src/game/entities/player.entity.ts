import { Grade } from 'src/memes/entities/grade.entity';
import { Meme } from 'src/memes/entities/meme.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';

@Entity('players')
export class Player {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ type: 'bool', default: false })
  isReady: boolean;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'int', nullable: false })
  userId: number;

  @ManyToOne(() => Game, (game) => game.players)
  @JoinColumn({ name: 'gameId' })
  game?: Game;

  @Column({ type: 'int', nullable: true })
  gameId?: number;

  @ManyToOne(() => Game, (game) => game.lobby)
  @JoinColumn({ name: 'lobbyId' })
  lobby: Game;

  @Column({ type: 'int', nullable: false })
  lobbyId: number;

  @OneToMany(() => Meme, (meme) => meme.createdByPlayer)
  memes: Meme[];

  @OneToMany(() => Grade, (grade) => grade.createdByPlayer)
  grades: Grade[];
}
