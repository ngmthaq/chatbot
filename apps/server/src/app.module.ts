import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

// Core modules
import { CoreCacheModule } from './core/cache/cache.module';
import { CoreConfigModule } from './core/config/config.module';
import { CoreDatabaseModule } from './core/database/database.module';
import { CoreEncryptModule } from './core/encrypt/encrypt.module';
import { CoreEventModule } from './core/event/event.module';
import { CoreQueueModule } from './core/queue/queue.module';
import { CoreScheduleModule } from './core/schedule/schedule.module';
import { CoreStorageModule } from './core/storage/storage.module';
import { CoreThrottlerModule } from './core/throttler/throttler.module';
import { CoreValidatorModule } from './core/validator/validator.module';
// Existing feature modules
import { AdminModule } from './feature/admin/admin.module';
import { AudioModule } from './feature/audio/audio.module';
import { AuthModule } from './feature/auth/auth.module';
import { ChatModule } from './feature/chat/chat.module';
import { DocumentsModule } from './feature/documents/documents.module';
import { ImagesModule } from './feature/images/images.module';
import { OllamaModule } from './feature/ollama/ollama.module';
import { ProcessorsModule } from './feature/processors/processors.module';
import { QdrantModule } from './feature/qdrant/qdrant.module';
import { RagModule } from './feature/rag/rag.module';
import { RbacModule } from './feature/rbac/rbac.module';
import { RoleModule } from './feature/role/role.module';
import { TokensModule } from './feature/tokens/tokens.module';
import { UsersModule } from './feature/users/users.module';

// New RAG feature modules

const coreModules = [
  CoreConfigModule,
  CoreEncryptModule,
  CoreCacheModule,
  CoreScheduleModule,
  CoreQueueModule,
  CoreEventModule,
  CoreStorageModule,
  CoreThrottlerModule,
  CoreDatabaseModule,
  CoreValidatorModule,
];

const featureModules = [
  // Existing modules
  UsersModule,
  AuthModule,
  TokensModule,
  RbacModule,
  RoleModule,
  // New RAG modules
  OllamaModule,
  QdrantModule,
  RagModule,
  ChatModule,
  DocumentsModule,
  ProcessorsModule,
  ImagesModule,
  AudioModule,
  AdminModule,
];

const providers = [
  {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor,
  },
];

@Module({
  imports: [...coreModules, ...featureModules],
  providers: [...providers],
})
export class AppModule {}
