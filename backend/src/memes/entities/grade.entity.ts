import { Player } from 'src/game/entities/player.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meme } from './meme.entity';

@Entity('grades')
export class Grade {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', nullable: false })
  score: number;

  @ManyToOne(() => Meme, (meme) => meme.grades)
  @JoinColumn({ name: 'memeId' })
  meme: Meme;

  @Column({ type: 'int', nullable: false })
  memeId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ type: 'int', nullable: false })
  createdById: number;

  @ManyToOne(() => Player, (player) => player.grades)
  @JoinColumn({ name: 'createdByPlayerId' })
  createdByPlayer: Player;

  @Column({ type: 'int', nullable: false })
  createdByPlayerId: number;
}
