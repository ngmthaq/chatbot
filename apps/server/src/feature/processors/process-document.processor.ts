import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { PrismaService } from '../../core/database/prisma.service';
import { RagService } from '../rag/rag.service';

import { DocumentJob } from './document-job.interface';

@Processor('process-document')
export class ProcessDocumentProcessor extends WorkerHost {
  private readonly logger = new Logger(ProcessDocumentProcessor.name);

  constructor(
    private readonly ragService: RagService,
    private readonly prismaService: PrismaService,
  ) {
    super();
  }

  async process(job: Job<DocumentJob>) {
    this.logger.log(
      `Processing document ${job.data.documentId} for user ${job.data.userId}`,
    );

    try {
      // Update document status to processing
      await this.prismaService.document.update({
        where: { id: job.data.documentId },
        data: { status: 'processing' },
      });

      // Chunk the document
      await this.ragService.processDocumentChunks(
        job.data.documentId,
        job.data.userId,
        job.data.text,
      );

      this.logger.log(`Successfully processed document ${job.data.documentId}`);
      return { success: true };
    } catch (error) {
      this.logger.error(
        `Failed to process document ${job.data.documentId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      // Update document status to failed
      await this.prismaService.document.update({
        where: { id: job.data.documentId },
        data: {
          status: 'failed',
          errorMessage:
            error instanceof Error ? error.message : 'Unknown error',
        },
      });

      throw error;
    }
  }
}
