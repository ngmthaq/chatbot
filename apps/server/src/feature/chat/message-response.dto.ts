import { Exclude } from 'class-transformer';

export class MessageResponseDto {
  id: number;
  conversationId: number;
  role: 'user' | 'assistant';
  content: string;
  sourceDocuments: Array<{
    documentId: number;
    chunkId: number;
    similarity: number;
    title: string;
  }>;
  tokenUsage: number;
  finishReason: string;
  createdAt: Date;

  @Exclude()
  __v?: number;
}
