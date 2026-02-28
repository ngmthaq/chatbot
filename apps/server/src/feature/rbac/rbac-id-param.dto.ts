import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Validate } from 'class-validator';

import { ExceptionDict } from '../../core/exception/exception-dict';
import { RbacIdShouldExist } from '../../core/validator/rbac-id-should-exist.validator';

export class RbacIdParamDto {
  @Validate(RbacIdShouldExist)
  @IsInt({ message: ExceptionDict.isInt() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  @Type(() => Number)
  id: number;
}
