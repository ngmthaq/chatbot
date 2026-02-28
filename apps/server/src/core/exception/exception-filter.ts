import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

import { Nullable } from '../../types/common';
import dayjs from '../../utils/date';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  public catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errors: Nullable<Record<string, string[]>> = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        errors = { message: [exceptionResponse] };
      } else if (typeof exceptionResponse === 'object') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = exceptionResponse as any;
        errors = res.errors ?? null;

        for (const key in errors) {
          if (Array.isArray(errors[key])) {
            try {
              errors[key] = errors[key].map((err) => JSON.parse(err));
            } catch {
              errors[key] = errors[key].map((err) => String(err));
            }
          }
        }
      }
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      const msg = `Internal Server Error: ${
        exception instanceof Error
          ? exception.message
          : JSON.stringify(exception)
      }`;
      this.logger.error(
        msg,
        exception instanceof Error ? exception.stack : undefined,
      );
    }

    response.status(status).json({
      statusCode: status,
      json: errors,
      timestamp: dayjs().toISOString(),
    });
  }
}
