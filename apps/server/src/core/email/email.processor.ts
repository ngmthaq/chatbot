import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { Job } from 'bullmq';

import { ConfigType } from '../config/config-type';

import {
  ActivationEmailJob,
  EMAIL_QUEUE,
  EmailJobName,
  NotificationEmailJob,
  PasswordChangedEmailJob,
  PasswordResetEmailJob,
  WelcomeEmailJob,
} from './email-job.interface';

@Processor(EMAIL_QUEUE)
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    this.logger.log(`Processing email job: ${job.name} (id=${job.id})`);

    switch (job.name) {
      case EmailJobName.SEND_ACTIVATION:
        await this.handleActivation(job.data as ActivationEmailJob);
        break;
      case EmailJobName.SEND_WELCOME:
        await this.handleWelcome(job.data as WelcomeEmailJob);
        break;
      case EmailJobName.SEND_PASSWORD_RESET:
        await this.handlePasswordReset(job.data as PasswordResetEmailJob);
        break;
      case EmailJobName.SEND_PASSWORD_CHANGED:
        await this.handlePasswordChanged(job.data as PasswordChangedEmailJob);
        break;
      case EmailJobName.SEND_NOTIFICATION:
        await this.handleNotification(job.data as NotificationEmailJob);
        break;
      default:
        this.logger.warn(`Unknown email job type: ${job.name}`);
    }
  }

  private get appName() {
    return this.configService.get<ConfigType['appName']>('appName');
  }

  private async handleActivation(data: ActivationEmailJob): Promise<void> {
    await this.mailerService.sendMail({
      to: data.email,
      subject: 'Activate Your Account',
      template: 'activation',
      context: {
        name: data.name,
        activationUrl: data.activationUrl,
        appName: this.appName,
      },
    });
    this.logger.log(`Activation email sent to ${data.email}`);
  }

  private async handleWelcome(data: WelcomeEmailJob): Promise<void> {
    await this.mailerService.sendMail({
      to: data.email,
      subject: 'Welcome!',
      template: 'welcome',
      context: {
        name: data.name,
        appName: this.appName,
      },
    });
    this.logger.log(`Welcome email sent to ${data.email}`);
  }

  private async handlePasswordReset(
    data: PasswordResetEmailJob,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: data.email,
      subject: 'Reset Your Password',
      template: 'password-reset',
      context: {
        name: data.name,
        resetUrl: data.resetUrl,
        appName: this.appName,
      },
    });
    this.logger.log(`Password reset email sent to ${data.email}`);
  }

  private async handlePasswordChanged(
    data: PasswordChangedEmailJob,
  ): Promise<void> {
    await this.mailerService.sendMail({
      to: data.email,
      subject: 'Password Changed',
      template: 'password-changed',
      context: {
        name: data.name,
        appName: this.appName,
      },
    });
    this.logger.log(`Password changed email sent to ${data.email}`);
  }

  private async handleNotification(data: NotificationEmailJob): Promise<void> {
    await this.mailerService.sendMail({
      to: data.email,
      subject: data.subject,
      template: 'notification',
      context: {
        message: data.message,
        appName: this.appName,
      },
    });
    this.logger.log(`Notification email sent to ${data.email}`);
  }
}
