import { GameRound } from 'src/game/entities/gameRound.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MemeTemplate } from './memeTemplate.entity';

@Entity('memes')
export class Meme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('json')
  values: string[];

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.memes)
  createdBy: User;

  @ManyToOne(() => MemeTemplate, (memeTemplate) => memeTemplate.memes)
  template: MemeTemplate;

  @ManyToOne(() => GameRound, (round) => round.memes)
  round: GameRound;
}
