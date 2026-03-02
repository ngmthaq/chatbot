import { Module } from '@nestjs/common';

import { CoreThrottlerModule } from '../../core/throttler/throttler.module';
import { AuthModule } from '../auth/auth.module';
import { OllamaModule } from '../ollama/ollama.module';

import { ImagesController } from './images.controller';
import { ImagesService } from './images.service';

@Module({
  imports: [CoreThrottlerModule, AuthModule, OllamaModule],
  controllers: [ImagesController],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
