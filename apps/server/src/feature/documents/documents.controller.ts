import * as fs from 'fs/promises';
import * as path from 'path';

import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
  Query,
  ParseFilePipeBuilder,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { diskStorage } from 'multer';

import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { ExceptionDict } from '../../core/exception/exception-dict';
import { ResponseBuilder } from '../../core/response/response-builder';
import dayjs from '../../utils/date';
import { AuthRequest } from '../auth/auth-type';
import { AuthGuard } from '../auth/auth.guard';
import { Action } from '../rbac/action';
import { Module } from '../rbac/module';
import { Rbac } from '../rbac/rbac.decorator';
import { RbacGuard } from '../rbac/rbac.guard';

import { DocumentsService } from './documents.service';
import { GetDocumentListDto } from './get-document-list.dto';

@ApiTags('Documents')
@ApiBearerAuth()
@Controller('documents')
@UseGuards(ThrottlerGuard, AuthGuard, RbacGuard)
export class DocumentsController {
  private readonly logger = new Logger(DocumentsController.name);

  constructor(private readonly documentsService: DocumentsService) {}

  /**
   * Upload document
   */
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const uploadDir = path.join(
            process.cwd(),
            'uploads',
            dayjs().format('YYYY-MM-DD'),
          );

          fs.mkdir(uploadDir, { recursive: true })
            .then(() => cb(null, uploadDir))
            .catch((error: unknown) => {
              const uploadError =
                error instanceof Error
                  ? error
                  : new Error('Failed to create upload directory');
              cb(uploadError, uploadDir);
            });
        },
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  @Rbac(Module.DOCUMENTS, Action.CREATE)
  @ApiOperation({
    summary: 'Upload document',
    description: 'Upload PDF, DOCX, or TXT document for RAG processing',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Document file (PDF/DOCX/TXT, max 50MB)',
        },
        description: {
          type: 'string',
          description: 'Optional document description',
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Document uploaded and queued for processing',
  })
  @ApiResponse({ status: 400, description: 'Invalid file or file too large' })
  async uploadDocument(
    @Req() req: AuthRequest,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addMaxSizeValidator({
          maxSize: 50 * 1024 * 1024,
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    this.logger.log(
      `Received file upload: ${file.originalname} (${file.mimetype}, ${file.size} bytes) from user ${req.authentication.sub}`,
    );
    if (!file || file.size <= 0) {
      throw ExceptionBuilder.badRequest({
        errors: [ExceptionDict.noFileUploaded()],
      });
    }

    const document = await this.documentsService.createDocument(
      req.authentication.sub,
      {
        file,
        description: req.body.description,
      },
    );

    return ResponseBuilder.data(document);
  }

  /**
   * Get user's documents
   */
  @Get()
  @Rbac(Module.DOCUMENTS, Action.READ)
  @ApiOperation({
    summary: 'Get documents',
    description: 'Get list of user documents with status',
  })
  @ApiResponse({ status: 200, description: 'Documents retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getDocuments(
    @Query() dto: GetDocumentListDto,
    @Req() req: AuthRequest,
  ) {
    const result = await this.documentsService.getDocuments(
      req.authentication.sub,
      dto,
    );

    return ResponseBuilder.pagination(result.data, result.pagination);
  }

  /**
   * Get document details
   */
  @Get(':documentId')
  @Rbac(Module.DOCUMENTS, Action.READ)
  @ApiOperation({
    summary: 'Get document',
    description: 'Get document details and chunks',
  })
  @ApiParam({ name: 'documentId', description: 'Document ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Document retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async getDocument(
    @Param('documentId') documentId: string,
    @Req() req: AuthRequest,
  ) {
    const document = await this.documentsService.getDocument(
      Number(documentId),
      req.authentication.sub,
    );

    return ResponseBuilder.data(document);
  }

  /**
   * Delete document
   */
  @Delete(':documentId')
  @Rbac(Module.DOCUMENTS, Action.DELETE)
  @ApiOperation({
    summary: 'Delete document',
    description: 'Delete document and remove from vector store',
  })
  @ApiParam({ name: 'documentId', description: 'Document ID', type: 'number' })
  @ApiResponse({ status: 200, description: 'Document deleted successfully' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  async deleteDocument(
    @Param('documentId') documentId: string,
    @Req() req: AuthRequest,
  ) {
    await this.documentsService.deleteDocument(
      Number(documentId),
      req.authentication.sub,
    );

    return ResponseBuilder.success(true);
  }
}
