import { IsString, IsOptional } from 'class-validator';

export class UploadDocumentDto {
  // File uploaded via multipart/form-data
  // Validated in FileValidationGuard

  @IsString()
  @IsOptional()
  description?: string;

  // File object added by multer middleware
  file?: Express.Multer.File;
}
