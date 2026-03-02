import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { OllamaModule } from '../ollama/ollama.module';
import { QdrantModule } from '../qdrant/qdrant.module';
import { RagModule } from '../rag/rag.module';

import { CleanupProcessor } from './cleanup.processor';
import { GenerateEmbeddingsProcessor } from './generate-embeddings.processor';
import { ProcessDocumentProcessor } from './process-document.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'process-document' },
      { name: 'generate-embeddings' },
      { name: 'cleanup' },
    ),
    RagModule,
    OllamaModule,
    QdrantModule,
  ],
  providers: [
    ProcessDocumentProcessor,
    GenerateEmbeddingsProcessor,
    CleanupProcessor,
  ],
  exports: [],
})
export class ProcessorsModule {}
