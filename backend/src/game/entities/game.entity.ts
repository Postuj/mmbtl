import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameRound } from './gameRound.entity';

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

  @ManyToOne(() => User, (user) => user.createdGames)
  createdBy: User;

  @ManyToOne(() => User, (user) => user.wonGames, { nullable: true })
  winner: User;

  @OneToMany(() => GameRound, (round) => round.game)
  rounds: GameRound[];

  @JoinTable({ name: 'game_players' })
  @ManyToMany(() => User, (user) => user.games, { cascade: true })
  players: User[];

  @JoinTable({ name: 'game_lobby' })
  @ManyToMany(() => User, (user) => user.games, { cascade: true })
  lobby: User[];
}
