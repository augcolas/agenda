import { IsNotEmpty, IsNumber, IsString } from 'class-validator';


export class CreateEventDto {
  @IsNumber({}, { each: true })
  userIds: number[];

  @IsNotEmpty()
  date: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;

  constructor(partial: Partial<CreateEventDto>) {
    Object.assign(this, partial);
    this.date = this.date || new Date().toLocaleString();
    this.title = this.title || 'New Event';
    this.description = this.description || '';
  }
}
