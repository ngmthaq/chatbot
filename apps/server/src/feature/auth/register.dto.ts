import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  Validate,
} from 'class-validator';

import { IsTrimmedString } from '../../core/decorator/is-trimmed-string.decorator';
import { ExceptionDict } from '../../core/exception/exception-dict';
import { UserEmailShouldNotExist } from '../../core/validator/user-email-should-not-exist.validator';
import { strongPasswordConfig } from '../users/strong-password-options';

export class RegisterDto {
  @ApiProperty({
    example: 'newuser@example.com',
    description: 'User email address (must be unique)',
  })
  @Validate(UserEmailShouldNotExist)
  @IsEmail({}, { message: ExceptionDict.isEmail() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  email!: string;

  @ApiProperty({
    example: 'SecureP@ss123',
    description: 'Strong password (min 8 chars, upper/lower/number/symbol)',
  })
  @IsStrongPassword(strongPasswordConfig, {
    message: ExceptionDict.isStrongPassword(strongPasswordConfig),
  })
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  password!: string;
}
