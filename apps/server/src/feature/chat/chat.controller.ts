import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  Res,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';

import { ExceptionBuilder } from '../../core/exception/exception-builder';
import { ResponseBuilder } from '../../core/response/response-builder';
import { AuthGuard } from '../auth/auth.guard';
import { PromptInjectionGuard } from '../rag/prompt-injection.guard';
import { RagService } from '../rag/rag.service';
import { Action } from '../rbac/action';
import { Module } from '../rbac/module';
import { Rbac } from '../rbac/rbac.decorator';
import { RbacGuard } from '../rbac/rbac.guard';

import { ChatService } from './chat.service';
import { ConversationOwnershipGuard } from './conversation-ownership.guard';
import { CreateConversationDto } from './create-conversation.dto';
import { CreateMessageDto } from './create-message.dto';
import { GetConversationListDto } from './get-conversation-list.dto';

export interface AuthRequest extends Request {
  authentication: { sub: number };
}

@Controller('chat')
@UseGuards(ThrottlerGuard, AuthGuard, RbacGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly ragService: RagService,
  ) {}

  /**
   * Create new conversation
   */
  @Post('conversations')
  @Rbac(Module.CHAT, Action.CREATE)
  async createConversation(
    @Body() dto: CreateConversationDto,
    @Req() req: AuthRequest,
  ) {
    const conversation = await this.chatService.createConversation(
      req.authentication.sub,
      dto,
    );

    return ResponseBuilder.data(conversation);
  }

  /**
   * Get user's conversations
   */
  @Get('conversations')
  @Rbac(Module.CHAT, Action.READ)
  async getConversations(
    @Query() dto: GetConversationListDto,
    @Req() req: AuthRequest,
  ) {
    const result = await this.chatService.getConversations(
      req.authentication.sub,
      dto,
    );

    return ResponseBuilder.pagination(result.data, result.pagination);
  }

  /**
   * Get conversation details
   */
  @Get('conversations/:conversationId')
  @UseGuards(ConversationOwnershipGuard)
  @Rbac(Module.CHAT, Action.READ)
  async getConversation(@Param('conversationId') conversationId: string) {
    const conversation = await this.chatService.getConversation(
      Number(conversationId),
    );

    return ResponseBuilder.data(conversation);
  }

  /**
   * Send message and stream response via SSE
   */
  @Post('conversations/:conversationId/messages')
  @UseGuards(ConversationOwnershipGuard, PromptInjectionGuard)
  @Rbac(Module.CHAT, Action.CREATE)
  async streamMessage(
    @Param('conversationId') conversationId: string,
    @Body() dto: CreateMessageDto,
    @Res() res: Response,
    @Req() req: AuthRequest,
  ) {
    const userId = req.authentication.sub;
    const convId = Number(conversationId);

    try {
      // Save user message
      await this.chatService.createMessage(convId, userId, 'user', dto.content);

      // Get conversation config
      const conversation = await this.chatService.getConversation(convId);

      // Setup SSE response
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');

      // Stream RAG response
      let fullResponse = '';

      try {
        const ragStream = await this.ragService.executeRagQuery({
          conversationId: convId,
          userId,
          userMessage: dto.content,
          model: conversation.model,
          temperature: conversation.temperature,
          maxTokens: conversation.maxTokens,
          contextWindow: conversation.contextWindow,
        });

        for await (const chunk of ragStream) {
          fullResponse += chunk;
          res.write(
            `data: ${JSON.stringify({ type: 'chunk', data: chunk })}\n\n`,
          );
        }

        // Save assistant message
        const assistantMessage = await this.chatService.createMessage(
          convId,
          userId,
          'assistant',
          fullResponse,
          undefined,
          0, // TODO: implement token counting
        );

        // Send completion event
        res.write(
          `data: ${JSON.stringify({
            type: 'done',
            data: {
              messageId: assistantMessage.id,
              tokenUsage: {
                prompt: 0,
                completion: 0,
                total: 0,
              },
            },
          })}\n\n`,
        );

        res.end();
      } catch (error) {
        res.write(
          `data: ${JSON.stringify({
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          })}\n\n`,
        );
        res.end();
      }
    } catch (error) {
      return res.status(400).json(
        ExceptionBuilder.badRequest({
          errors: [error instanceof Error ? error.message : 'Unknown error'],
        }),
      );
    }
  }

  /**
   * Archive conversation
   */
  @Patch('conversations/:conversationId/archive')
  @UseGuards(ConversationOwnershipGuard)
  @Rbac(Module.CHAT, Action.UPDATE)
  async archiveConversation(@Param('conversationId') conversationId: string) {
    await this.chatService.archiveConversation(Number(conversationId));

    return ResponseBuilder.success(true);
  }

  /**
   * Delete conversation
   */
  @Delete('conversations/:conversationId')
  @UseGuards(ConversationOwnershipGuard)
  @Rbac(Module.CHAT, Action.DELETE)
  async deleteConversation(@Param('conversationId') conversationId: string) {
    await this.chatService.deleteConversation(Number(conversationId));

    return ResponseBuilder.success(true);
  }
}
