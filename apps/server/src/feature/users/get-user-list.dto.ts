import { IsBoolean, IsOptional } from 'class-validator';

import { GetListDto } from '../../core/dto/get-list.dto';
import { ExceptionDict } from '../../core/exception/exception-dict';

export class GetUserListDto extends GetListDto {
  @IsBoolean({ message: ExceptionDict.isBoolean() })
  @IsOptional()
  isActivated?: boolean;
}
