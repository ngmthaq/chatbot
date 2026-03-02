import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { ExceptionDict } from '../../core/exception/exception-dict';

@Injectable()
export class FileValidationGuard implements CanActivate {
  private readonly allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
  ];

  private readonly maxFileSize = 50 * 1024 * 1024; // 50MB

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const file = (request as any).file;

    if (!file) {
      throw ExceptionBuilder.badRequest({
        errors: [ExceptionDict.isNotEmpty()],
      });
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw ExceptionBuilder.badRequest({
        errors: [ExceptionDict.invalidFileType()],
      });
    }

    if (file.size > this.maxFileSize) {
      throw ExceptionBuilder.badRequest({
        errors: [ExceptionDict.fileTooLarge()],
      });
    }

    return true;
  }
}
