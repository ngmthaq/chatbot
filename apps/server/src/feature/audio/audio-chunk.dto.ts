import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class AudioChunkDto {
  @IsNotEmpty()
  @IsString()
  audio!: string; // Base64 encoded audio

  @IsOptional()
  @IsString()
  format?: string; // Audio format (e.g., 'wav', 'mp3')

  @IsNotEmpty()
  @IsNumber()
  conversationId!: number;
}
