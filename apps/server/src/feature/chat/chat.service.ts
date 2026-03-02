import { Injectable, Logger } from '@nestjs/common';

import { Prisma } from '../../../prisma-generated/client';
import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { ExceptionDict } from '../../core/exception/exception-dict';
import { PrismaService } from '../../core/database/prisma.service';

import { CreateConversationDto } from './create-conversation.dto';
import { GetConversationListDto } from './get-conversation-list.dto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create new conversation
   */
  async createConversation(userId: number, dto: CreateConversationDto) {
    this.logger.debug(`Creating conversation for user ${userId}`);

    return this.prismaService.conversation.create({
      data: {
        userId,
        title: dto.title,
        model: dto.model,
        temperature: dto.temperature,
        maxTokens: dto.maxTokens,
        contextWindow: dto.contextWindow,
      },
    });
  }

  /**
   * Get user's conversations with pagination
   */
  async getConversations(userId: number, dto: GetConversationListDto) {
    const skip = ((dto.page || 1) - 1) * (dto.limit || 10);

    const [conversations, total] = await Promise.all([
      this.prismaService.conversation.findMany({
        where: {
          userId,
          isArchived: dto.isArchived,
        },
        skip,
        take: dto.limit || 10,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.conversation.count({
        where: {
          userId,
          isArchived: dto.isArchived,
        },
      }),
    ]);

    return {
      data: conversations,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / (dto.limit || 10)),
        currentPage: dto.page || 1,
      },
    };
  }

  /**
   * Get conversation details with messages
   */
  async getConversation(conversationId: number) {
    const conversation = await this.prismaService.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!conversation) {
      throw ExceptionBuilder.notFound({
        errors: [ExceptionDict.conversationNotFound()],
      });
    }

    return conversation;
  }

  /**
   * Create message in conversation
   */
  async createMessage(
    conversationId: number,
    userId: number,
    role: 'user' | 'assistant',
    content: string,
    sourceDocuments?: Record<string, unknown>[],
    tokenUsage?: number,
  ) {
    return this.prismaService.message.create({
      data: {
        conversationId,
        role,
        content,
        sourceDocuments: sourceDocuments
          ? (JSON.stringify(
              sourceDocuments,
            ) as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        tokenUsage,
      },
    });
  }

  /**
   * Archive conversation
   */
  async archiveConversation(conversationId: number) {
    return this.prismaService.conversation.update({
      where: { id: conversationId },
      data: { isArchived: true },
    });
  }

  /**
   * Delete conversation
   */
  async deleteConversation(conversationId: number) {
    return this.prismaService.conversation.delete({
      where: { id: conversationId },
    });
  }

  /**
   * Get conversation messages
   */
  async getMessages(conversationId: number, limit: number = 50) {
    return this.prismaService.message.findMany({
      where: { conversationId },
      take: limit,
      orderBy: { createdAt: 'asc' },
    });
  }
}
