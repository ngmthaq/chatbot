import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { PrismaService } from '../../core/database/prisma.service';
import { OllamaService } from '../ollama/ollama.service';
import { QdrantService } from '../qdrant/qdrant.service';

import { EmbeddingJob } from './document-job.interface';

@Processor('generate-embeddings')
export class GenerateEmbeddingsProcessor extends WorkerHost {
  private readonly logger = new Logger(GenerateEmbeddingsProcessor.name);

  constructor(
    private readonly ollamaService: OllamaService,
    private readonly qdrantService: QdrantService,
    private readonly prismaService: PrismaService,
  ) {
    super();
  }

  async process(job: Job<EmbeddingJob>) {
    this.logger.log(`Generating embeddings for chunk ${job.data.chunkId}`);

    try {
      // Generate embedding
      const embedding = await this.ollamaService.generateEmbedding(
        job.data.text,
      );

      // Upsert to Qdrant
      await this.qdrantService.upsertPoints('documents', [
        {
          id: `${job.data.documentId}-${job.data.chunkId}`,
          vector: embedding,
          payload: {
            documentId: job.data.documentId,
            chunkId: job.data.chunkId,
            userId: job.data.userId,
            text: job.data.text,
          },
        },
      ]);

      // Update chunk in database
      await this.prismaService.documentChunk.update({
        where: { id: job.data.chunkId },
        data: {
          qdrantPointId: `${job.data.documentId}-${job.data.chunkId}`,
          embedding: JSON.stringify(embedding),
        },
      });

      this.logger.log(
        `Successfully generated embedding for chunk ${job.data.chunkId}`,
      );
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to generate embedding for chunk ${job.data.chunkId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }
}
