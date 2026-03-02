# RAG LLM Backend Implementation Plan

**Status**: Phase 5 Complete - Advanced Features Implemented  
**Date**: March 2, 2026  
**Stack**: NestJS, MySQL, Prisma, Redis, BullMQ, Ollama, Qdrant

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Database Schema](#database-schema)
4. [Module Structure Flattened](#module-structure-flattened)
5. [Implementation Phases](#implementation-phases)
6. [File Checklist](#file-checklist)

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

```text
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

```text
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

| Module         | Files                                                                                                                                                                                                                                     | Responsibility                              |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| **ollama**     | ollama.service.ts, ollama.module.ts, ollama-response.type.ts                                                                                                                                                                              | LLM + embeddings + vision model HTTP client |
| **qdrant**     | qdrant.service.ts, qdrant.module.ts, qdrant-payload.type.ts                                                                                                                                                                               | Vector search + storage client              |
| **rag**        | rag.service.ts, rag.module.ts, document-chunking.service.ts, embedding.service.ts, vector-retrieval.service.ts, prompt-construction.service.ts, prompt-injection.guard.ts                                                                 | RAG pipeline orchestration                  |
| **chat**       | chat.controller.ts, chat.service.ts, chat.module.ts, conversation.entity.ts, message.entity.ts, create-conversation.dto.ts, create-message.dto.ts, get-conversation-list.dto.ts, message-response.dto.ts, conversation-ownership.guard.ts | Conversation management + SSE streaming     |
| **documents**  | documents.controller.ts, documents.service.ts, documents.module.ts, document.entity.ts, document-chunk.entity.ts, upload-document.dto.ts, get-document-list.dto.ts, document-response.dto.ts, file-validation.guard.ts                    | Document upload + management                |
| **processors** | processors.module.ts, process-document.processor.ts, generate-embeddings.processor.ts, cleanup.processor.ts, document-job.interface.ts                                                                                                    | BullMQ background jobs                      |
| **images**     | images.controller.ts, images.service.ts, images.module.ts, process-image.dto.ts                                                                                                                                                           | Vision model image processing               |
| **audio**      | audio.gateway.ts, audio.service.ts, audio.module.ts, speech-to-text.service.ts, text-to-speech.service.ts, audio-chunk.dto.ts                                                                                                             | WebSocket audio streaming                   |
| **admin**      | admin.controller.ts, admin.service.ts, admin.module.ts, token-usage.dto.ts, admin-role.guard.ts                                                                                                                                           | Admin functions + monitoring                |

---

## Implementation Phases

### Phase 1: Foundation (Days 1-2) ✅ COMPLETED

- [x] Database schema design
- [x] Create Prisma migrations
- [x] Setup Ollama module + service
- [x] Setup Qdrant module + service
- [x] Create exception + validator utilities
- [x] Update app.module.ts

### Phase 2: RAG Pipeline (Days 3-4) ✅ COMPLETED

- [x] Implement document chunking service
- [x] Implement embedding service (via Ollama)
- [x] Implement vector retrieval service
- [x] Implement prompt construction service
- [x] Implement RAG service
- [x] Setup processors module (BullMQ)

### Phase 3: Chat Module (Days 5-6) ✅ COMPLETED

- [x] Create conversation entity + DTOs
- [x] Create message entity + DTOs
- [x] Implement chat service (CRUD)
- [x] Implement chat controller with SSE streaming
- [x] Create conversation ownership guard
- [x] Add prompt injection guard

### Phase 4: Document Management (Days 7-8) ✅ COMPLETED

- [x] Create document entity + DTOs
- [x] Create document chunk entity
- [x] Implement documents controller
- [x] Implement documents service
- [x] Create file validation guard
- [x] Queue document processing jobs

### Phase 5: Advanced Features (Days 9-10) ✅ COMPLETED

- [x] Implement images module + controller
- [x] Implement audio gateway + services
- [x] Implement admin controller + service
- [x] Add admin role guard
- [x] Setup admin monitoring endpoints
- [x] Create audio WebSocket gateway
- [x] Create speech-to-text service (with placeholder)
- [x] Create text-to-speech service (with placeholder)

### Phase 6: Polish & Deploy (Days 11-12) 🔄 IN PROGRESS

- [x] Security: rate limiting (ThrottlerGuard on all endpoints)
- [x] Input validation (ValidationPipe with DTOs)
- [x] PDF/DOCX parsing (LangChain loaders)
- [x] Document chunking (RecursiveCharacterTextSplitter)
- [x] Basic logging (Winston)
- [x] API documentation (Swagger/OpenAPI setup)
- [ ] Unit tests (0% coverage)
- [ ] E2E tests
- [ ] Performance: caching embeddings, query optimization
- [ ] Monitoring: Prometheus metrics, Sentry
- [ ] File upload security: virus scanning
- [ ] Advanced security: input sanitization, WebSocket JWT
- [ ] Load testing
- [ ] Production deployment guide

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

- [x] All modules created with production-quality code
- [x] PDF/DOCX document parsing (LangChain)
- [x] Document chunking and embedding generation
- [x] Document ingestion pipeline working
- [x] SSE chat streaming working
- [x] Vector search with Qdrant
- [x] Admin endpoints secured with RBAC
- [x] Rate limiting on all endpoints
- [x] WebSocket audio gateway (client uses Chrome API)
- [ ] All unit tests passing (0% coverage - CRITICAL)
- [ ] All E2E tests passing (CRITICAL)
- [ ] Response times < 500ms for chat queries (needs load testing)

---

## Implementation Summary - March 2, 2026

### Completed in This Session

#### 1. Audio Module (Phase 5)

- ✅ Created `audio.gateway.ts` - WebSocket gateway for real-time audio streaming
- ✅ Created `speech-to-text.service.ts` - Transcription service (placeholder with integration points)
- ✅ Created `text-to-speech.service.ts` - Speech synthesis service (placeholder with integration points)
- ✅ Updated `audio.service.ts` - Integrated new services
- ✅ Updated `audio.module.ts` - Registered all providers
- ✅ Created `audio-chunk.dto.ts` - DTO for audio data validation

**Features:**

- WebSocket support for bidirectional audio streaming
- Speech-to-text transcription (ready for Whisper integration)
- Text-to-speech synthesis (ready for OpenAI TTS or ElevenLabs)
- Multiple TTS provider support
- Audio format validation

#### 2. RAG Pipeline Enhancements

- ✅ Updated `rag.service.ts` - Added embeddings queue integration
- ✅ Updated `rag.module.ts` - Added BullMQ queue registration
- ✅ Updated `generate-embeddings.processor.ts` - Added document completion tracking
- ✅ Embeddings now queued automatically after document chunking

**Improvements:**

- Documents progress from pending → processing → completed
- Automatic embedding count tracking
- Document completion detection when all chunks have embeddings

#### 3. Code Quality

- ✅ Fixed all ESLint import ordering issues
- ✅ Fixed TypeScript type errors
- ✅ All files pass `npm run check-types`
- ✅ Proper error handling and logging throughout

### Architecture Overview

```text
Document Upload Flow:
1. User uploads file → Documents Controller
2. Document record created (status: pending)
3. Queue: process-document job
4. Extract text + chunk document
5. Queue: generate-embeddings jobs (one per chunk)
6. Generate embeddings + store in Qdrant
7. Update document (status: completed)

Chat Flow:
1. User sends message → Chat Controller
2. Generate query embedding
3. Search Qdrant for similar chunks
4. Build context-aware prompt
5. Stream LLM response via SSE
6. Save messages to database

Audio Flow:
1. Client connects via WebSocket
2. Audio chunks sent to gateway
3. Transcribe to text (STT)
4. Process through chat pipeline
5. Generate audio response (TTS)
6. Stream back to client
```

### Next Steps (Phase 6)

1. **TTS/STT Integration** ✅ HANDLED CLIENT-SIDE
   - Audio features use Chrome Web Speech API (client-side)
   - Server WebSocket gateway ready for audio streaming
   - Server-side placeholder services available if needed

2. **PDF/DOCX Parsing** ✅ COMPLETED
   - Using LangChain PDFLoader for PDF extraction
   - Using LangChain DocxLoader for DOCX extraction
   - Using RecursiveCharacterTextSplitter for chunking
   - Multi-page documents fully supported

3. **Testing** ⚠️ CRITICAL
   - Write unit tests for all services
   - Write E2E tests for critical flows
   - Add integration tests for BullMQ jobs

4. **Performance**
   - Add Redis caching for embeddings
   - Optimize database queries
   - Add connection pooling
   - Load test with multiple concurrent users

5. **Security**
   - Add file upload virus scanning
   - Implement rate limiting per user
   - Add input sanitization
   - Secure WebSocket connections with JWT

6. **Monitoring**
   - Add Prometheus metrics
   - Setup error tracking (Sentry)
   - Add performance monitoring
   - Create admin dashboard

7. **Documentation**
   - Generate Swagger/OpenAPI docs
   - Create user guide
   - Document API endpoints
   - Add deployment guide

---
