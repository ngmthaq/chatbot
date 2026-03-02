import * as fs from 'fs/promises';

import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

import { PrismaService } from '../../core/database/prisma.service';
import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { ExceptionDict } from '../../core/exception/exception-dict';

import { GetDocumentListDto } from './get-document-list.dto';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    private readonly prismaService: PrismaService,
    @InjectQueue('process-document')
    private readonly processDocumentQueue: Queue,
  ) {}

  /**
   * Create document from uploaded file
   */
  async createDocument(
    userId: number,
    data: {
      file: Express.Multer.File;
      description?: string;
    },
  ) {
    const { file, description } = data;

    this.logger.debug(`Creating document for user ${userId}`);

    try {
      // Create document record
      const document = await this.prismaService.document.create({
        data: {
          userId,
          title: file.originalname,
          description,
          filePath: file.path,
          mimeType: file.mimetype,
          fileSize: file.size,
          status: 'pending',
        },
      });

      // Extract text from file
      let text = '';
      try {
        if (file.mimetype === 'text/plain') {
          text = await fs.readFile(file.path, 'utf-8');
        } else {
          // PDF and DOCX parsing would require additional libraries
          // For now, log that they need to be implemented
          this.logger.warn(
            `PDF/DOCX parsing not yet implemented for file ${file.originalname}`,
          );
          text = '';
        }
      } catch (error) {
        this.logger.error(
          `Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }

      // Queue document processing
      if (text) {
        await this.processDocumentQueue.add(
          'process-document',
          {
            documentId: document.id,
            userId,
            text,
          },
          {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 2000,
            },
          },
        );
      }

      return document;
    } catch (error) {
      this.logger.error(
        `Failed to create document: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw ExceptionBuilder.badRequest({
        errors: [ExceptionDict.documentProcessingFailed()],
      });
    }
  }

  /**
   * Get user's documents with pagination
   */
  async getDocuments(userId: number, dto: GetDocumentListDto) {
    const skip = ((dto.page || 1) - 1) * (dto.limit || 10);

    const [documents, total] = await Promise.all([
      this.prismaService.document.findMany({
        where: {
          userId,
          ...(dto.status ? { status: dto.status as any } : {}),
        },
        skip,
        take: dto.limit || 10,
        orderBy: { uploadedAt: 'desc' },
      }),
      this.prismaService.document.count({
        where: {
          userId,
          ...(dto.status ? { status: dto.status as any } : {}),
        },
      }),
    ]);

    return {
      data: documents,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / (dto.limit || 10)),
        currentPage: dto.page || 1,
      },
    };
  }

  /**
   * Get document details with chunks
   */
  async getDocument(documentId: number, userId: number) {
    const document = await this.prismaService.document.findFirst({
      where: { id: documentId, userId },
      include: { chunks: true },
    });

    if (!document) {
      throw ExceptionBuilder.notFound({
        errors: [ExceptionDict.documentNotFound()],
      });
    }

    return document;
  }

  /**
   * Delete document and associated data
   */
  async deleteDocument(documentId: number, userId: number) {
    const document = await this.prismaService.document.findFirst({
      where: { id: documentId, userId },
    });

    if (!document) {
      throw ExceptionBuilder.notFound({
        errors: [ExceptionDict.documentNotFound()],
      });
    }

    try {
      // Delete file from storage
      try {
        await fs.unlink(document.filePath);
      } catch (error) {
        this.logger.warn(
          `Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }

      // Delete from Qdrant (via queue processor)
      await this.processDocumentQueue.add(
        'cleanup',
        {
          documentId,
          userId,
          deleteFromQdrant: true,
        },
        {
          attempts: 1,
        },
      );

      // Delete from database (cascade will delete chunks)
      await this.prismaService.document.delete({
        where: { id: documentId },
      });

      this.logger.log(`Document ${documentId} deleted successfully`);
    } catch (error) {
      this.logger.error(
        `Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw ExceptionBuilder.internalServerError({
        errors: ['Failed to delete document'],
      });
    }
  }
}
