import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { Injectable, Logger } from '@nestjs/common';

import { PrismaService } from '../../core/database/prisma.service';
import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { ExceptionDict } from '../../core/exception/exception-dict';

interface ChunkingOptions {
  chunkSize?: number;
  chunkOverlap?: number;
  separators?: string[];
}

@Injectable()
export class DocumentChunkingService {
  private readonly logger = new Logger(DocumentChunkingService.name);

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Chunk document text using recursive character splitter
   */
  async chunkDocument(
    documentId: number,
    text: string,
    options: ChunkingOptions = {},
  ): Promise<void> {
    try {
      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: options.chunkSize || 1000,
        chunkOverlap: options.chunkOverlap || 100,
        separators: options.separators || ['\n\n', '\n', ' ', ''],
      });

      const chunks = await splitter.splitText(text);

      if (chunks.length === 0) {
        throw new Error('No chunks generated from document');
      }

      // Store chunks in database
      const documentChunks = chunks.map((content, index) => ({
        documentId,
        chunkIndex: index,
        text: content,
        tokenCount: Math.ceil(content.length / 4), // Rough estimate
      }));

      // Batch insert chunks
      for (let i = 0; i < documentChunks.length; i += 100) {
        const batch = documentChunks.slice(i, i + 100);
        await this.prismaService.documentChunk.createMany({
          data: batch,
        });
      }
    } catch (error) {
      this.logger.error(
        `Failed to chunk document: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw ExceptionBuilder.badRequest({
        errors: [ExceptionDict.documentChunkingFailed()],
      });
    }
  }
}
