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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { ResponseBuilder } from '../../core/response/response-builder';
import dayjs from '../../utils/date';
import { AuthRequest } from '../auth/auth-type';
import { AuthGuard } from '../auth/auth.guard';
import { Action } from '../rbac/action';
import { Module } from '../rbac/module';
import { Rbac } from '../rbac/rbac.decorator';
import { RbacGuard } from '../rbac/rbac.guard';

import { DocumentsService } from './documents.service';
import { FileValidationGuard } from './file-validation.guard';
import { GetDocumentListDto } from './get-document-list.dto';

@Controller('documents')
@UseGuards(AuthGuard, RbacGuard)
export class DocumentsController {
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
          cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
          const uniqueName = `${Date.now()}-${file.originalname}`;
          cb(null, uniqueName);
        },
      }),
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  )
  @UseGuards(FileValidationGuard)
  @Rbac(Module.DOCUMENTS, Action.CREATE)
  async uploadDocument(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthRequest,
  ) {
    if (!file) {
      throw ExceptionBuilder.badRequest({
        errors: ['No file uploaded'],
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
