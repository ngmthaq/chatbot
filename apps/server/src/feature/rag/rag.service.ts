import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

import { PrismaService } from '../../core/database/prisma.service';
import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { OllamaService } from '../ollama/ollama.service';

import { DocumentChunkingService } from './document-chunking.service';
import { PromptConstructionService } from './prompt-construction.service';
import {
  VectorRetrievalService,
  RetrievedSource,
} from './vector-retrieval.service';

interface RagQueryOptions {
  conversationId: number;
  userId: number;
  userMessage: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  contextWindow?: number;
  topK?: number;
}

export interface RagResponse {
  response: string;
  sources: RetrievedSource[];
  tokenUsage: {
    prompt: number;
    completion: number;
    total: number;
  };
}

@Injectable()
export class RagService {
  private readonly logger = new Logger(RagService.name);

  constructor(
    private readonly ollamaService: OllamaService,
    private readonly chunkingService: DocumentChunkingService,
    private readonly vectorRetrievalService: VectorRetrievalService,
    private readonly promptService: PromptConstructionService,
    private readonly prismaService: PrismaService,
    @InjectQueue('generate-embeddings')
    private readonly embeddingsQueue: Queue,
  ) {}

  /**
   * Execute RAG query and stream response
   */
  async executeRagQuery(
    options: RagQueryOptions,
  ): Promise<AsyncIterable<string>> {
    this.logger.debug(
      `Executing RAG query for conversation ${options.conversationId}`,
    );

    try {
      // 1. Generate embedding for user message
      const queryEmbedding = await this.ollamaService.generateEmbedding(
        options.userMessage,
      );

      // 2. Retrieve top-K similar documents from Qdrant
      const sources = await this.vectorRetrievalService.retrieveTopK(
        queryEmbedding,
        options.topK || 5,
        options.userId,
      );

      // 3. Retrieve conversation history
      const conversation = await this.prismaService.conversation.findUnique({
        where: { id: options.conversationId },
        include: {
          messages: {
            take: -(options.contextWindow || 20),
            orderBy: { createdAt: 'asc' },
          },
        },
      });

      if (!conversation) {
        throw ExceptionBuilder.notFound({
          errors: ['Conversation not found'],
        });
      }

      // 4. Construct prompt with context
      const prompt = await this.promptService.buildPrompt({
        userMessage: options.userMessage,
        sources,
        history: conversation.messages || [],
      });

      // 5. Stream response from Ollama
      return this.ollamaService.generateText({
        model: options.model || 'llama3',
        prompt,
        temperature: options.temperature,
        num_predict: options.maxTokens,
      });
    } catch (error) {
      this.logger.error(
        `RAG query failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }

  /**
   * Process document chunks and prepare for embedding
   * Called from BullMQ processor
   */
  async processDocumentChunks(
    documentId: number,
    userId: number,
    text: string,
  ): Promise<void> {
    this.logger.debug(`Processing chunks for document ${documentId}`);

    try {
      // Chunk the document
      await this.chunkingService.chunkDocument(documentId, text);

      // Get all chunks for this document
      const chunks = await this.prismaService.documentChunk.findMany({
        where: { documentId },
        orderBy: { chunkIndex: 'asc' },
      });

      this.logger.debug(
        `Queueing ${chunks.length} chunks for embedding generation`,
      );

      // Queue embeddings generation for each chunk
      for (const chunk of chunks) {
        await this.embeddingsQueue.add(
          'generate-embeddings',
          {
            documentId,
            chunkId: chunk.id,
            text: chunk.text,
            userId,
          },
          {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 2000,
            },
          },
        );
      }

      // Update document status to processing (embeddings step)
      await this.prismaService.document.update({
        where: { id: documentId },
        data: {
          status: 'processing',
          chunkCount: chunks.length,
        },
      });

      this.logger.log(
        `Successfully chunked document ${documentId} and queued ${chunks.length} embedding jobs`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process document ${documentId}: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      throw error;
    }
  }
}
