import { GameRound } from 'src/game/entities/gameRound.entity';
import { Player } from 'src/game/entities/player.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Grade } from './grade.entity';
import { MemeTemplate } from './memeTemplate.entity';

@Entity('memes')
export class Meme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', array: true })
  values: string[];

  @Column({ type: 'int', default: 0 })
  score: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.memes)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ nullable: false })
  createdById: number;

  @ManyToOne(() => Player, (player) => player.memes)
  @JoinColumn({name: 'createdByPlayerId'})
  createdByPlayer: Player;

  @Column({type: 'int', nullable: false})
  createdByPlayerId: number;

  @ManyToOne(() => MemeTemplate, (memeTemplate) => memeTemplate.memes)
  @JoinColumn({ name: 'templateId' })
  template: MemeTemplate;

  @Column({ type: 'int', nullable: false })
  templateId: number;

  @ManyToOne(() => GameRound, (round) => round.memes)
  @JoinColumn({name: 'roundId'})
  round: GameRound;

  @Column({type: 'int', nullable: false})
  roundId: number;

  @OneToMany(() => Grade, (grade) => grade.meme, { eager: true })
  grades: Grade[];
}
