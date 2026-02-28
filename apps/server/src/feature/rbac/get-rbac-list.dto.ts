import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Validate } from 'class-validator';

import { GetListDto } from '../../core/dto/get-list.dto';
import { ExceptionDict } from '../../core/exception/exception-dict';
import { RoleIdShouldExist } from '../../core/validator/role-id-should-exist.validator';

import { Action } from './action';
import { Module } from './module';

export class GetRbacListDto extends GetListDto {
  @Validate(RoleIdShouldExist)
  @IsInt({ message: ExceptionDict.isInt() })
  @IsOptional()
  @Type(() => Number)
  roleId?: number;

  @IsEnum(Module, { message: ExceptionDict.isEnum(Module) })
  @IsOptional()
  module?: Module;

  @IsEnum(Action, { message: ExceptionDict.isEnum(Action) })
  @IsOptional()
  action?: Action;
}
