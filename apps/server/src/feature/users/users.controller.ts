import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { Public } from '../auth/public.decorator';
import { Action } from '../rbac/action';
import { Module } from '../rbac/module';
import { Rbac } from '../rbac/rbac.decorator';

import { CreateUserDto } from './create-user.dto';
import { GetUserListDto } from './get-user-list.dto';
import { IdParamDto } from './id-param.dto';
import { MultipleIdsParamDto } from './multiple-ids-param.dto';
import { UpdateUserDto } from './update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Get()
  @Rbac(Module.USERS, Action.READ)
  public getUsers(@Param() params: GetUserListDto) {
    return this.usersService.getUsers(params);
  }

  @Get('genders')
  @Public()
  public getUserGenders() {
    return this.usersService.getUserGenders();
  }

  @Get(':id')
  @Rbac(Module.USERS, Action.READ)
  public getUserById(@Param() params: IdParamDto) {
    return this.usersService.getUserById(params);
  }

  @Post()
  @Rbac(Module.USERS, Action.CREATE)
  public createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Put('lock/:id')
  @Rbac(Module.USERS, Action.LOCK_UNLOCK)
  public lockUser(@Param() params: IdParamDto) {
    return this.usersService.lockUser(params);
  }

  @Put('unlock/:id')
  @Rbac(Module.USERS, Action.LOCK_UNLOCK)
  public unlockUser(@Param() params: IdParamDto) {
    return this.usersService.unlockUser(params);
  }

  @Put(':id')
  @Rbac(Module.USERS, Action.UPDATE)
  public updateUser(@Param() params: IdParamDto, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(params, body);
  }

  @Delete('multiple/:ids')
  @Rbac(Module.USERS, Action.DELETE)
  public deleteMultipleUsers(@Param() params: MultipleIdsParamDto) {
    return this.usersService.deleteMultipleUsers(params);
  }

  @Delete(':id')
  @Rbac(Module.USERS, Action.DELETE)
  public deleteUser(@Param() params: IdParamDto) {
    return this.usersService.deleteUser(params);
  }
}
