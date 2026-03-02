import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBase64 } from 'class-validator';

import { ExceptionDict } from '../../core/exception/exception-dict';

export class ProcessImageDto {
  @ApiProperty({
    example: 'base64encodedimagestring...',
    description: 'Base64 encoded image data',
  })
  @IsString({ message: ExceptionDict.isString() })
  @IsBase64()
  image!: string;

  @ApiProperty({
    example: 'What is in this image?',
    description: 'Question or prompt about the image',
  })
  @IsString({ message: ExceptionDict.isString() })
  prompt!: string;
}
