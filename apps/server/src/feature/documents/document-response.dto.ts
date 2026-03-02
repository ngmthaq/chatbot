import { Exclude } from 'class-transformer';

export class DocumentResponseDto {
  id: number;
  title: string;
  description: string;
  fileSize: number;
  mimeType: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errorMessage: string;
  chunkCount: number;
  embeddingCount: number;
  uploadedAt: Date;
  processedAt: Date;

  @Exclude()
  filePath: string;

  @Exclude()
  qdrantCollectionId: string;
}
