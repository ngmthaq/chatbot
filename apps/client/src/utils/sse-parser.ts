import { createParser, type EventSourceMessage } from 'eventsource-parser';

import type { SSEChunkEvent } from '../types/chat-types';

export const parseSSEEvent = (eventData: string): SSEChunkEvent | null => {
  try {
    const parsed = JSON.parse(eventData);
    return parsed as SSEChunkEvent;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to parse SSE event:', error);
    return null;
  }
};

export interface SSEHandlers {
  onChunk: (data: string) => void;
  onDone: (metadata?: {
    tokenUsage?: number;
    sourceDocuments?: Array<{
      pageContent: string;
      metadata?: Record<string, unknown>;
    }>;
  }) => void;
  onError: (error: string) => void;
}

export const createSSEStream = async (
  url: string,
  body: Record<string, unknown>,
  token: string,
  handlers: SSEHandlers,
): Promise<AbortController> => {
  const abortController = new AbortController();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      signal: abortController.signal,
    });

    if (!response.ok) {
      const errorData = await response.json();
      handlers.onError(errorData.message || 'Failed to send message');
      return abortController;
    }

    const reader = response.body?.getReader();
    if (!reader) {
      handlers.onError('Response body is not readable');
      return abortController;
    }

    const decoder = new TextDecoder();

    const parser = createParser({
      onEvent: (event: EventSourceMessage) => {
        const parsedEvent = parseSSEEvent(event.data);

        if (parsedEvent) {
          switch (parsedEvent.type) {
            case 'chunk':
              if (parsedEvent.data) {
                handlers.onChunk(parsedEvent.data);
              }
              break;
            case 'done':
              handlers.onDone(parsedEvent.metadata);
              break;
            case 'error':
              handlers.onError(parsedEvent.error || 'Stream error');
              break;
          }
        }
      },
    });

    // Read the stream
    const processStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          parser.feed(chunk);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          handlers.onError(error.message || 'Stream reading error');
        }
      } finally {
        reader.releaseLock();
      }
    };

    processStream();
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      handlers.onError(error.message || 'Failed to establish SSE connection');
    }
  }

  return abortController;
};
