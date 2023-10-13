import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

//Define a "type" of "authentication request"
export class AuthDTO {
  @IsEmail()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
