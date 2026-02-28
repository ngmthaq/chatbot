import { IsNotEmpty, IsOptional, Validate } from 'class-validator';

import { IsTrimmedString } from '../../core/decorator/is-trimmed-string.decorator';
import { ExceptionDict } from '../../core/exception/exception-dict';
import { RoleNameShouldNotExist } from '../../core/validator/role-name-should-not-exist.validator';

export class CreateRoleDto {
  @Validate(RoleNameShouldNotExist)
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  name: string;

  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsOptional()
  description?: string;
}
