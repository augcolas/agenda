import { IsNotEmpty, IsNumber, IsString } from 'class-validator';


export class CreateEventDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  date: Date;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description: string;

  constructor(partial: Partial<CreateEventDto>) {
    Object.assign(this, partial);
    this.date = this.date || new Date();
    this.title = this.title || 'New Event';
    this.description = this.description || '';
  }
}
