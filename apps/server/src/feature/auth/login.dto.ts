import { IsEmail, IsNotEmpty } from 'class-validator';

import { IsTrimmedString } from '../../core/decorator/is-trimmed-string.decorator';
import { ExceptionDict } from '../../core/exception/exception-dict';

export class LoginDto {
  @IsEmail({}, { message: ExceptionDict.isEmail() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  email: string;

  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  password: string;
}
