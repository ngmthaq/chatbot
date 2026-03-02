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

@Controller('rbac')
@UseGuards(ThrottlerGuard)
export class RbacController {
  public constructor(private readonly rbacService: RbacService) {}

  @Get()
  @Rbac(Module.RBAC, Action.READ)
  public getRbacList(@Query() query: GetRbacListDto) {
    return this.rbacService.getRbacList(query);
  }

  @Get('modules')
  @Public()
  public getModules() {
    return this.rbacService.getModules();
  }

  @Get('actions')
  @Public()
  public getActions() {
    return this.rbacService.getActions();
  }

  @Get('role/:roleId')
  @Rbac(Module.RBAC, Action.READ)
  public getRbacByRoleId(@Param() params: RbacRoleIdParamDto) {
    return this.rbacService.getRbacByRoleId(params);
  }

  @Get(':id')
  @Rbac(Module.RBAC, Action.READ)
  public getRbacById(@Param() params: RbacIdParamDto) {
    return this.rbacService.getRbacById(params);
  }

  @Post()
  @Rbac(Module.RBAC, Action.CREATE)
  public createRbac(@Body() body: CreateRbacDto) {
    return this.rbacService.createRbac(body);
  }

  @Put(':id')
  @Rbac(Module.RBAC, Action.UPDATE)
  public updateRbac(
    @Param() params: RbacIdParamDto,
    @Body() body: UpdateRbacDto,
  ) {
    return this.rbacService.updateRbac(params, body);
  }

  @Delete('multiple/:ids')
  @Rbac(Module.RBAC, Action.DELETE)
  public deleteMultipleRbac(@Param() params: RbacMultipleIdsParamDto) {
    return this.rbacService.deleteMultipleRbac(params);
  }

  @Delete(':id')
  @Rbac(Module.RBAC, Action.DELETE)
  public deleteRbac(@Param() params: RbacIdParamDto) {
    return this.rbacService.deleteRbac(params);
  }
}
