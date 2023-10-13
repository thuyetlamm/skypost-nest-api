import { Body, Controller, Inject, Post } from '@nestjs/common';
import { UserDto } from './user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  // define properties
  constructor(@Inject('APP_USER_SERVICE') private userService: UserService) {}
  // [POST] /users
  @Post('create')
  createUser(@Body() user: UserDto): Promise<UserDto> {
    return this.userService.createUser(user);
  }
}
