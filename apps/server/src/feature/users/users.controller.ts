import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import { Action } from '../rbac/action';
import { Module } from '../rbac/module';
import { Rbac } from '../rbac/rbac.decorator';

import { CreateUserDto } from './create-user.dto';
import { GetUserListDto } from './get-user-list.dto';
import { IdParamDto } from './id-param.dto';
import { MultipleIdsParamDto } from './multiple-ids-param.dto';
import { UpdateUserDto } from './update-user.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(ThrottlerGuard)
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Get()
  @Rbac(Module.USERS, Action.READ)
  @ApiOperation({
    summary: 'Get users',
    description: 'Get list of all users (admin only)',
  })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  public getUsers(@Param() params: GetUserListDto) {
    return this.usersService.getUsers(params);
  }

  @Get('genders')
  @Public()
  @ApiOperation({
    summary: 'Get genders',
    description: 'Get list of available gender options',
  })
  @ApiResponse({ status: 200, description: 'Genders retrieved successfully' })
  public getUserGenders() {
    return this.usersService.getUserGenders();
  }

  @Get(':id')
  @Rbac(Module.USERS, Action.READ)
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Get user details by ID',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  public getUserById(@Param() params: IdParamDto) {
    return this.usersService.getUserById(params);
  }

  @Post()
  @Rbac(Module.USERS, Action.CREATE)
  @ApiOperation({ summary: 'Create user', description: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Email already exists' })
  public createUser(@Body() body: CreateUserDto) {
    return this.usersService.createUser(body);
  }

  @Put('lock/:id')
  @Rbac(Module.USERS, Action.LOCK_UNLOCK)
  @ApiOperation({ summary: 'Lock user', description: 'Lock user account' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'User locked successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  public lockUser(@Param() params: IdParamDto) {
    return this.usersService.lockUser(params);
  }

  @Put('unlock/:id')
  @Rbac(Module.USERS, Action.LOCK_UNLOCK)
  @ApiOperation({ summary: 'Unlock user', description: 'Unlock user account' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'User unlocked successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  public unlockUser(@Param() params: IdParamDto) {
    return this.usersService.unlockUser(params);
  }

  @Put(':id')
  @Rbac(Module.USERS, Action.UPDATE)
  @ApiOperation({
    summary: 'Update user',
    description: 'Update user information',
  })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  public updateUser(@Param() params: IdParamDto, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(params, body);
  }

  @Delete('multiple/:ids')
  @Rbac(Module.USERS, Action.DELETE)
  @ApiOperation({
    summary: 'Delete multiple users',
    description: 'Delete multiple users by IDs',
  })
  @ApiParam({
    name: 'ids',
    description: 'Comma-separated user IDs',
    example: '1,2,3',
  })
  @ApiResponse({ status: 200, description: 'Users deleted successfully' })
  public deleteMultipleUsers(@Param() params: MultipleIdsParamDto) {
    return this.usersService.deleteMultipleUsers(params);
  }

  @Delete(':id')
  @Rbac(Module.USERS, Action.DELETE)
  @ApiOperation({ summary: 'Delete user', description: 'Delete a user by ID' })
  @ApiParam({ name: 'id', description: 'User ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  public deleteUser(@Param() params: IdParamDto) {
    return this.usersService.deleteUser(params);
  }
}
