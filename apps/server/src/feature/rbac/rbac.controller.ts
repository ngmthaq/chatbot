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

import { Public } from '../auth/public.decorator';

import { Action } from './action';
import { CreateRbacDto } from './create-rbac.dto';
import { GetRbacListDto } from './get-rbac-list.dto';
import { Module } from './module';
import { RbacIdParamDto } from './rbac-id-param.dto';
import { RbacMultipleIdsParamDto } from './rbac-multiple-ids-param.dto';
import { RbacRoleIdParamDto } from './rbac-role-id-param.dto';
import { Rbac } from './rbac.decorator';
import { RbacService } from './rbac.service';
import { UpdateRbacDto } from './update-rbac.dto';

@ApiTags('RBAC')
@ApiBearerAuth()
@Controller('rbac')
@UseGuards(ThrottlerGuard)
export class RbacController {
  public constructor(private readonly rbacService: RbacService) {}

  @Get()
  @Rbac(Module.RBAC, Action.READ)
  @ApiOperation({
    summary: 'Get RBAC permissions',
    description: 'Get list of all RBAC permissions',
  })
  @ApiResponse({
    status: 200,
    description: 'RBAC permissions retrieved successfully',
  })
  public getRbacList(@Query() query: GetRbacListDto) {
    return this.rbacService.getRbacList(query);
  }

  @Get('modules')
  @Public()
  @ApiOperation({
    summary: 'Get modules',
    description: 'Get list of available modules',
  })
  @ApiResponse({ status: 200, description: 'Modules retrieved successfully' })
  public getModules() {
    return this.rbacService.getModules();
  }

  @Get('actions')
  @Public()
  @ApiOperation({
    summary: 'Get actions',
    description: 'Get list of available actions',
  })
  @ApiResponse({ status: 200, description: 'Actions retrieved successfully' })
  public getActions() {
    return this.rbacService.getActions();
  }

  @Get('role/:roleId')
  @Rbac(Module.RBAC, Action.READ)
  @ApiOperation({
    summary: 'Get RBAC by role',
    description: 'Get all permissions for specific role',
  })
  @ApiParam({ name: 'roleId', description: 'Role ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'RBAC permissions retrieved successfully',
  })
  public getRbacByRoleId(@Param() params: RbacRoleIdParamDto) {
    return this.rbacService.getRbacByRoleId(params);
  }

  @Get(':id')
  @Rbac(Module.RBAC, Action.READ)
  @ApiOperation({
    summary: 'Get RBAC by ID',
    description: 'Get RBAC permission by ID',
  })
  @ApiParam({ name: 'id', description: 'RBAC ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'RBAC permission retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'RBAC permission not found' })
  public getRbacById(@Param() params: RbacIdParamDto) {
    return this.rbacService.getRbacById(params);
  }

  @Post()
  @Rbac(Module.RBAC, Action.CREATE)
  @ApiOperation({
    summary: 'Create RBAC permission',
    description: 'Create new RBAC permission',
  })
  @ApiResponse({
    status: 201,
    description: 'RBAC permission created successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid permission configuration' })
  public createRbac(@Body() body: CreateRbacDto) {
    return this.rbacService.createRbac(body);
  }

  @Put(':id')
  @Rbac(Module.RBAC, Action.UPDATE)
  @ApiOperation({
    summary: 'Update RBAC permission',
    description: 'Update RBAC permission',
  })
  @ApiParam({ name: 'id', description: 'RBAC ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'RBAC permission updated successfully',
  })
  @ApiResponse({ status: 404, description: 'RBAC permission not found' })
  public updateRbac(
    @Param() params: RbacIdParamDto,
    @Body() body: UpdateRbacDto,
  ) {
    return this.rbacService.updateRbac(params, body);
  }

  @Delete('multiple/:ids')
  @Rbac(Module.RBAC, Action.DELETE)
  @ApiOperation({
    summary: 'Delete multiple RBAC',
    description: 'Delete multiple RBAC permissions by IDs',
  })
  @ApiParam({
    name: 'ids',
    description: 'Comma-separated RBAC IDs',
    example: '1,2,3',
  })
  @ApiResponse({
    status: 200,
    description: 'RBAC permissions deleted successfully',
  })
  public deleteMultipleRbac(@Param() params: RbacMultipleIdsParamDto) {
    return this.rbacService.deleteMultipleRbac(params);
  }

  @Delete(':id')
  @Rbac(Module.RBAC, Action.DELETE)
  @ApiOperation({
    summary: 'Delete RBAC permission',
    description: 'Delete RBAC permission by ID',
  })
  @ApiParam({ name: 'id', description: 'RBAC ID', type: 'number' })
  @ApiResponse({
    status: 200,
    description: 'RBAC permission deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'RBAC permission not found' })
  public deleteRbac(@Param() params: RbacIdParamDto) {
    return this.rbacService.deleteRbac(params);
  }
}
