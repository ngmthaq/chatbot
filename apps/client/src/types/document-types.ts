export enum DocumentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface Document {
  id: number;
  userId: number;
  title: string;
  description?: string;
  filePath: string;
  mimeType: string;
  fileSize: number;
  pageCount?: number;
  status: DocumentStatus;
  errorMessage?: string;
  chunkCount: number;
  embeddingCount: number;
  qdrantCollectionId?: string;
  uploadedAt: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentChunk {
  id: number;
  documentId: number;
  chunkIndex: number;
  text: string;
  tokenCount?: number;
  qdrantPointId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  document?: Document;
}

export interface UploadDocumentDto {
  file: File;
  title?: string;
  description?: string;
}
