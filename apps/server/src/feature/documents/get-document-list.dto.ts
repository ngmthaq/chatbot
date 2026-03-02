import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { GetListDto } from '../../core/dto/get-list.dto';

export class GetDocumentListDto extends GetListDto {
  @ApiPropertyOptional({
    enum: ['pending', 'processing', 'completed', 'failed'],
    description: 'Filter by document processing status',
  })
  @IsOptional()
  @IsEnum(['pending', 'processing', 'completed', 'failed'])
  status?: string;
}
