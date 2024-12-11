import { Exclude } from 'class-transformer';
import { Event } from 'src/event/entities/event';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToMany(() => Event, event => event.users,
  { nullable: true })
  events?: Event[] | null;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
