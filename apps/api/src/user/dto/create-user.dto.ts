import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Event } from 'src/event/entities/event';

import { Role } from '../entities/user';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'password' })
  password: string;

  @IsNotEmpty()
  @IsBoolean()
  @ApiProperty({ description: 'areNotificationsEnabled' })
  areNotificationsEnabled: boolean;

  @IsEnum(Role)
  @ApiProperty({ description: 'role' })
  role: Role = Role.USER;

  @ApiProperty({ description: 'events', type: [Event] })
  @IsOptional()
  events?: Event[] | null;

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
    this.role = this.role || Role.USER;
    this.areNotificationsEnabled = this.areNotificationsEnabled || true;
  }
}
