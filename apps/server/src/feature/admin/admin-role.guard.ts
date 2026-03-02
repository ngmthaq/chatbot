import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { PrismaService } from '../../core/database/prisma.service';
import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { AuthRequest } from '../auth/auth-type';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const userId = request.authentication?.sub;

    if (!userId) {
      throw ExceptionBuilder.unauthorized({
        errors: ['User not authenticated'],
      });
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user || user.role.name !== 'ADMIN') {
      throw ExceptionBuilder.forbidden({
        errors: ['Admin role required'],
      });
    }

    return true;
  }
}
