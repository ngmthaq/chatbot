import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { OllamaModule } from '../ollama/ollama.module';
import { QdrantModule } from '../qdrant/qdrant.module';

import { DocumentChunkingService } from './document-chunking.service';
import { PromptConstructionService } from './prompt-construction.service';
import { RagService } from './rag.service';
import { VectorRetrievalService } from './vector-retrieval.service';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'generate-embeddings' }),
    OllamaModule,
    QdrantModule,
  ],
  providers: [
    RagService,
    DocumentChunkingService,
    VectorRetrievalService,
    PromptConstructionService,
  ],
  exports: [RagService, DocumentChunkingService, VectorRetrievalService],
})
export class RagModule {}
