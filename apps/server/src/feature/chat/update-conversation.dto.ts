import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

import { ExceptionDict } from '../../core/exception/exception-dict';

export class UpdateConversationDto {
  @ApiPropertyOptional({
    example: 'My Research Chat',
    description: 'Conversation title',
  })
  @IsOptional()
  @IsString({ message: ExceptionDict.isString() })
  title?: string;
}
