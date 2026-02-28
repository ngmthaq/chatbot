import { Injectable } from '@nestjs/common';

import { Prisma } from '../../../prisma-generated/client';
import { PrismaService } from '../../core/database/prisma.service';
import { ResponseBuilder } from '../../core/response/response-builder';
import { buildPrismaGetListQuery } from '../../utils/prisma';

import { Action } from './action';
import { CreateRbacDto } from './create-rbac.dto';
import { GetRbacListDto } from './get-rbac-list.dto';
import { Module } from './module';
import { RbacIdParamDto } from './rbac-id-param.dto';
import { RbacMultipleIdsParamDto } from './rbac-multiple-ids-param.dto';
import { RbacRoleIdParamDto } from './rbac-role-id-param.dto';
import { UpdateRbacDto } from './update-rbac.dto';

@Injectable()
export class RbacService {
  public constructor(private readonly prismaService: PrismaService) {}

  public async getRbacList(params: GetRbacListDto) {
    const builder = buildPrismaGetListQuery<Prisma.RbacFindManyArgs>(params);
    builder.where = { OR: [] };

    if (params.search) {
      builder.where.OR.push({ module: { contains: params.search } });
      builder.where.OR.push({ action: { contains: params.search } });
      builder.where.OR.push({ role: { name: { contains: params.search } } });
    }

    if (params.roleId !== undefined) {
      builder.where.roleId = params.roleId;
    }

    if (params.module !== undefined) {
      builder.where.module = params.module;
    }

    if (params.action !== undefined) {
      builder.where.action = params.action;
    }

    const rbacList = await this.prismaService.rbac.findMany(builder);
    return ResponseBuilder.data(rbacList);
  }

  public async getRbacById(params: RbacIdParamDto) {
    const rbac = await this.prismaService.rbac.findFirst({
      where: { id: params.id },
    });
    return ResponseBuilder.data(rbac);
  }

  public async createRbac(data: CreateRbacDto) {
    const rbac = await this.prismaService.rbac.create({
      data: {
        roleId: data.roleId,
        module: data.module,
        action: data.action,
      },
    });
    return ResponseBuilder.data(rbac);
  }

  public async updateRbac(params: RbacIdParamDto, data: UpdateRbacDto) {
    const rbac = await this.prismaService.rbac.update({
      where: { id: params.id },
      data: {
        roleId: data.roleId,
        module: data.module,
        action: data.action,
      },
    });
    return ResponseBuilder.data(rbac);
  }

  public async deleteRbac(params: RbacIdParamDto) {
    const rbac = await this.prismaService.rbac.delete({
      where: { id: params.id },
    });
    return ResponseBuilder.data(rbac);
  }

  public async deleteMultipleRbac(params: RbacMultipleIdsParamDto) {
    const ids = params.ids.split(',').map((id) => +id);
    const result = await this.prismaService.rbac.deleteMany({
      where: { id: { in: ids } },
    });
    return ResponseBuilder.data({ deletedCount: result.count });
  }

  public getModules() {
    return ResponseBuilder.data(Object.values(Module));
  }

  public getActions() {
    return ResponseBuilder.data(Object.values(Action));
  }

  public async getRbacByRoleId(params: RbacRoleIdParamDto) {
    const rbacList = await this.prismaService.rbac.findMany({
      where: { roleId: params.roleId },
    });
    return ResponseBuilder.data(rbacList);
  }
}
