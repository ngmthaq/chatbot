import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, Validate } from 'class-validator';

import { ExceptionDict } from '../../core/exception/exception-dict';
import { RoleIdShouldExist } from '../../core/validator/role-id-should-exist.validator';

import { Action } from './action';
import { Module } from './module';

export class CreateRbacDto {
  @Validate(RoleIdShouldExist)
  @IsInt({ message: ExceptionDict.isInt() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  @Type(() => Number)
  roleId: number;

  @IsEnum(Module, { message: ExceptionDict.isEnum(Module) })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  module: Module;

  @IsEnum(Action, { message: ExceptionDict.isEnum(Action) })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  action: Action;
}
