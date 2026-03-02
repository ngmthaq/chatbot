import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CHAT_ROUTES } from '../constants/api-routes';
import type { ApiResponse } from '../types/api-types';
import type { UpdateConversationDto, Conversation } from '../types/chat-types';
import apiClient, { unwrapResponse } from '../utils/api-client';
import { showSuccessToast } from '../utils/error-handler';

export function useUpdateConversation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateConversationDto) => {
      const { id, ...payload } = data;
      const response = await apiClient.patch<ApiResponse<Conversation>>(
        CHAT_ROUTES.CONVERSATION(id),
        payload,
      );
      return unwrapResponse(response);
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({
        queryKey: ['conversation', conversation.id],
      });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      showSuccessToast('Conversation updated');
    },
  });
}
