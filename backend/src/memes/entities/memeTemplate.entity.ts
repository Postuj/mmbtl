import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { InputField } from './inputField.entity';
import { Meme } from './meme.entity';

@Entity('meme_templates')
export class MemeTemplate {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar')
  imagePath: string;
  
  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => InputField, (field) => field.meme)
  fields: InputField[];

  // User who added meme template
  @ManyToOne(() => User, (user) => user.createdMemeTemplates)
  createdBy: User;

  @OneToMany(() => Meme, (meme) => meme.template)
  memes: Meme[];
}
