import { IsNotEmpty, IsStrongPassword, Validate } from 'class-validator';

import { IsTrimmedString } from '../../core/decorator/is-trimmed-string.decorator';
import { ExceptionDict } from '../../core/exception/exception-dict';
import { TokenShouldExist } from '../../core/validator/token-should-exist.validator';
import { strongPasswordConfig } from '../users/strong-password-options';

export class ResetPasswordDto {
  @Validate(TokenShouldExist)
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  token: string;

  @IsStrongPassword(strongPasswordConfig, {
    message: ExceptionDict.isStrongPassword(strongPasswordConfig),
  })
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  newPassword: string;
}
