import { HttpStatus } from '@nestjs/common';

import { Exception } from './exception';

export class ExceptionBuilder {
  public static badRequest(errors?: Record<string, string[]>) {
    return new Exception(HttpStatus.BAD_REQUEST, errors);
  }

  public static unauthorized(errors?: Record<string, string[]>) {
    return new Exception(HttpStatus.UNAUTHORIZED, errors);
  }

  public static forbidden(errors?: Record<string, string[]>) {
    return new Exception(HttpStatus.FORBIDDEN, errors);
  }

  public static notFound(errors?: Record<string, string[]>) {
    return new Exception(HttpStatus.NOT_FOUND, errors);
  }

  public static internalServerError(errors?: Record<string, string[]>) {
    return new Exception(HttpStatus.INTERNAL_SERVER_ERROR, errors);
  }

  public static serviceUnavailable(errors?: Record<string, string[]>) {
    return new Exception(HttpStatus.SERVICE_UNAVAILABLE, errors);
  }
}
