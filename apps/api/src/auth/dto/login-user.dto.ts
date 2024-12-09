import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class EmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class PasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}
