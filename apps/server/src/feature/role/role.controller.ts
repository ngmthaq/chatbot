import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { Action } from '../rbac/action';
import { Module } from '../rbac/module';
import { Rbac } from '../rbac/rbac.decorator';

import { CreateRoleDto } from './create-role.dto';
import { GetRoleListDto } from './get-role-list.dto';
import { RoleIdParamForDeleteDto } from './role-id-param-for-delete.dto';
import { RoleIdParamForUpdateDto } from './role-id-param-for-update.dto';
import { RoleIdParamDto } from './role-id-param.dto';
import { RoleMultipleIdsParamForDeleteDto } from './role-multiple-ids-param-for-delete.dto';
import { RoleService } from './role.service';
import { UpdateRoleDto } from './update-role.dto';

@Controller('roles')
export class RoleController {
  public constructor(private readonly roleService: RoleService) {}

  @Get()
  @Rbac(Module.ROLES, Action.READ)
  public getRoleList(@Query() query: GetRoleListDto) {
    return this.roleService.getRoleList(query);
  }

  @Get(':id')
  @Rbac(Module.ROLES, Action.READ)
  public getRoleById(@Param() params: RoleIdParamDto) {
    return this.roleService.getRoleById(params);
  }

  @Post()
  @Rbac(Module.ROLES, Action.CREATE)
  public createRole(@Body() body: CreateRoleDto) {
    return this.roleService.createRole(body);
  }

  @Put(':id')
  @Rbac(Module.ROLES, Action.UPDATE)
  public updateRole(
    @Param() params: RoleIdParamForUpdateDto,
    @Body() body: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(params, body);
  }

  @Delete('multiple/:ids')
  @Rbac(Module.ROLES, Action.DELETE)
  public deleteMultipleRoles(
    @Param() params: RoleMultipleIdsParamForDeleteDto,
  ) {
    return this.roleService.deleteMultipleRoles(params);
  }

  @Delete(':id')
  @Rbac(Module.ROLES, Action.DELETE)
  public deleteRole(@Param() params: RoleIdParamForDeleteDto) {
    return this.roleService.deleteRole(params);
  }
}
