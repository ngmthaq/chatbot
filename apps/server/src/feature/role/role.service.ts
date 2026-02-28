import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../prisma-generated/client';
import { PrismaService } from '../../core/database/prisma.service';
import { ResponseBuilder } from '../../core/response/response-builder';
import { buildPrismaGetListQuery } from '../../utils/prisma';

import { CreateRoleDto } from './create-role.dto';
import { GetRoleListDto } from './get-role-list.dto';
import { RoleIdParamForDeleteDto } from './role-id-param-for-delete.dto';
import { RoleIdParamForUpdateDto } from './role-id-param-for-update.dto';
import { RoleIdParamDto } from './role-id-param.dto';
import { RoleMultipleIdsParamForDeleteDto } from './role-multiple-ids-param-for-delete.dto';
import { UpdateRoleDto } from './update-role.dto';

@Injectable()
export class RoleService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getRoleList(params: GetRoleListDto) {
    const builder = buildPrismaGetListQuery<Prisma.RoleFindManyArgs>(params);
    builder.where = { OR: [] };

    if (params.search) {
      builder.where.OR.push({ name: { contains: params.search } });
      builder.where.OR.push({ description: { contains: params.search } });
    }

    if (params.name !== undefined) {
      builder.where.name = { contains: params.name };
    }

    const roles = await this.prismaService.role.findMany(builder);
    return ResponseBuilder.data(roles);
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
    const role = await this.prismaService.role.delete({
      where: { id: params.id },
    });
    return ResponseBuilder.data(role);
  }

  public async deleteMultipleRoles(params: RoleMultipleIdsParamForDeleteDto) {
    const ids = params.ids.split(',').map((id) => +id);
    const result = await this.prismaService.role.deleteMany({
      where: { id: { in: ids } },
    });
    return ResponseBuilder.data({ deletedCount: result.count });
  }
}
