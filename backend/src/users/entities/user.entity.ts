import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserData } from '../interfaces/userData.interface';
import { RegistrationMethod } from './registrationMethod.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Exclude()
  @Column({ nullable: true })
  password?: string;

  @Exclude()
  @Column({ nullable: true })
  refreshToken?: string;

  @ManyToOne(
    () => RegistrationMethod,
    (registrationMethod) => registrationMethod.users,
    { eager: true },
  )
  registrationMethod: RegistrationMethod;

  toUserData(): UserData {
    const { password, refreshToken, ...result } = this;
    return result;
  }
}
