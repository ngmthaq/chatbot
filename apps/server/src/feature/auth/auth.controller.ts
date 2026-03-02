import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

import { PrismaService } from '../../core/database/prisma.service';

import { ActivateUserDto } from './activate-user.dto';
import { AuthRequest } from './auth-type';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './forgot-password.dto';
import { LoginDto } from './login.dto';
import { Public } from './public.decorator';
import { RefreshTokenDto } from './refresh-token.dto';
import { RegisterDto } from './register.dto';
import { ResetPasswordDto } from './reset-password.dto';

@ApiTags('Authentication')
@ApiBearerAuth()
@Controller('auth')
@UseGuards(ThrottlerGuard, AuthGuard)
export class AuthController {
  public constructor(
    private readonly authService: AuthService,
    private readonly prismaService: PrismaService,
  ) {}

  @Post('login')
  @Public()
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticate user and return access/refresh tokens',
  })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  public login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @Public()
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Get new access token using refresh token',
  })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  public refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Post('register')
  @Public()
  @ApiOperation({
    summary: 'Register new user',
    description: 'Create new user account and send activation email',
  })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Email already exists' })
  public register(@Body() registerDto: RegisterDto) {
    return this.prismaService.$transaction(async (transaction) => {
      return this.authService.register(transaction, registerDto);
    });
  }

  @Post('activate/:token')
  @Public()
  @ApiOperation({
    summary: 'Activate user account',
    description: 'Activate user account using token from email',
  })
  @ApiResponse({ status: 200, description: 'Account activated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  public activateUser(@Param() params: ActivateUserDto) {
    return this.prismaService.$transaction(async (transaction) => {
      return this.authService.activateUser(transaction, params.token);
    });
  }

  @Post('password/forgot')
  @Public()
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Send password reset email to user',
  })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  @ApiResponse({ status: 404, description: 'User not found' })
  public forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto.email);
  }

  @Post('password/reset')
  @Public()
  @ApiOperation({
    summary: 'Reset password',
    description: 'Reset user password using token from email',
  })
  @ApiResponse({ status: 200, description: 'Password reset successfully' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  public resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.prismaService.$transaction(async (transaction) => {
      return this.authService.resetPassword(transaction, resetPasswordDto);
    });
  }

  @Get('profile')
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Get authenticated user profile information',
  })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public getProfile(@Req() req: AuthRequest) {
    return this.authService.getProfile(req.authentication.sub);
  }

  @Get('role')
  @ApiOperation({
    summary: 'Get user role',
    description: 'Get authenticated user role information',
  })
  @ApiResponse({ status: 200, description: 'Role retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public getRole(@Req() req: AuthRequest) {
    return this.authService.getRole(req.authentication.sub);
  }

  @Get('rbac')
  @ApiOperation({
    summary: 'Get user permissions',
    description: 'Get authenticated user RBAC permissions',
  })
  @ApiResponse({
    status: 200,
    description: 'Permissions retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public getRbac(@Req() req: AuthRequest) {
    return this.authService.getRbac(req.authentication.sub);
  }
}
