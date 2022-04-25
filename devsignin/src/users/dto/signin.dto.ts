import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SigninDto {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(4)
  password: string;
}
