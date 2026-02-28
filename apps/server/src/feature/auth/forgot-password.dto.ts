import { IsEmail, IsNotEmpty, Validate } from 'class-validator';

import { ExceptionDict } from '../../core/exception/exception-dict';
import { UserEmailShouldExist } from '../../core/validator/user-email-should-exist.validator';

export class ForgotPasswordDto {
  @Validate(UserEmailShouldExist)
  @IsEmail({}, { message: ExceptionDict.isEmail() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  email: string;
}
