import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

//Define a "type" of "authentication request"
export class AuthDTO {
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter a valid email address' })
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
