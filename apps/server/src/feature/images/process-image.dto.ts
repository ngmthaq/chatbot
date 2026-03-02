import { IsString, IsBase64 } from 'class-validator';

import { ExceptionDict } from '../../core/exception/exception-dict';

export class ProcessImageDto {
  @IsString({ message: ExceptionDict.isString() })
  @IsBase64()
  image!: string;

  @IsString({ message: ExceptionDict.isString() })
  prompt!: string;
}
