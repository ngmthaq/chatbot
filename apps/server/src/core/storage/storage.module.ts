import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';

/**
 * Core storage module that sets up storage for the application.
 * @see: https://docs.nestjs.com/techniques/file-upload
 */
@Module({
  imports: [
    MulterModule.register({
      dest: '/storage/uploads',
    }),
  ],
  exports: [MulterModule],
})
export class CoreStorageModule {}
