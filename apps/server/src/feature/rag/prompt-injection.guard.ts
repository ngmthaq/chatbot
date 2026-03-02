import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { ExceptionDict } from '../../core/exception/exception-dict';

@Injectable()
export class PromptInjectionGuard implements CanActivate {
  // Suspicious patterns that might indicate prompt injection
  private readonly suspiciousPatterns = [
    /ignore previous instructions/gi,
    /system prompt/gi,
    /role-play as/gi,
    /pretend you are/gi,
    /forget about/gi,
    /disregard the system/gi,
    /execute this command/gi,
    /act as if/gi,
    /simulate/gi,
    /you are now/gi,
  ];

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { content } = request.body || {};

    if (!content) return true;

    const userContent = String(content).toLowerCase();

    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(userContent)) {
        throw ExceptionBuilder.badRequest({
          errors: [ExceptionDict.promptInjectionDetected()],
        });
      }
    }

    return true;
  }
}
