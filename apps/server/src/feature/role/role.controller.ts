import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';

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

@ApiTags('Roles')
@ApiBearerAuth()
@Controller('roles')
@UseGuards(ThrottlerGuard)
export class RoleController {
  public constructor(private readonly roleService: RoleService) {}

  @Get()
  @Rbac(Module.ROLES, Action.READ)
  @ApiOperation({ summary: 'Get roles', description: 'Get list of all roles' })
  @ApiResponse({ status: 200, description: 'Roles retrieved successfully' })
  public getRoleList(@Query() query: GetRoleListDto) {
    return this.roleService.getRoleList(query);
  }

  @Get(':id')
  @Rbac(Module.ROLES, Action.READ)
  @ApiOperation({
    summary: 'Get role by ID',
    description: 'Get role details by ID',
  })
  @ApiParam({ name: 'id', description: 'Role ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Role retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  public getRoleById(@Param() params: RoleIdParamDto) {
    return this.roleService.getRoleById(params);
  }

  @Post()
  @Rbac(Module.ROLES, Action.CREATE)
  @ApiOperation({ summary: 'Create role', description: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 400, description: 'Role name already exists' })
  public createRole(@Body() body: CreateRoleDto) {
    return this.roleService.createRole(body);
  }

  @Put(':id')
  @Rbac(Module.ROLES, Action.UPDATE)
  @ApiOperation({
    summary: 'Update role',
    description: 'Update role information',
  })
  @ApiParam({ name: 'id', description: 'Role ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  public updateRole(
    @Param() params: RoleIdParamForUpdateDto,
    @Body() body: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(params, body);
  }

  @Delete('multiple/:ids')
  @Rbac(Module.ROLES, Action.DELETE)
  @ApiOperation({
    summary: 'Delete multiple roles',
    description: 'Delete multiple roles by IDs',
  })
  @ApiParam({
    name: 'ids',
    description: 'Comma-separated role IDs',
    example: '1,2,3',
  })
  @ApiResponse({ status: 200, description: 'Roles deleted successfully' })
  public deleteMultipleRoles(
    @Param() params: RoleMultipleIdsParamForDeleteDto,
  ) {
    return this.roleService.deleteMultipleRoles(params);
  }

  @Delete(':id')
  @Rbac(Module.ROLES, Action.DELETE)
  @ApiOperation({ summary: 'Delete role', description: 'Delete a role by ID' })
  @ApiParam({ name: 'id', description: 'Role ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  public deleteRole(@Param() params: RoleIdParamForDeleteDto) {
    return this.roleService.deleteRole(params);
  }
}
