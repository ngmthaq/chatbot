import { useAtom, useSetAtom } from 'jotai';
import { useCallback } from 'react';

import { CHAT_ROUTES } from '../constants/api-routes';
import {
  isStreamingAtom,
  abortControllerAtom,
  currentStreamAtom,
  startStreamAtom,
  updateStreamContentAtom,
  completeStreamAtom,
  errorStreamAtom,
  resetStreamAtom,
} from '../stores/streaming-store';
import { createSSEStream, type SSEHandlers } from '../utils/sse-parser';
import { getAccessToken } from '../utils/token-manager';

export function useSSEChat() {
  const isStreaming = useAtom(isStreamingAtom)[0];
  const [abortController, setAbortController] = useAtom(abortControllerAtom);
  const currentStream = useAtom(currentStreamAtom)[0];
  const startStream = useSetAtom(startStreamAtom);
  const updateContent = useSetAtom(updateStreamContentAtom);
  const completeStream = useSetAtom(completeStreamAtom);
  const errorStream = useSetAtom(errorStreamAtom);
  const resetStream = useSetAtom(resetStreamAtom);

  const sendMessage = useCallback(
    async (conversationId: number, content: string) => {
      // Get access token
      const token = getAccessToken();
      if (!token) {
        errorStream('Authentication required');
        return;
      }

      // Start new stream
      startStream(conversationId);

      const url = CHAT_ROUTES.MESSAGES(conversationId);
      const body = { content };

      let accumulatedContent = '';

      const handlers: SSEHandlers = {
        onChunk: (data: string) => {
          accumulatedContent += data;
          updateContent(accumulatedContent);
        },
        onDone: (metadata) => {
          completeStream(metadata);
        },
        onError: (error: string) => {
          errorStream(error);
        },
      };

      try {
        const controller = await createSSEStream(url, body, token, handlers);
        setAbortController(controller);
      } catch (error) {
        errorStream(
          error instanceof Error ? error.message : 'Failed to send message',
        );
      }
    },
    [
      startStream,
      updateContent,
      completeStream,
      errorStream,
      setAbortController,
    ],
  );

  const stopGeneration = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
    resetStream();
  }, [abortController, setAbortController, resetStream]);

  return {
    sendMessage,
    stopGeneration,
    isStreaming,
    currentStream,
    resetStream,
  };
}
