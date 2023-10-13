import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createUser(user: UserDto): Promise<UserDto> {
    const newUser = await this.userModel.create(user);
    return UserDto.plainToClassInstance(newUser as any);
  }

  async findOne(email: string): Promise<UserDto> {
    const newUser = await this.userModel.findOne({ email });
    return newUser as any;
  }
}
