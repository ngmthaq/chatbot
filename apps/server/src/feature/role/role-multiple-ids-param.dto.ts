import { IsNotEmpty, Validate } from 'class-validator';

import { IsTrimmedString } from '../../core/decorator/is-trimmed-string.decorator';
import { ExceptionDict } from '../../core/exception/exception-dict';
import { MultipleRoleIdsShouldExist } from '../../core/validator/multiple-role-ids-should-exist.validator';

export class RoleMultipleIdsParamDto {
  @Validate(MultipleRoleIdsShouldExist)
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  ids: string;
}
