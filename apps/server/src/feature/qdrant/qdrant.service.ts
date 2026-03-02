import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

import { ConfigType } from '../../core/config/config-type';
import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { ExceptionDict } from '../../core/exception/exception-dict';

import {
  QdrantPoint,
  QdrantSearchResult,
  QdrantFilter,
} from './qdrant-payload.type';

@Injectable()
export class QdrantService implements OnModuleInit {
  private readonly logger = new Logger(QdrantService.name);
  private readonly baseUrl?: string;
  private apiKey?: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    const qdrantUrl =
      this.configService.get<ConfigType['qdrantUrl']>('qdrantUrl');
    this.baseUrl = typeof qdrantUrl === 'function' ? qdrantUrl() : qdrantUrl;
    this.apiKey =
      this.configService.get<ConfigType['qdrantApiKey']>('qdrantApiKey');
  }

  async onModuleInit() {
    // Create default "documents" collection with 768 dimensions (for embeddinggemma)
    try {
      await this.createCollection('documents', 768);
    } catch (error) {
      this.logger.warn(
        `Failed to initialize Qdrant collection: ${error instanceof Error ? error.message : JSON.stringify(error)}`,
      );
    }
  }

  /**
   * Create or update a collection in Qdrant
   */
  async createCollection(
    collectionName: string,
    vectorSize: number = 384,
  ): Promise<void> {
    const url = `${this.baseUrl}/collections/${collectionName}`;
    const headers = this.getHeaders();

    const payload = {
      vectors: {
        size: vectorSize,
        distance: 'Cosine',
      },
    };

    await firstValueFrom(this.httpService.put(url, payload, { headers }));
  }

  /**
   * Delete a collection
   */
  async deleteCollection(collectionName: string): Promise<void> {
    const url = `${this.baseUrl}/collections/${collectionName}`;
    const headers = this.getHeaders();

    try {
      await firstValueFrom(this.httpService.delete(url, { headers }));
    } catch (error) {
      this.logger.error(
        `Failed to delete collection: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw ExceptionBuilder.serviceUnavailable({
        errors: [ExceptionDict.vectorCollectionDeletionFailed()],
      });
    }
  }

  /**
   * Upsert points (vectors with metadata) into a collection
   */
  async upsertPoints(
    collectionName: string,
    points: QdrantPoint[],
  ): Promise<void> {
    const url = `${this.baseUrl}/collections/${collectionName}/points`;
    const headers = this.getHeaders();

    const payload = {
      points: points.map((point) => ({
        id: point.id,
        vector: point.vector,
        payload: point.payload,
      })),
    };

    try {
      await firstValueFrom(this.httpService.put(url, payload, { headers }));
    } catch (error) {
      this.logger.error(
        `Failed to upsert points: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw ExceptionBuilder.serviceUnavailable({
        errors: [ExceptionDict.vectorStorageFailed()],
      });
    }
  }

  /**
   * Search for similar vectors
   */
  async searchSimilar(
    queryVector: number[],
    topK: number = 5,
    filter?: QdrantFilter,
  ): Promise<QdrantSearchResult[]> {
    const url = `${this.baseUrl}/collections/documents/points/search`;
    const headers = this.getHeaders();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = {
      vector: queryVector,
      limit: topK,
      with_payload: true,
    };

    if (filter) {
      payload.filter = {
        must: Object.entries(filter).map(([key, value]) => ({
          key,
          match: { value: parseInt(value as string, 10) },
        })),
      };
    }

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload, { headers }),
      );

      const results =
        (response as { data: { result?: QdrantSearchResult[] } }).data.result ||
        [];

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return results.map((item: any) => ({
        id: item.id,
        score: item.score,
        payload: item.payload,
      }));
    } catch (error) {
      this.logger.error(
        `Failed to search vectors: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw ExceptionBuilder.serviceUnavailable({
        errors: [ExceptionDict.vectorSearchFailed()],
      });
    }
  }

  /**
   * Delete points by filter
   */
  async deleteByFilter(
    collectionName: string,
    filter: QdrantFilter,
  ): Promise<void> {
    const url = `${this.baseUrl}/collections/${collectionName}/points/delete`;
    const headers = this.getHeaders();

    const payload = {
      filter: {
        must: Object.entries(filter).map(([key, value]) => ({
          field: key,
          match: { value },
        })),
      },
    };

    try {
      await firstValueFrom(this.httpService.post(url, payload, { headers }));
    } catch (error) {
      this.logger.error(
        `Failed to delete points: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw ExceptionBuilder.serviceUnavailable({
        errors: [ExceptionDict.vectorDeletionFailed()],
      });
    }
  }

  /**
   * Get collection info
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getCollectionInfo(collectionName: string): Promise<any> {
    const url = `${this.baseUrl}/collections/${collectionName}`;
    const headers = this.getHeaders();

    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers }),
      );
      return response.data;
    } catch (error) {
      this.logger.warn(
        `Failed to get collection info: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return null;
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['api-key'] = this.apiKey;
    }

    return headers;
  }
}
