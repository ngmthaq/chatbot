import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { PrismaService } from '../../core/database/prisma.service';
import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { ExceptionDict } from '../../core/exception/exception-dict';

export interface AuthRequest extends Request {
  authentication?: { sub: number };
}

@Injectable()
export class ConversationOwnershipGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<any>();
    const userId = request.authentication?.sub;
    const conversationId = Number(
      request.params.conversationId || request.body?.conversationId,
    );

    if (!conversationId || !userId) {
      throw ExceptionBuilder.badRequest({
        errors: [ExceptionDict.conversationNotFound()],
      });
    }

    const conversation = await this.prismaService.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation || conversation.userId !== userId) {
      throw ExceptionBuilder.forbidden({
        errors: [ExceptionDict.conversationAccessDenied()],
      });
    }

    return true;
  }
}
