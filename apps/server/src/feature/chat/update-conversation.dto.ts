import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max } from 'class-validator';

import { ExceptionDict } from '../../core/exception/exception-dict';

export class UpdateConversationDto {
  @ApiPropertyOptional({
    example: 'My Research Chat',
    description: 'Conversation title',
  })
  @IsOptional()
  @IsString({ message: ExceptionDict.isString() })
  title?: string;

  @ApiPropertyOptional({
    example: 'gemma3',
    description: 'LLM model to use',
  })
  @IsOptional()
  @IsString({ message: ExceptionDict.isString() })
  model?: string;

  @ApiPropertyOptional({
    example: 0.7,
    description: 'Temperature (0-1)',
    minimum: 0,
    maximum: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: ExceptionDict.isNumber() })
  @Min(0, { message: ExceptionDict.isPositive() })
  @Max(1, { message: 'Temperature must be between 0 and 1' })
  temperature?: number;

  @ApiPropertyOptional({
    example: 2048,
    description: 'Max tokens in response',
    minimum: 100,
    maximum: 8192,
  })
  @IsOptional()
  @IsNumber({}, { message: ExceptionDict.isNumber() })
  @Min(100, { message: 'maxTokens must be at least 100' })
  @Max(8192, { message: 'maxTokens must not exceed 8192' })
  maxTokens?: number;

  @ApiPropertyOptional({
    example: 20,
    description: 'Number of previous messages to include',
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber({}, { message: ExceptionDict.isNumber() })
  @Min(1, { message: 'contextWindow must be at least 1' })
  @Max(100, { message: 'contextWindow must not exceed 100' })
  contextWindow?: number;
}
