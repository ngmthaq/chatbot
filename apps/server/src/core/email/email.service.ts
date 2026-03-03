import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

import { EMAIL_QUEUE, EmailJobName } from './email-job.interface';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(@InjectQueue(EMAIL_QUEUE) private readonly emailQueue: Queue) {}

  /**
   * Queue user activation email
   */
  async sendActivationEmail(
    email: string,
    data: {
      name: string;
      activationToken: string;
      activationUrl: string;
    },
  ): Promise<void> {
    await this.emailQueue.add(EmailJobName.SEND_ACTIVATION, { email, ...data });
    this.logger.log(`Activation email queued for ${email}`);
  }

  /**
   * Queue password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    data: {
      name: string;
      resetToken: string;
      resetUrl: string;
    },
  ): Promise<void> {
    await this.emailQueue.add(EmailJobName.SEND_PASSWORD_RESET, {
      email,
      ...data,
    });
    this.logger.log(`Password reset email queued for ${email}`);
  }

  /**
   * Queue welcome email after account activation
   */
  async sendWelcomeEmail(
    email: string,
    data: {
      name: string;
    },
  ): Promise<void> {
    await this.emailQueue.add(EmailJobName.SEND_WELCOME, { email, ...data });
    this.logger.log(`Welcome email queued for ${email}`);
  }

  /**
   * Queue password changed notification
   */
  async sendPasswordChangedEmail(
    email: string,
    data: {
      name: string;
    },
  ): Promise<void> {
    await this.emailQueue.add(EmailJobName.SEND_PASSWORD_CHANGED, {
      email,
      ...data,
    });
    this.logger.log(`Password changed email queued for ${email}`);
  }

  /**
   * Queue generic notification email
   */
  async sendNotificationEmail(
    email: string,
    data: {
      subject: string;
      message: string;
    },
  ): Promise<void> {
    await this.emailQueue.add(EmailJobName.SEND_NOTIFICATION, {
      email,
      ...data,
    });
    this.logger.log(`Notification email queued for ${email}`);
  }
}
