import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserData } from '../interfaces/userData.interface';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  refreshToken: string;

  toUserData(): UserData {
    const  { password, refreshToken, ...result } = this;
    return result;
  }
}
