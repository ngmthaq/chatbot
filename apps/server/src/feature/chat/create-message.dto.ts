import { IsString, IsNumber, MaxLength } from 'class-validator';

import { ExceptionDict } from '../../core/exception/exception-dict';

export class CreateMessageDto {
  @IsNumber({}, { message: ExceptionDict.isNumber() })
  conversationId!: number;

  @IsString({ message: ExceptionDict.isString() })
  @MaxLength(8000, { message: ExceptionDict.messageTooLong() })
  content!: string;
}
