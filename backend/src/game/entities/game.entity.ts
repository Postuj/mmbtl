import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameRound } from './gameRound.entity';
import { Player } from './player.entity';

export enum GameStatus {
  WAITING = 'waiting',
  STARTING = 'starting',
  RUNNING = 'running',
  FINISHED = 'finished',
  CANCELED = 'canceled',
}

@Entity('games')
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.WAITING,
  })
  status: GameStatus;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true, default: null })
  finishedAt?: Date;

  @Column({ type: 'int', default: 3 })
  maxRounds: number;

  @ManyToOne(() => User, (user) => user.createdGames)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ type: 'int', nullable: false })
  createdById: number;

  @ManyToOne(() => User, (user) => user.wonGames, { nullable: true })
  @JoinColumn({ name: 'winnerId' })
  winner?: User;

  @Column({ type: 'int', nullable: true, default: null })
  winnerId?: number;

  @OneToMany(() => GameRound, (round) => round.game, { cascade: true })
  rounds: GameRound[];

  @OneToMany(() => Player, (player) => player.game, { cascade: true })
  players: Player[];

  @OneToMany(() => Player, (player) => player.lobby, { cascade: true })
  lobby: Player[];
}
