export interface DocumentJob {
  documentId: number;
  userId: number;
  text: string;
}

export interface EmbeddingJob {
  documentId: number;
  chunkId: number;
  text: string;
  userId: number;
}

export interface CleanupJob {
  documentId: number;
  userId: number;
  deleteFromQdrant: boolean;
}
