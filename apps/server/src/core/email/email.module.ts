import * as path from 'path';

import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { ConfigType } from '../config/config-type';

import { EmailService } from './email.service';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<ConfigType['mailHost']>('mailHost'),
          port: configService.get<ConfigType['mailPort']>('mailPort'),
          secure:
            configService.get<ConfigType['mailEncryption']>(
              'mailEncryption',
            ) === 'ssl',
          auth: {
            user: configService.get<ConfigType['mailUsername']>('mailUsername'),
            pass: configService.get<ConfigType['mailPassword']>('mailPassword'),
          },
        },
        defaults: {
          from: configService.get<ConfigType['mailFromAddress']>(
            'mailFromAddress',
          ),
        },
        template: {
          dir: path.join(__dirname, 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
