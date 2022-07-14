import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MemeTemplate } from './memeTemplate.entity';

@Entity('input_fields')
export class InputField {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  x: number;

  @Column('int')
  y: number;

  @Column('int')
  width: number;

  @Column('int')
  height: number;

  @ManyToOne(() => MemeTemplate, (memeTemplate) => memeTemplate.fields)
  meme: MemeTemplate;
}
