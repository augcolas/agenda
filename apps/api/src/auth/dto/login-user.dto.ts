import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'email' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'password' })
  password: string;
}

export class EmailDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ description: 'email' })
  email: string;
}

export class PasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'password' })
  password: string;
}
