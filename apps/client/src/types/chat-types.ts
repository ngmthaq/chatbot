export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export interface Message {
  id: number;
  conversationId: number;
  role: MessageRole;
  content: string;
  sourceDocuments?: SourceDocument[];
  tokenUsage?: number;
  finishReason?: string;
  createdAt: string;
}

export interface SourceDocument {
  pageContent: string;
  metadata?: {
    documentId?: number;
    documentTitle?: string;
    chunkIndex?: number;
    score?: number;
    [key: string]: unknown;
  };
}

export interface Conversation {
  id: number;
  userId: number;
  title?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  messages?: Message[];
  _count?: {
    messages: number;
  };
}

export interface ConversationSettings {
  title?: string;
}

export interface CreateConversationDto {
  title?: string;
}

export interface UpdateConversationDto {
  id: number;
  title?: string;
}

export interface SendMessageDto {
  content: string;
}
