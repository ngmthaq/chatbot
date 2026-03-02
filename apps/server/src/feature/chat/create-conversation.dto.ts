import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

import { ExceptionDict } from '../../core/exception/exception-dict';

export class CreateConversationDto {
  @IsString({ message: ExceptionDict.isString() })
  title: string;

  @IsOptional()
  @IsString({ message: ExceptionDict.isString() })
  model?: string = 'llama3';

  @IsOptional()
  @IsNumber({}, { message: ExceptionDict.isNumber() })
  @Min(0, { message: ExceptionDict.isPositive() })
  @Max(1, { message: 'Temperature must be between 0 and 1' })
  temperature?: number = 0.7;

  @IsOptional()
  @IsNumber({}, { message: ExceptionDict.isNumber() })
  @Min(100, { message: 'maxTokens must be at least 100' })
  @Max(8192, { message: 'maxTokens must not exceed 8192' })
  maxTokens?: number = 2048;

  @IsOptional()
  @IsNumber({}, { message: ExceptionDict.isNumber() })
  @Min(1, { message: 'contextWindow must be at least 1' })
  @Max(100, { message: 'contextWindow must not exceed 100' })
  contextWindow?: number = 20;

  @IsOptional()
  @IsNumber({}, { message: ExceptionDict.isNumber() })
  documentId?: number;
}
