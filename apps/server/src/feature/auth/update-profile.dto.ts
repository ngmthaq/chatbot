import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';

import { IsTrimmedString } from '../../core/decorator/is-trimmed-string.decorator';
import { ExceptionDict } from '../../core/exception/exception-dict';
import { UserGender } from '../users/user-gender';

export class UpdateProfileDto {
  @ApiPropertyOptional({ example: 'John Doe', description: 'User full name' })
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: '+1234567890', description: 'Phone number' })
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Main St', description: 'Address' })
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    enum: UserGender,
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
