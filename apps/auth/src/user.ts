import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: Role;

  @Column({ nullable: true })
  resetPasswordToken: string;
}

export enum Role {
  ADMIN = 'ADMIN',
  RESET_TOKEN = 'RESET_TOKEN',
  USER = 'USER',
}
