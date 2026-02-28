import { IsNotEmpty, Validate } from 'class-validator';

import { IsTrimmedString } from '../../core/decorator/is-trimmed-string.decorator';
import { ExceptionDict } from '../../core/exception/exception-dict';
import { MultipleIdsWithCsvStringFormat } from '../../core/validator/multiple-ids-with-csv-string-format.validator';
import { MultipleUserIdsShouldExist } from '../../core/validator/multiple-user-ids-should-exist.validator';

export class MultipleIdsParamDto {
  @Validate(MultipleUserIdsShouldExist)
  @Validate(MultipleIdsWithCsvStringFormat)
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  ids: string;
}
