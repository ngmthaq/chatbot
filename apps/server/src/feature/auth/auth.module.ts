import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { ConfigType } from '../../core/config/config-type';
import { CoreConfigModule } from '../../core/config/config.module';
import { CoreThrottlerModule } from '../../core/throttler/throttler.module';

import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';

@Module({
  imports: [
    CoreThrottlerModule,
    JwtModule.registerAsync({
      imports: [CoreConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<ConfigType['jwtSecret']>('jwtSecret'),
        signOptions: {
          expiresIn: configService.get<ConfigType['jwtExpiration']>(
            'jwtExpiration',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ) as any,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  exports: [AuthService, AuthGuard, JwtModule],
})
export class AuthModule {}
