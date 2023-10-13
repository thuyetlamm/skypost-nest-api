import { IsEmail, IsInt, IsNotEmpty, Length } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';
import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class UserDto extends BaseDto {
  @IsNotEmpty({ message: 'Username is required' })
  @Expose()
  username: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail()
  @Expose()
  email: string;

  @IsInt()
  @Expose()
  type: number;

  @IsNotEmpty()
  @Expose()
  role: string;

  @Expose()
  avatar: string;

  @Expose()
  @IsInt()
  status: number;

  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 20)
  password: string;
}

export type JwtResponse = {
  _id: ObjectId;
  email: string;
  ext: number;
  iat: number;
};
