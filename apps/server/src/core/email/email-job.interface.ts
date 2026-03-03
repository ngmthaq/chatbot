export const EMAIL_QUEUE = 'email';

export enum EmailJobName {
  SEND_ACTIVATION = 'send-activation',
  SEND_WELCOME = 'send-welcome',
  SEND_PASSWORD_RESET = 'send-password-reset',
  SEND_PASSWORD_CHANGED = 'send-password-changed',
  SEND_NOTIFICATION = 'send-notification',
}

export interface ActivationEmailJob {
  email: string;
  name: string;
  activationToken: string;
  activationUrl: string;
}

export interface WelcomeEmailJob {
  email: string;
  name: string;
}

export interface PasswordResetEmailJob {
  email: string;
  name: string;
  resetToken: string;
  resetUrl: string;
}

export interface PasswordChangedEmailJob {
  email: string;
  name: string;
}

export interface NotificationEmailJob {
  email: string;
  subject: string;
  message: string;
}
