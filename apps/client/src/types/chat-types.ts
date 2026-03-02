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
  model: string;
  temperature: number;
  maxTokens: number;
  contextWindow: number;
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
  model: string;
  temperature: number;
  maxTokens: number;
  contextWindow: number;
}

export interface CreateConversationDto {
  title?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  contextWindow?: number;
}

export interface UpdateConversationDto extends Partial<ConversationSettings> {
  id: number;
}

export interface SendMessageDto {
  content: string;
}

export enum SSEEventType {
  CHUNK = 'chunk',
  DONE = 'done',
  ERROR = 'error',
}

export interface SSEChunkEvent {
  type: SSEEventType;
  data?: string;
  error?: string;
  metadata?: {
    sourceDocuments?: SourceDocument[];
    tokenUsage?: number;
    finishReason?: string;
  };
}

export interface StreamState {
  conversationId: number | null;
  content: string;
  status: 'idle' | 'streaming' | 'complete' | 'error';
  tokenUsage?: number;
  sourceDocuments?: SourceDocument[];
  error?: string;
}
