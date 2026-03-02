import { IsEnum } from 'class-validator';

export class TokenUsageDto {
  @IsEnum(['7d', '30d', '90d'])
  period: string = '7d';
}
