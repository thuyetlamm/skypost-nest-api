/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO } from './auth.dto';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from 'src/user/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async login(user: AuthDTO) {
    const currentUser: UserDto = await this.userModel.findOne({
      email: user.username,
    });
    if (!currentUser) {
      return {
        message: 'User not found',
        error: true,
        errorCode: 400,
      };
    }
    const accessToken: string = await this.generatorAccessToken(currentUser);
    const refreshToken: string = await this.generatorRefreshToken(currentUser);
    return {
      error: false,
      message: 'Login Successfully',
      accessToken,
      refreshToken,
    };
  }

  async getProfile(user: UserDto) {
    try {
      const currentUser: UserDto = await this.userModel.findOne({
        _id: user._id,
      });
      const newUser = UserDto.plainToClassInstance(currentUser);
      return newUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async generatorAccessToken(user: UserDto) {
    return this.jwtService.signAsync(
      { _id: user._id, email: user.email },
      {
        expiresIn: '24h',
        secret: this.configService.get<string>('JWT_SECRET_KEY'),
      }
    );
  }

  async generatorRefreshToken(user: UserDto) {
    return this.jwtService.sign(
      { _id: user._id, email: user.email },
      {
        expiresIn: '90d',
        secret: this.configService.get<string>('JWT_SECRET_KEY2'),
      }
    );
  }
}
