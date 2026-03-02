import * as path from 'path';

import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import dayjs from '../../utils/date';

import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { FileValidationGuard } from './file-validation.guard';

@Module({
  imports: [
    MulterModule.register({
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
    BullModule.registerQueue({ name: 'process-document' }),
  ],
  controllers: [DocumentsController],
  providers: [DocumentsService, FileValidationGuard],
  exports: [DocumentsService],
})
export class DocumentsModule {}
