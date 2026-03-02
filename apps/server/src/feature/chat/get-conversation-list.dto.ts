import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';

import { GetListDto } from '../../core/dto/get-list.dto';

export class GetConversationListDto extends GetListDto {
  @ApiPropertyOptional({
    example: false,
    description: 'Filter by archived status',
  })
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}
