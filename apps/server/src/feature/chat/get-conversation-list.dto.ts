import { IsBoolean, IsOptional } from 'class-validator';

import { GetListDto } from '../../core/dto/get-list.dto';

export class GetConversationListDto extends GetListDto {
  @IsOptional()
  @IsBoolean()
  isArchived?: boolean;
}
