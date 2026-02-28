import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';

import { PrismaService } from '../../core/database/prisma.service';

import { ActivateUserDto } from './activate-user.dto';
import { AuthRequest } from './auth-type';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './forgot-password.dto';
import { LoginDto } from './login.dto';
import { Public } from './public.decorator';
import { RefreshTokenDto } from './refresh-token.dto';
import { RegisterDto } from './register.dto';
import { ResetPasswordDto } from './reset-password.dto';

@Controller('auth')
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post('login')
  @Public()
  public login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @Public()
  public refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('register')
  @Public()
  public register(@Body() registerDto: RegisterDto) {
    return this.prismaService.$transaction(async (transaction) => {
      return this.authService.register(transaction, registerDto);
    });
  }

  @Post('activate/:token')
  @Public()
  public activateUser(@Param() params: ActivateUserDto) {
    return this.prismaService.$transaction(async (transaction) => {
      return this.authService.activateUser(transaction, params.token);
    });
  }

  @Post('password/forgot')
  @Public()
  public forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('password/reset')
  @Public()
  public resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.prismaService.$transaction(async (transaction) => {
      return this.authService.resetPassword(transaction, resetPasswordDto);
    });
  }

  @Get('profile')
  public getProfile(@Req() req: AuthRequest) {
    return this.authService.getProfile(req.authentication.sub);
  }

  @Get('role')
  public getRole(@Req() req: AuthRequest) {
    return this.authService.getRole(req.authentication.sub);
  }

  @Get('rbac')
  public getRbac(@Req() req: AuthRequest) {
    return this.authService.getRbac(req.authentication.sub);
  }
}
