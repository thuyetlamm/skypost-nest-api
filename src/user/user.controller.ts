import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { User } from 'src/schemas/user.schema';
import { ObjectId } from 'mongoose';
import { Response } from 'express';
import { UserQuery } from 'src/types/user.interface';
import { BaseQuery } from 'src/types/base.interface';

@Controller()
export class UserController {
  // define properties
  constructor(@Inject('APP_USER_SERVICE') private userService: UserService) {}

  @Get('users')
  getAllUser(
    @Query()
    query: UserQuery & BaseQuery
  ) {
    return this.userService.getAllUser(query);
  }
  // [POST] /user
  @Post('user/create')
  createUser(@Body() user: User): Promise<UserDto> {
    return this.userService.createUser(user);
  }

  // [POST] /users
  @Put('user/update/:id')
  update(@Body() user: User, @Param('id') _id: ObjectId) {
    const newUser = { ...user, _id };
    return this.userService.updateUser(newUser as any);
  }

  @Delete('user/delete/:id')
  async delete(@Res() response: Response, @Param('id') id: ObjectId) {
    const res = await this.userService.delete(id);
    if (!res) {
      return response.status(HttpStatus.NOT_FOUND).json({
        status: 404,
        error: true,
        message: 'Customer dont exist',
      });
    }
    return response.status(HttpStatus.OK).json({
      status: 200,
      error: false,
      message: 'Customer deleted successfully',
    });
  }
}
