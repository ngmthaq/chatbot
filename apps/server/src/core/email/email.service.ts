import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

import { ConfigType } from '../config/config-type';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Send user activation email
   */
  async sendActivationEmail(
    email: string,
    data: {
      name: string;
      activationToken: string;
      activationUrl: string;
    },
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Activate Your Account',
        template: 'activation',
        context: {
          name: data.name,
          activationUrl: data.activationUrl,
          appName: this.configService.get<ConfigType['appName']>('appName'),
        },
      });

      this.logger.log(`Activation email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send activation email to ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    data: {
      name: string;
      resetToken: string;
      resetUrl: string;
    },
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Reset Your Password',
        template: 'password-reset',
        context: {
          name: data.name,
          resetUrl: data.resetUrl,
          appName: this.configService.get<ConfigType['appName']>('appName'),
        },
      });

      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Send welcome email after account activation
   */
  async sendWelcomeEmail(
    email: string,
    data: {
      name: string;
    },
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Welcome!',
        template: 'welcome',
        context: {
          name: data.name,
          appName: this.configService.get<ConfigType['appName']>('appName'),
        },
      });

      this.logger.log(`Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send welcome email to ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Send password changed notification
   */
  async sendPasswordChangedEmail(
    email: string,
    data: {
      name: string;
    },
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Password Changed',
        template: 'password-changed',
        context: {
          name: data.name,
          appName: this.configService.get<ConfigType['appName']>('appName'),
        },
      });

      this.logger.log(`Password changed email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password changed email to ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Send generic notification email
   */
  async sendNotificationEmail(
    email: string,
    data: {
      subject: string;
      message: string;
    },
  ): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: email,
        subject: data.subject,
        template: 'notification',
        context: {
          message: data.message,
          appName: this.configService.get<ConfigType['appName']>('appName'),
        },
      });

      this.logger.log(`Notification email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send notification email to ${email}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }
}
