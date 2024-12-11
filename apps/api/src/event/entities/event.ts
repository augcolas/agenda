import { User } from 'src/user/entities/user';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User, (user) => user.events, { cascade: true, eager: true })
  @JoinTable()
  users: User[];

  @Column()
  date: string;

  @Column()
  title: string;

  @Column()
  description: string;
}
