/* eslint-disable prettier/prettier */

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO } from './auth.dto';
import { User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserDto } from 'src/user/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async login(user: AuthDTO) {
    try {
      const { username, password } = user;
      const currentUser: UserDto = await this.userModel.findOne({
        email: username,
      });

      if (!currentUser) {
        throw new UnauthorizedException('Username or Email is incorrect');
      }

      const comparePassword = bcrypt.compareSync(
        password,
        currentUser.password
      );

      if (!comparePassword) {
        throw new UnauthorizedException('Password is incorrect');
      }

      const accessToken: string = await this.generatorAccessToken(currentUser);
      const refreshToken: string =
        await this.generatorRefreshToken(currentUser);
      return {
        error: false,
        message: 'Login Successfully',
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async getProfile(user: UserDto) {
    try {
      if (!user) {
        throw new UnauthorizedException('get profile failed');
      }

      const currentUser: UserDto = await this.userModel.findOne({
        _id: user._id,
      });

      const newUser = UserDto.plainToClassInstance(currentUser);
      return newUser;
    } catch (error) {
      throw new UnauthorizedException(error.message);
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

  async refreshTokenService(token: string) {
    try {
      const user = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET_KEY2'),
      });

      const newAccessToken = await this.generatorAccessToken(user);
      return newAccessToken;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }
}
