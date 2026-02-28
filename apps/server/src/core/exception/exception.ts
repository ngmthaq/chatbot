import { HttpException } from '@nestjs/common';

export class Exception extends HttpException {
  public constructor(status: number, errors?: Record<string, string[]>) {
    super({ errors: errors ?? null }, status);
  }
}
