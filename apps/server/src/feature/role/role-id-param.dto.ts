import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Validate } from 'class-validator';

import { ExceptionDict } from '../../core/exception/exception-dict';
import { RoleIdShouldExist } from '../../core/validator/role-id-should-exist.validator';

export class RoleIdParamDto {
  @Validate(RoleIdShouldExist)
  @IsInt({ message: ExceptionDict.isInt() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  @Type(() => Number)
  id: number;
}
