import * as fs from 'fs/promises';

import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import type { Document } from '@langchain/core/documents';
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

      // Extract text from file using LangChain document loaders
      let text = '';
      try {
        // Select appropriate loader based on MIME type
        switch (file.mimetype) {
          case 'text/plain': {
            // For text files, simply read the file
            text = await fs.readFile(file.path, 'utf-8');
            break;
          }

          case 'application/pdf': {
            const pdfLoader = new PDFLoader(file.path, {
              splitPages: false, // Keep entire document as one
            });
            const docs = await pdfLoader.load();
            text = docs.map((doc: Document) => doc.pageContent).join('\n\n');
            break;
          }

          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': {
            const docxLoader = new DocxLoader(file.path);
            const docs = await docxLoader.load();
            text = docs.map((doc: Document) => doc.pageContent).join('\n\n');
            break;
          }

          default:
            this.logger.warn(
              `Unsupported file type: ${file.mimetype} for file ${file.originalname}`,
            );
            text = '';
        }

        if (text) {
          this.logger.debug(
            `Extracted ${text.length} characters from ${file.originalname}`,
          );
        }
      } catch (error) {
        this.logger.error(
          `Failed to extract text: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
        // Update document status to failed
        await this.prismaService.document.update({
          where: { id: document.id },
          data: { status: 'failed' },
        });

        throw ExceptionBuilder.badRequest({
          errors: [ExceptionDict.documentProcessingFailed()],
        });
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ...(dto.status ? { status: dto.status as any } : {}),
        },
        skip,
        take: dto.limit || 10,
        orderBy: { uploadedAt: 'desc' },
      }),
      this.prismaService.document.count({
        where: {
          userId,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    } catch (error) {
      this.logger.error(
        `Failed to delete document: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw ExceptionBuilder.internalServerError({
        errors: [ExceptionDict.documentDeletionFailed()],
      });
    }
  }
}
