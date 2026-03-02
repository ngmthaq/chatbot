import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UploadDocumentDto {
  // File uploaded via multipart/form-data
  // Validated in FileValidationGuard

  @ApiPropertyOptional({ description: 'Optional description of the document' })
  @IsString()
  @IsOptional()
  description?: string;

  // File object added by multer middleware
  file?: Express.Multer.File;
}
