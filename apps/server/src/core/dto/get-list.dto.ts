import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

import { IsTrimmedString } from '../decorator/is-trimmed-string.decorator';
import { ExceptionDict } from '../exception/exception-dict';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetListDto {
  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsOptional()
  search?: string;

  @IsTrimmedString({ message: ExceptionDict.isString() })
  @IsOptional()
  sortField?: string;

  @IsEnum(SortOrder, { message: ExceptionDict.isEnum(SortOrder) })
  @IsOptional()
  sortOrder?: SortOrder;

  @Type(() => Number)
  @IsInt({ message: ExceptionDict.isInt() })
  @IsOptional()
  page?: number;

  @Type(() => Number)
  @IsInt({ message: ExceptionDict.isInt() })
  @IsOptional()
  limit?: number;
}
