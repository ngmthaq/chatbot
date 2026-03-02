import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

import { ExceptionDict } from '../../core/exception/exception-dict';

export class CreateMessageDto {
  @ApiProperty({
    example: 'What is machine learning?',
    description: 'Message content',
    maxLength: 8000,
  })
  @IsString({ message: ExceptionDict.isString() })
  @MaxLength(8000, { message: ExceptionDict.messageTooLong() })
  content!: string;
}
