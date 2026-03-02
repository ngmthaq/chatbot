import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { QdrantService } from './qdrant.service';

@Module({
  imports: [HttpModule],
  providers: [QdrantService],
  exports: [QdrantService],
})
export class QdrantModule {}
