import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { PrismaService } from '../../core/database/prisma.service';
import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { AuthRequest } from '../auth/auth-type';

import { Action } from './action';
import { Module } from './module';
import { RBAC_KEY } from './rbac.decorator';

@Injectable()
export class RbacGuard implements CanActivate {
  public constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  public async canActivate(context: ExecutionContext) {
    const rbac = this.reflector.getAllAndOverride<string>(RBAC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!rbac) return true;

    const request = context.switchToHttp().getRequest();
    const payload = request['authentication'] as AuthRequest['authentication'];
    const user = await this.prismaService.user.findFirst({
      where: { id: payload.sub },
    });

    if (!user) throw ExceptionBuilder.unauthorized();

    const { module, action } = JSON.parse(rbac) as {
      module: Module;
      action: Action;
    };

    const rolePermissions = await this.prismaService.rbac.findFirst({
      where: { roleId: user.roleId, module, action },
    });

    if (!rolePermissions) throw ExceptionBuilder.forbidden();

    return true;
  }
}
