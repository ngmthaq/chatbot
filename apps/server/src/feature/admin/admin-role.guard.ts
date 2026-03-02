import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { PrismaService } from '../../core/database/prisma.service';
import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { ExceptionDict } from '../../core/exception/exception-dict';
import { AuthRequest } from '../auth/auth-type';
import { DefaultRole } from '../role/default-role';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();
    const userId = request.authentication?.sub;

    if (!userId) {
      throw ExceptionBuilder.unauthorized({
        errors: [ExceptionDict.userNotAuthenticated()],
      });
    }

    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    const adminRoles = [DefaultRole.ADMIN, DefaultRole.SUPER_ADMIN];
    if (!user || !adminRoles.includes(user.role.name as DefaultRole)) {
      throw ExceptionBuilder.forbidden({
        errors: [ExceptionDict.adminRoleRequired()],
      });
    }

    return true;
  }
}
