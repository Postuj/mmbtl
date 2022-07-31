import { Meme } from 'src/memes/entities/meme.entity';
import { MemeTemplate } from 'src/memes/entities/memeTemplate.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game, GameStatus } from './game.entity';

export enum RoundStatus {
  RUNNING = 'running',
  GRADING = 'grading',
  FINISHED = 'finished',
}

@Entity('game_rounds')
export class GameRound {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 1 })
  index: number;

  @Column({ type: 'enum', enum: RoundStatus, default: RoundStatus.RUNNING })
  status: RoundStatus;

  @ManyToOne(() => Game, (game) => game.rounds)
  game: Game;

  @ManyToOne(() => MemeTemplate, (memeTemplate) => memeTemplate.rounds, {
    eager: true,
  })
  @JoinColumn({ name: 'templateId' })
  template: MemeTemplate;

  @Column({ type: 'int', nullable: false })
  templateId: number;

  @OneToMany(() => Meme, (meme) => meme.round, { eager: true })
  memes: Meme[];
}
