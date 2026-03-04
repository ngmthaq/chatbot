import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

import { ExceptionDict } from '../../core/exception/exception-dict';

export class CreateConversationDto {
  @ApiProperty({
    example: 'My Research Chat',
    description: 'Conversation title',
  })
  @IsString({ message: ExceptionDict.isString() })
  title!: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Document ID to attach to conversation',
  })
  @IsOptional()
  @IsNumber({}, { message: ExceptionDict.isNumber() })
  documentId?: number;
}
