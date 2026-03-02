import * as fs from 'fs/promises';

import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { PrismaService } from '../../core/database/prisma.service';
import { QdrantService } from '../qdrant/qdrant.service';

import { CleanupJob } from './document-job.interface';

@Processor('cleanup')
export class CleanupProcessor extends WorkerHost {
  private readonly logger = new Logger(CleanupProcessor.name);

  constructor(
    private readonly qdrantService: QdrantService,
    private readonly prismaService: PrismaService,
  ) {
    super();
  }

  async process(job: Job<CleanupJob>) {
    this.logger.log(`Cleaning up document ${job.data.documentId}`);

    try {
      const document = await this.prismaService.document.findUnique({
        where: { id: job.data.documentId },
      });

      if (!document) {
        this.logger.warn(`Document ${job.data.documentId} not found`);
        return;
      }

      // Delete file from storage
      try {
        await fs.unlink(document.filePath);
      } catch (error) {
        this.logger.warn(
          `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }

      // Delete from Qdrant if requested
      if (job.data.deleteFromQdrant) {
        try {
          await this.qdrantService.deleteByFilter('documents', {
            documentId: job.data.documentId,
          });
        } catch (error) {
          this.logger.warn(
            `Failed to delete from Qdrant: ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      }

      // Delete chunks from database
      await this.prismaService.documentChunk.deleteMany({
        where: { documentId: job.data.documentId },
      });

      this.logger.log(
        `Successfully cleaned up document ${job.data.documentId}`,
      );
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Cleanup failed for document ${job.data.documentId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }
}
