export class DocumentChunkEntity {
  id: number;
  documentId: number;
  chunkIndex: number;
  text: string;
  tokenCount: number;
  embedding: string;
  qdrantPointId: string;
  createdAt: Date;
  updatedAt: Date;
}
