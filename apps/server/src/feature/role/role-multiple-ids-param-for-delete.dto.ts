import { IsNotEmpty, Validate } from 'class-validator';

import { IsTrimmedString } from '../../core/decorator/is-trimmed-string.decorator';
import { ExceptionDict } from '../../core/exception/exception-dict';
import { MultipleIdsWithCsvStringFormat } from '../../core/validator/multiple-ids-with-csv-string-format.validator';
import { MultipleRoleIdsShouldExist } from '../../core/validator/multiple-role-ids-should-exist.validator';
import { MultipleRoleIdsShouldNotBeDefault } from '../../core/validator/multiple-role-ids-should-not-be-default.validator';
import { MultipleRoleIdsShouldNotHaveRelationships } from '../../core/validator/multiple-role-ids-should-not-have-relationships.validator';

export class RoleMultipleIdsParamForDeleteDto {
  @Validate(MultipleRoleIdsShouldNotHaveRelationships)
  @Validate(MultipleRoleIdsShouldNotBeDefault)
  @Validate(MultipleRoleIdsShouldExist)
  @Validate(MultipleIdsWithCsvStringFormat)
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  ids: string;
}
