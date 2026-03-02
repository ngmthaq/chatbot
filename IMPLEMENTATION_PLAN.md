# RAG LLM Backend Implementation Plan

**Status**: Implementation in Progress  
**Date**: March 1, 2026  
**Stack**: NestJS, MySQL, Prisma, Redis, BullMQ, Ollama, Qdrant

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [Module Structure](#module-structure)
5. [Implementation Phases](#implementation-phases)
6. [File Checklist](#file-checklist)
7. [Testing Strategy](#testing-strategy)

---

## Overview

Build a production-ready RAG (Retrieval-Augmented Generation) LLM backend with:
- Document ingestion (PDF/DOCX/TXT) with chunking
- Vector embeddings via local Ollama
- Similarity search via Qdrant
- Streaming chat responses via SSE
- Background job processing via BullMQ
- Role-based access control (RBAC)
- Admin monitoring and controls
- Image processing with vision models
- Audio chat with WebSocket support

---

## Architecture

### Data Flow: RAG Query

```
User Query
    ↓
[AuthGuard] Validate JWT
    ↓
[RbacGuard] Check permissions
    ↓
[PromptInjectionGuard] Validate content
    ↓
[OllamaService] Generate query embedding
    ↓
[QdrantService] Search top-K similar documents
    ↓
[PromptConstructionService] Build context-aware prompt
    ↓
[ChatService] Save message to MySQL
    ↓
[OllamaService] Stream response via SSE
    ↓
[ChatService] Save assistant message + citations
```

### Data Flow: Document Ingestion

```
Upload File
    ↓
[FileValidationGuard] Validate MIME + size
    ↓
[DocumentsService] Create Document record (status=pending)
    ↓
[BullMQ] Queue: process-document job
    ↓
[ProcessDocumentProcessor] Extract text + chunk document
    ↓
[BullMQ] Queue: generate-embeddings jobs (one per chunk)
    ↓
[GenerateEmbeddingsProcessor] Generate embedding + store in Qdrant
    ↓
[DocumentsService] Update Document status=completed
```

---

## Database Schema

### New Prisma Models

```prisma
model Conversation {
  id            Int       @id @default(autoincrement())
  userId        Int
  title         String?
  model         String    @default("llama3")
  temperature   Float     @default(0.7)
  maxTokens     Int       @default(2048)
  contextWindow Int       @default(20)
  isArchived    Boolean   @default(false)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  user          User      @relation("ConversationUser", fields: [userId], references: [id], onDelete: Cascade)
  messages      Message[]
  documents     Document[] @relation("ConversationDocuments")
  
  @@index([userId])
  @@index([isArchived])
}

model Message {
  id              Int       @id @default(autoincrement())
  conversationId  Int
  role            String    @db.Enum("user", "assistant")
  content         String    @db.LongText
  sourceDocuments String?   @db.JSON
  tokenUsage      Int?
  finishReason    String?
  createdAt       DateTime  @default(now())
  
  conversation    Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)
  
  @@index([conversationId])
  @@index([role])
}

model Document {
  id                    Int       @id @default(autoincrement())
  userId                Int
  title                 String
  description           String?
  filePath              String
  mimeType              String
  fileSize              Int
  pageCount             Int?
  status                String    @db.Enum("pending", "processing", "completed", "failed")
  errorMessage          String?
  chunkCount            Int       @default(0)
  embeddingCount        Int       @default(0)
  qdrantCollectionId    String?
  uploadedAt            DateTime  @default(now())
  processedAt           DateTime?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  user                  User      @relation("DocumentUser", fields: [userId], references: [id], onDelete: Cascade)
  chunks                DocumentChunk[]
  conversations         Conversation[] @relation("ConversationDocuments")
  
  @@index([userId])
  @@index([status])
  @@index([uploadedAt])
}

model DocumentChunk {
  id              Int       @id @default(autoincrement())
  documentId      Int
  chunkIndex      Int
  text            String    @db.LongText
  tokenCount      Int?
  embedding       String?   @db.LongText
  qdrantPointId   String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  document        Document @relation(fields: [documentId], references: [id], onDelete: Cascade)
  
  @@index([documentId])
  @@index([qdrantPointId])
}
```

---

## Module Structure (Flattened)

### Feature Modules

| Module | Files | Responsibility |
|--------|-------|-----------------|
| **ollama** | ollama.service.ts, ollama.module.ts, ollama-response.type.ts | LLM + embeddings + vision model HTTP client |
| **qdrant** | qdrant.service.ts, qdrant.module.ts, qdrant-payload.type.ts | Vector search + storage client |
| **rag** | rag.service.ts, rag.module.ts, document-chunking.service.ts, embedding.service.ts, vector-retrieval.service.ts, prompt-construction.service.ts, prompt-injection.guard.ts | RAG pipeline orchestration |
| **chat** | chat.controller.ts, chat.service.ts, chat.module.ts, conversation.entity.ts, message.entity.ts, create-conversation.dto.ts, create-message.dto.ts, get-conversation-list.dto.ts, message-response.dto.ts, conversation-ownership.guard.ts | Conversation management + SSE streaming |
| **documents** | documents.controller.ts, documents.service.ts, documents.module.ts, document.entity.ts, document-chunk.entity.ts, upload-document.dto.ts, get-document-list.dto.ts, document-response.dto.ts, file-validation.guard.ts | Document upload + management |
| **processors** | processors.module.ts, process-document.processor.ts, generate-embeddings.processor.ts, cleanup.processor.ts, document-job.interface.ts | BullMQ background jobs |
| **images** | images.controller.ts, images.service.ts, images.module.ts, process-image.dto.ts | Vision model image processing |
| **audio** | audio.gateway.ts, audio.service.ts, audio.module.ts, speech-to-text.service.ts, text-to-speech.service.ts, audio-chunk.dto.ts | WebSocket audio streaming |
| **admin** | admin.controller.ts, admin.service.ts, admin.module.ts, token-usage.dto.ts, admin-role.guard.ts | Admin functions + monitoring |

---

## Implementation Phases

### Phase 1: Foundation (Days 1-2)
- [x] Database schema design
- [ ] Create Prisma migrations
- [ ] Setup Ollama module + service
- [ ] Setup Qdrant module + service
- [ ] Create exception + validator utilities
- [ ] Update app.module.ts

### Phase 2: RAG Pipeline (Days 3-4)
- [ ] Implement document chunking service
- [ ] Implement embedding service
- [ ] Implement vector retrieval service
- [ ] Implement prompt construction service
- [ ] Implement RAG service
- [ ] Setup processors module (BullMQ)

### Phase 3: Chat Module (Days 5-6)
- [ ] Create conversation entity + DTOs
- [ ] Create message entity + DTOs
- [ ] Implement chat service (CRUD)
- [ ] Implement chat controller with SSE streaming
- [ ] Create conversation ownership guard
- [ ] Add prompt injection guard

### Phase 4: Document Management (Days 7-8)
- [ ] Create document entity + DTOs
- [ ] Create document chunk entity
- [ ] Implement documents controller
- [ ] Implement documents service
- [ ] Create file validation guard
- [ ] Queue document processing jobs

### Phase 5: Advanced Features (Days 9-10)
- [ ] Implement images module + controller
- [ ] Implement audio gateway + services
- [ ] Implement admin controller + service
- [ ] Add admin role guard
- [ ] Setup admin monitoring endpoints

### Phase 6: Polish & Deploy (Days 11-12)
- [ ] Security: rate limiting, input validation
- [ ] Performance: caching, query optimization
- [ ] Monitoring: logging, metrics
- [ ] Documentation: API docs
- [ ] Load testing
- [ ] Production checklist

---

## File Checklist

### Progress Tracker

**Completed**: 0/74 files
**In Progress**: Phase 1 - Foundation

---

## Dependencies to Add

```json
{
  "dependencies": {
    "langchain": "^0.1.0",
    "@langchain/core": "^0.1.0",
    "@nestjs/websockets": "^11.0.0",
    "@nestjs/platform-ws": "^11.0.0",
    "ws": "^8.14.0"
  }
}
```

---

## Environment Variables

```bash
# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_CHAT_MODEL=llama3
OLLAMA_EMBED_MODEL=nomic-embed-text
OLLAMA_VISION_MODEL=llava

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_API_KEY=

# File Upload
UPLOAD_DIR=/uploads
MAX_FILE_SIZE=52428800

# Chat
DEFAULT_CONTEXT_WINDOW=20
DEFAULT_TEMPERATURE=0.7
DEFAULT_MAX_TOKENS=2048
```

---

## Success Criteria

- [ ] All modules created with production-quality code
- [ ] All unit tests passing
- [ ] All E2E tests passing
- [ ] Document ingestion pipeline working
- [ ] SSE chat streaming working
- [ ] Vector search returning relevant results
- [ ] Admin endpoints secured with RBAC
- [ ] Response times < 500ms for chat queries

---
