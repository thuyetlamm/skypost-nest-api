import { Request, Response } from 'express';
import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { JwtResponse } from 'src/user/user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() user: AuthDTO) {
    return this.authService.login(user);
  }
  @UseGuards()
  @Get('profile')
  async getProfile(@Req() req: Request, @Res() res: Response) {
    // GET Profile after AuthGuard
    const infoUserLogin: JwtResponse = req['user'] as JwtResponse;

    const user = await this.authService.getProfile(infoUserLogin as any);
    return res.json({
      error: false,
      message: 'Get profile successfully',
      data: user,
    });
  }
}
