import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/entities/user';


export class CreateEventDto {
  @IsNotEmpty()
  @ApiProperty({ description: 'users', type: [User['id']] })
  users: User['id'][];

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
