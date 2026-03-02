import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { Prisma } from '../../../prisma-generated/client';
import { ConfigType } from '../../core/config/config-type';
import { PrismaService } from '../../core/database/prisma.service';
import { EmailService } from '../../core/email/email.service';
import { EncryptService } from '../../core/encrypt/encrypt.service';
import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { ResponseBuilder } from '../../core/response/response-builder';
import dayjs from '../../utils/date';
import { generateToken } from '../../utils/string';
import { DefaultRole } from '../role/default-role';
import { TokenType } from '../tokens/token-type';
import { UserEntity } from '../users/user-entity';

import { JwtPayload } from './auth-type';
import { LoginDto } from './login.dto';
import { RefreshTokenDto } from './refresh-token.dto';
import { RegisterDto } from './register.dto';
import { ResetPasswordDto } from './reset-password.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  public constructor(
    private readonly prismaService: PrismaService,
    private readonly encryptionService: EncryptService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  public async login(loginDto: LoginDto) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email: loginDto.email,
        lockedAt: null,
        activatedAt: { not: null },
      },
    });
    if (!user) throw ExceptionBuilder.unauthorized();
    const isPasswordValid = this.encryptionService.isMatch(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) throw ExceptionBuilder.unauthorized();
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    const refreshToken = generateToken();
    const expiredAt = this.configService.get<
      ConfigType['refreshTokenExpiration']
    >('refreshTokenExpiration');
    await this.prismaService.token.create({
      data: {
        userId: user.id,
        token: refreshToken,
        tokenType: TokenType.REFRESH_TOKEN,
        expiredAt: expiredAt!(),
      },
    });
    return ResponseBuilder.data({
      accessToken: token,
      refreshToken: refreshToken,
    });
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const storedToken = await this.prismaService.token.findFirst({
      where: {
        token: refreshTokenDto.refreshToken,
        tokenType: TokenType.REFRESH_TOKEN,
      },
    });
    const user = await this.prismaService.user.findFirst({
      where: {
        id: storedToken!.userId,
        lockedAt: null,
        activatedAt: { not: null },
      },
    });
    if (!user) throw ExceptionBuilder.unauthorized();
    const payload: JwtPayload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    const newRefreshToken = generateToken();
    await this.prismaService.token.update({
      where: { id: storedToken!.id },
      data: {
        token: newRefreshToken,
      },
    });
    return ResponseBuilder.data({
      accessToken: token,
      refreshToken: newRefreshToken,
    });
  }

  public async register(
    transaction: Prisma.TransactionClient,
    registerDto: RegisterDto,
  ) {
    const hashedPassword = await this.encryptionService.hash(
      registerDto.password,
    );
    const userRole = await this.prismaService.role.findFirst({
      where: { name: DefaultRole.USER },
    });
    const user = await transaction.user.create({
      data: {
        ...registerDto,
        roleId: userRole!.id,
        password: hashedPassword,
      },
    });
    const activateToken = generateToken();
    const expiredAt = this.configService.get<
      ConfigType['activationTokenExpiration']
    >('activationTokenExpiration');
    await transaction.token.create({
      data: {
        userId: user.id,
        tokenType: TokenType.ACTIVATION_TOKEN,
        token: activateToken,
        expiredAt: expiredAt!(),
      },
    });

    // Send activation email
    try {
      const appUrl =
        this.configService.get<ConfigType['appClientUrl']>('appClientUrl');
      const activationUrl = `${appUrl}/activate?token=${activateToken}`;

      await this.emailService.sendActivationEmail(user.email, {
        name: user.name || 'User',
        activationToken: activateToken,
        activationUrl,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send activation email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      // Don't fail registration if email fails
    }

    return ResponseBuilder.data(new UserEntity(user));
  }

  public async activateUser(
    transaction: Prisma.TransactionClient,
    token: string,
  ) {
    const tokenRecord = await transaction.token.findFirst({
      where: { token, tokenType: TokenType.ACTIVATION_TOKEN },
    });
    const user = await transaction.user.update({
      where: { id: tokenRecord!.userId },
      data: { activatedAt: dayjs().toDate() },
    });
    await transaction.token.delete({ where: { id: tokenRecord!.id } });

    // Send welcome email
    try {
      await this.emailService.sendWelcomeEmail(user.email, {
        name: user.name || 'User',
      });
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      // Don't fail activation if email fails
    }

    return ResponseBuilder.data(new UserEntity(user));
  }

  public async forgotPassword(email: string) {
    const user = await this.prismaService.user.findFirst({ where: { email } });
    const resetToken = generateToken();
    const expiredAt = this.configService.get<
      ConfigType['resetPasswordTokenExpiration']
    >('resetPasswordTokenExpiration');
    await this.prismaService.token.create({
      data: {
        userId: user!.id,
        tokenType: TokenType.RESET_PASSWORD_TOKEN,
        token: resetToken,
        expiredAt: expiredAt!(),
      },
    });

    // Send password reset email
    try {
      const appUrl =
        this.configService.get<ConfigType['appClientUrl']>('appClientUrl');
      const resetUrl = `${appUrl}/reset-password?token=${resetToken}`;

      await this.emailService.sendPasswordResetEmail(user!.email, {
        name: user!.name || 'User',
        resetToken,
        resetUrl,
      });
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      // Don't fail the request if email fails
    }

    return ResponseBuilder.success(true);
  }

  public async resetPassword(
    transaction: Prisma.TransactionClient,
    resetPasswordDto: ResetPasswordDto,
  ) {
    const tokenRecord = await transaction.token.findFirst({
      where: {
        token: resetPasswordDto.token,
        tokenType: TokenType.RESET_PASSWORD_TOKEN,
      },
    });
    const hashedPassword = await this.encryptionService.hash(
      resetPasswordDto.newPassword,
    );
    const user = await transaction.user.update({
      where: { id: tokenRecord!.userId },
      data: { password: hashedPassword },
    });
    await transaction.token.delete({ where: { id: tokenRecord!.id } });

    // Send password changed email
    try {
      await this.emailService.sendPasswordChangedEmail(user.email, {
        name: user.name || 'User',
      });
      this.logger.log(`Password changed email sent to ${user.email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password changed email: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      // Don't fail password reset if email fails
    }

    return ResponseBuilder.success(true);
  }

  public async getProfile(userId: number) {
    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
    });
    return ResponseBuilder.data(new UserEntity(user!));
  }

  public async getRole(userId: number) {
    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
      select: { role: true },
    });
    return ResponseBuilder.data(user!.role);
  }

  public async getRbac(userId: number) {
    const user = await this.prismaService.user.findFirst({
      where: { id: userId },
      select: {
        role: {
          include: {
            rbac: true,
          },
        },
      },
    });
    return ResponseBuilder.data(user!.role.rbac);
  }
}
