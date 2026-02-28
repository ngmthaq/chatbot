import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, Validate } from 'class-validator';

import { ExceptionDict } from '../../core/exception/exception-dict';
import { RoleIdShouldExist } from '../../core/validator/role-id-should-exist.validator';
import { RoleIdShouldNotBeDefault } from '../../core/validator/role-id-should-not-be-default.validator';
import { RoleIdShouldNotHaveRelationships } from '../../core/validator/role-id-should-not-have-relationships.validator';

export class RoleIdParamForDeleteDto {
  @Validate(RoleIdShouldNotHaveRelationships)
  @Validate(RoleIdShouldNotBeDefault)
  @Validate(RoleIdShouldExist)
  @IsInt({ message: ExceptionDict.isInt() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  @Type(() => Number)
  id: number;
}
