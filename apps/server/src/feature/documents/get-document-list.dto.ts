import { IsEnum, IsOptional } from 'class-validator';

import { GetListDto } from '../../core/dto/get-list.dto';

export class GetDocumentListDto extends GetListDto {
  @IsOptional()
  @IsEnum(['pending', 'processing', 'completed', 'failed'])
  status?: string;
}
