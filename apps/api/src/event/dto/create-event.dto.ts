import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';


export class CreateEventDto {
  @IsNumber({}, { each: true })
  @ApiProperty({ description: 'userIds', type: [Number] })
  userIds: number[];

  @IsNotEmpty()
  @ApiProperty({ description: 'date' })
  date: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'title' })
  title: string;

  @IsString()
  @ApiProperty({ description: 'description' })
  description: string;

  constructor(partial: Partial<CreateEventDto>) {
    Object.assign(this, partial);
    this.date = this.date || new Date().toLocaleString();
    this.title = this.title || 'New Event';
    this.description = this.description || '';
  }
}
