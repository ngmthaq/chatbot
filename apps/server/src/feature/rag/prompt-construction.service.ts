import { Injectable, Logger } from '@nestjs/common';

import { RetrievedSource } from './vector-retrieval.service';

interface PromptOptions {
  userMessage: string;
  sources: RetrievedSource[];
  history: Array<{ role: string; content: string }>;
}

@Injectable()
export class PromptConstructionService {
  private readonly logger = new Logger(PromptConstructionService.name);

  /**
   * Build RAG prompt with context from retrieved documents
   */
  async buildPrompt(options: PromptOptions): Promise<string> {
    const { userMessage, sources, history } = options;

    // Build conversation history
    const historyStr = history
      .slice(-20) // Last 20 messages
      .map((msg) => `${msg.role.toUpperCase()}: ${msg.content}`)
      .join('\n');

    // Build context from retrieved sources
    const contextStr = sources
      .map(
        (source, idx) =>
          `[Source ${idx + 1} (Match: ${(source.similarity * 100).toFixed(1)}%)]\n${source.text}`,
      )
      .join('\n\n');

    // Construct prompt
    const prompt = `You are a helpful assistant with access to the following documents.

## Context From Documents:
${contextStr || 'No relevant documents found.'}

## Conversation History:
${historyStr || 'This is the beginning of the conversation.'}

## Current Question:
USER: ${userMessage}

Provide a helpful, accurate answer based on the provided context. If the answer is not in the context, say so clearly. Always cite your sources by referencing when using information from the documents.`;

    return prompt;
  }
}
