import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
} from 'class-validator';

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

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
    this.role = this.role || Role.USER;
    this.areNotificationsEnabled = this.areNotificationsEnabled || true;
  }
}
