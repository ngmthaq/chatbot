import { Injectable, Logger } from '@nestjs/common';

import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { ExceptionDict } from '../../core/exception/exception-dict';
import { QdrantService } from '../qdrant/qdrant.service';

export interface RetrievedSource {
  documentId: number;
  chunkId: number;
  text: string;
  similarity: number;
  title: string;
}

@Injectable()
export class VectorRetrievalService {
  private readonly logger = new Logger(VectorRetrievalService.name);

  constructor(private readonly qdrantService: QdrantService) {}

  /**
   * Retrieve top-K similar documents from Qdrant
   */
  async retrieveTopK(
    queryEmbedding: number[],
    topK: number = 5,
    userId: number,
  ): Promise<RetrievedSource[]> {
    try {
      const results = await this.qdrantService.searchSimilar(
        queryEmbedding,
        topK,
        { userId },
      );

      return results.map((result) => ({
        documentId: result.payload.documentId,
        chunkId: result.payload.chunkId,
        text: result.payload.text,
        similarity: result.score,
        title: result.payload.title || 'Unknown',
      }));
    } catch (error) {
      this.logger.error(
        `Failed to retrieve similar documents: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw ExceptionBuilder.serviceUnavailable({
        errors: [ExceptionDict.vectorSearchFailed()],
      });
    }
  }
}
