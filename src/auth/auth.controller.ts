import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtResponse } from 'src/user/user.dto';
import { AuthDTO } from './auth.dto';
import { AuthGuard, Public } from './auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private authGuard: AuthGuard
  ) {}

  ///----------------------------------------------------------------
  @Public()
  @Post('login')
  async login(@Body() user: AuthDTO) {
    return this.authService.login(user);
  }

  ///----------------------------------------------------------------

  @Public()
  @Post('refreshToken')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const relativeToken = this.authGuard.extractTokenFromHeader(req);
    const newToken = await this.authService.refreshTokenService(relativeToken);
    return res.status(HttpStatus.OK).json({ accessToken: newToken });
  }

  ///----------------------------------------------------------------

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
