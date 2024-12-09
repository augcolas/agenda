import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  areNotificationsEnabled: boolean;

  @Column()
  role: Role;

  @Column({ nullable: true })
  resetPasswordToken: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
