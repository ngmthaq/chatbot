import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsStrongPassword,
  Validate,
} from 'class-validator';

import { IsTrimmedString } from '../../core/decorator/is-trimmed-string.decorator';
import { ExceptionDict } from '../../core/exception/exception-dict';
import { RoleIdShouldExist } from '../../core/validator/role-id-should-exist.validator';
import { UserEmailShouldNotExist } from '../../core/validator/user-email-should-not-exist.validator';

import { strongPasswordConfig } from './strong-password-options';
import { UserGender } from './user-gender';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email (must be unique)',
  })
  @Validate(UserEmailShouldNotExist)
  @IsEmail({}, { message: ExceptionDict.isEmail() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  email!: string;

  @ApiProperty({ example: 1, description: 'Role ID' })
  @Validate(RoleIdShouldExist)
  @IsInt({ message: ExceptionDict.isInt() })
  @IsNotEmpty({ message: ExceptionDict.isNotEmpty() })
  roleId!: number;

  @ApiPropertyOptional({ example: 'John Doe', description: 'User full name' })
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    example: 'SecureP@ss123',
    description: 'User password',
  })
  @IsStrongPassword(strongPasswordConfig, {
    message: ExceptionDict.isStrongPassword(strongPasswordConfig),
  })
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsOptional()
  password?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Main St', description: 'Address' })
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    enum: ['male', 'female', 'other'],
    description: 'Gender',
  })
  @IsEnum(UserGender, {
    message: ExceptionDict.isEnum(UserGender),
  })
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsOptional()
  gender?: string;

  @ApiPropertyOptional({
    example: '1990-01-01',
    description: 'Date of birth (ISO format)',
  })
  @IsDateString({}, { message: ExceptionDict.isDateString() })
  @IsOptional()
  dateOfBirth?: string;
}
