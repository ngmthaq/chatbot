import { Exclude } from 'class-transformer';

export class DocumentEntity {
  id: number;
  userId: number;
  title: string;
  description: string;
  fileSize: number;
  mimeType: string;
  pageCount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  errorMessage: string;
  chunkCount: number;
  embeddingCount: number;
  uploadedAt: Date;
  processedAt: Date;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  filePath: string;

  @Exclude()
  qdrantCollectionId: string;

  @Exclude()
  __v?: number;
}
