import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

export class TokenUsageDto {
  @ApiProperty({
    enum: ['7d', '30d', '90d'],
    description: 'Time period for statistics',
    example: '7d',
    default: '7d',
  })
  @IsEnum(['7d', '30d', '90d'])
  period: string = '7d';
}
