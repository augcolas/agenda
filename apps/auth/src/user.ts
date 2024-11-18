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
  areNotificationsEnabled: boolean;

  @Column()
  role: Role;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
