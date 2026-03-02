import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';

import { CHAT_ROUTES } from '../constants/api-routes';
import apiClient from '../utils/api-client';

interface SendMessageDto {
  content: string;
}

interface SendMessageResponse {
  messageId: number;
  content: string;
  tokenUsage: {
    prompt: number;
    completion: number;
    total: number;
  };
}

export function useSendMessage(conversationId: number) {
  const queryClient = useQueryClient();

  return useMutation<SendMessageResponse, AxiosError, SendMessageDto>({
    mutationFn: async (dto: SendMessageDto) => {
      const response = await apiClient.post<{ data: SendMessageResponse }>(
        CHAT_ROUTES.MESSAGES(conversationId),
        dto,
      );
      return response.data.data;
    },
    onSuccess: () => {
      // Invalidate conversation query to refetch messages
      queryClient.invalidateQueries({
        queryKey: ['conversation', conversationId],
      });
    },
  });
}
