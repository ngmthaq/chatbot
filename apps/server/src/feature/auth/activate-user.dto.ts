import { IsNotEmpty, Validate } from 'class-validator';

import { IsTrimmedString } from '../../core/decorator/is-trimmed-string.decorator';
import { ExceptionDict } from '../../core/exception/exception-dict';
import { TokenShouldExist } from '../../core/validator/token-should-exist.validator';

export class ActivateUserDto {
  @Validate(TokenShouldExist)
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  token: string;
}
