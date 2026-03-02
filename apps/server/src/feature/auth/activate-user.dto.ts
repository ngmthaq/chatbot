import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Validate } from 'class-validator';

import { IsTrimmedString } from '../../core/decorator/is-trimmed-string.decorator';
import { ExceptionDict } from '../../core/exception/exception-dict';
import { TokenShouldExist } from '../../core/validator/token-should-exist.validator';

export class ActivateUserDto {
  @ApiProperty({
    example: 'abc123def456',
    description: 'Activation token from email',
  })
  @Validate(TokenShouldExist)
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  token!: string;
}
