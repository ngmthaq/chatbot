import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../prisma-generated/client';
import { PrismaService } from '../../core/database/prisma.service';
import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { ExceptionDict } from '../../core/exception/exception-dict';
import { ResponseBuilder } from '../../core/response/response-builder';
import { buildPrismaGetListQuery } from '../../utils/prisma';

import { CreateRoleDto } from './create-role.dto';
import { DefaultRole } from './default-role';
import { GetRoleListDto } from './get-role-list.dto';
import { RoleIdParamForDeleteDto } from './role-id-param-for-delete.dto';
import { RoleIdParamForUpdateDto } from './role-id-param-for-update.dto';
import { RoleIdParamDto } from './role-id-param.dto';
import { RoleMultipleIdsParamForDeleteDto } from './role-multiple-ids-param-for-delete.dto';
import { UpdateRoleDto } from './update-role.dto';

@Injectable()
export class RoleService {
  public constructor(private readonly prismaService: PrismaService) {}

  private isDefaultRole(roleName: string) {
    const defaultRoleNames = Object.values(DefaultRole) as string[];
    return defaultRoleNames.includes(roleName);
  }

  private getIsDefaultOrProtected(role: {
    name: string;
    _count?: { users: number; rbac: number };
  }) {
    if (this.isDefaultRole(role.name)) {
      return true;
    }

    if (!role._count) {
      return false;
    }

    return role._count.users > 0 || role._count.rbac > 0;
  }

  private async validateCanDeleteRole(id: number) {
    const role = await this.prismaService.role.findFirst({
      where: { id },
      include: {
        _count: {
          select: {
            users: true,
            rbac: true,
          },
        },
      },
    });

    if (!role) {
      return;
    }

    if (this.isDefaultRole(role.name)) {
      throw ExceptionBuilder.forbidden({
        errors: [ExceptionDict.roleIdShouldNotBeDefault()],
      });
    }

    if (this.getIsDefaultOrProtected(role)) {
      throw ExceptionBuilder.forbidden({
        errors: [ExceptionDict.roleIdShouldNotHaveRelationships()],
      });
    }
  }

  public async getRoleList(params: GetRoleListDto) {
    const builder = buildPrismaGetListQuery<Prisma.RoleFindManyArgs>(params);

    if (params.search || params.name !== undefined) {
      builder.where = {};

      if (params.search) {
        builder.where.OR = [
          { name: { contains: params.search } },
          { description: { contains: params.search } },
        ];
      }

      if (params.name !== undefined) {
        builder.where.name = { contains: params.name };
      }
    }

    // Include counts for users and rbac to show in UI
    builder.include = {
      _count: {
        select: {
          users: true,
          rbac: true,
        },
      },
    };

    const roles = await this.prismaService.role.findMany(builder);
    const rolesWithIsDefault = roles.map((role) => ({
      ...role,
      isDefault: this.getIsDefaultOrProtected(role),
    }));
    return ResponseBuilder.data(rolesWithIsDefault);
  }

  public async getRoleById(params: RoleIdParamDto) {
    const role = await this.prismaService.role.findFirst({
      where: { id: params.id },
    });
    return ResponseBuilder.data(role);
  }

  public async createRole(data: CreateRoleDto) {
    const role = await this.prismaService.role.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });
    return ResponseBuilder.data(role);
  }

  public async updateRole(
    params: RoleIdParamForUpdateDto,
    data: UpdateRoleDto,
  ) {
    const role = await this.prismaService.role.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
      },
    });
    return ResponseBuilder.data(role);
  }

  public async deleteRole(params: RoleIdParamForDeleteDto) {
    await this.validateCanDeleteRole(params.id);

    const role = await this.prismaService.role.delete({
      where: { id: params.id },
    });
    return ResponseBuilder.data(role);
  }

  public async deleteMultipleRoles(params: RoleMultipleIdsParamForDeleteDto) {
    const ids = params.ids.split(',').map((id) => +id);

    await Promise.all(ids.map((id) => this.validateCanDeleteRole(id)));

    const result = await this.prismaService.role.deleteMany({
      where: { id: { in: ids } },
    });
    return ResponseBuilder.data({ deletedCount: result.count });
  }
}
