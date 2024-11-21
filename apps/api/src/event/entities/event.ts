import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { array: true })
  userIds: number[];

  @Column()
  date: Date;

  @Column()
  title: string;

  @Column()
  description: string;

}
