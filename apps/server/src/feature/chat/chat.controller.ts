import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  Req,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';

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

@ApiTags('Chat')
@ApiBearerAuth()
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
  @ApiOperation({
    summary: 'Create conversation',
    description: 'Create a new chat conversation',
  })
  @ApiResponse({
    status: 201,
    description: 'Conversation created successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({
    summary: 'Get conversations',
    description: 'Get list of user conversations',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversations retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
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
  @ApiOperation({
    summary: 'Get conversation',
    description: 'Get conversation details with messages',
  })
  @ApiParam({
    name: 'conversationId',
    description: 'Conversation ID',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async getConversation(@Param('conversationId') conversationId: string) {
    const conversation = await this.chatService.getConversation(
      Number(conversationId),
    );

    return ResponseBuilder.data(conversation);
  }

  /**
   * Send message and get response
   */
  @Post('conversations/:conversationId/messages')
  @UseGuards(ConversationOwnershipGuard, PromptInjectionGuard)
  @Rbac(Module.CHAT, Action.CREATE)
  @ApiOperation({
    summary: 'Send message',
    description: 'Send message and get AI response',
  })
  @ApiParam({
    name: 'conversationId',
    description: 'Conversation ID',
    type: 'number',
  })
  @ApiResponse({ status: 200, description: 'Message sent, response received' })
  @ApiResponse({
    status: 400,
    description: 'Invalid message or prompt injection detected',
  })
  async sendMessage(
    @Param('conversationId') conversationId: string,
    @Body() dto: CreateMessageDto,
    @Req() req: AuthRequest,
  ) {
    const userId = req.authentication.sub;
    const convId = Number(conversationId);

    try {
      // Save user message
      await this.chatService.createMessage(convId, userId, 'user', dto.content);

      // Get conversation config
      const conversation = await this.chatService.getConversation(convId);

      // Get response from RAG
      const response = await this.ragService.executeRagQuery({
        conversationId: convId,
        userId,
        userMessage: dto.content,
        model: conversation.model,
        temperature: conversation.temperature,
        maxTokens: conversation.maxTokens,
        contextWindow: conversation.contextWindow,
      });

      // Save assistant message
      const assistantMessage = await this.chatService.createMessage(
        convId,
        userId,
        'assistant',
        response,
        undefined,
        0, // TODO: implement token counting
      );

      // Return response
      return ResponseBuilder.data({
        messageId: assistantMessage.id,
        content: response,
        tokenUsage: {
          prompt: 0,
          completion: 0,
          total: 0,
        },
      });
    } catch (error) {
      throw ExceptionBuilder.badRequest({
        errors: [
          error instanceof Error ? error.message : 'Failed to send message',
        ],
      });
    }
  }

  /**
   * Archive conversation
   */
  @Patch('conversations/:conversationId/archive')
  @UseGuards(ConversationOwnershipGuard)
  @Rbac(Module.CHAT, Action.UPDATE)
  @ApiOperation({
    summary: 'Archive conversation',
    description: 'Archive a conversation (soft delete)',
  })
  @ApiParam({
    name: 'conversationId',
    description: 'Conversation ID',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation archived successfully',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
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
  @ApiOperation({
    summary: 'Delete conversation',
    description: 'Permanently delete a conversation and all messages',
  })
  @ApiParam({
    name: 'conversationId',
    description: 'Conversation ID',
    type: 'number',
  })
  @ApiResponse({
    status: 200,
    description: 'Conversation deleted successfully',
  })
  @ApiResponse({ status: 404, description: 'Conversation not found' })
  async deleteConversation(@Param('conversationId') conversationId: string) {
    await this.chatService.deleteConversation(Number(conversationId));

    return ResponseBuilder.success(true);
  }
}
