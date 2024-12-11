import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

import { Event } from '../../event/entities/event';

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

  @ManyToMany(() => Event, (event) => event.users, { nullable: true })
  events?: Event[] | null;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
