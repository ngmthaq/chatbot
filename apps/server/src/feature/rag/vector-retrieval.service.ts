import { Injectable, Logger } from '@nestjs/common';

import { ExceptionBuilder } from '../../core/exception/exception-builder';
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
    this.logger.debug(
      `Retrieving top ${topK} similar documents for user ${userId}`,
    );

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
        errors: ['Failed to search documents'],
      });
    }
  }
}
