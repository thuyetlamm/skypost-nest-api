import { Injectable } from '@nestjs/common';
import { UserDto } from './user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/schemas/user.schema';
import { Model, ObjectId } from 'mongoose';
import { BaseService } from 'src/common/base.service';
import * as bcrypt from 'bcrypt';
import { UserQuery } from 'src/types/user.interface';
import { BaseQuery } from 'src/types/base.interface';

@Injectable()
export class UserService extends BaseService<User, UserDto> {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {
    super(userModel);
  }

  async createUser(user: User): Promise<UserDto> {
    const { password } = user;
    const hahedPassword = bcrypt.hashSync(password, 12);
    const newUser: User = await this.createNew({
      ...user,
      password: hahedPassword,
    });
    return UserDto.plainToClassInstance(newUser as any);
  }

  async deleteUser(id: ObjectId) {
    this.validateObjectId(id);

    return this.deleteOne(id);
  }

  async findUser(email: string): Promise<UserDto> {
    const newUser = await this.findOne({ email });
    return newUser as any;
  }

  ///----------------------------------------------------------------

  async updateUser(user: UserDto): Promise<UserDto> {
    const newUser = await this.update(user);
    return newUser as unknown as Promise<UserDto>;
  }

  ///----------------------------------------------------------------
  async delete(id: ObjectId) {
    try {
      this.validateObjectId(id);

      const deletedUser = await this.deleteOne({ _id: id });
      return deletedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }
  async getAllUser(query: UserQuery & BaseQuery) {
    const { limit = 20, page = 1, keyword = '', status } = query;

    const realQuery = {
      $or: [
        { username: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
      ],
    };
    return this.getAll(realQuery, limit, page);
  }
}
