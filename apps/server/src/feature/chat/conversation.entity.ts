import { Exclude } from 'class-transformer';

export class ConversationEntity {
  id: number;
  userId: number;
  title: string;
  model: string;
  temperature: number;
  maxTokens: number;
  contextWindow: number;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;

  @Exclude()
  __v?: number;
}
