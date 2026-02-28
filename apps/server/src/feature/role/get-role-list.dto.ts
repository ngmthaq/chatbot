import { IsOptional } from 'class-validator';

import { IsTrimmedString } from '../../core/decorator/is-trimmed-string.decorator';
import { GetListDto } from '../../core/dto/get-list.dto';
import { ExceptionDict } from '../../core/exception/exception-dict';

export class GetRoleListDto extends GetListDto {
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsOptional()
  name?: string;
}
