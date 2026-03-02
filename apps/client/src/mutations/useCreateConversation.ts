import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';

import { CHAT_ROUTES } from '../constants/api-routes';
import { APP_CONFIG } from '../constants/app-config';
import { selectedConversationIdAtom } from '../stores/conversation-store';
import type { ApiResponse } from '../types/api-types';
import type { CreateConversationDto, Conversation } from '../types/chat-types';
import apiClient, { unwrapResponse } from '../utils/api-client';
import { showSuccessToast } from '../utils/error-handler';

export function useCreateConversation() {
  const queryClient = useQueryClient();
  const setSelectedConversationId = useSetAtom(selectedConversationIdAtom);

  return useMutation({
    mutationFn: async (data?: CreateConversationDto) => {
      const payload = {
        model: data?.model || APP_CONFIG.DEFAULT_MODEL,
        temperature: data?.temperature ?? APP_CONFIG.DEFAULT_TEMPERATURE,
        maxTokens: data?.maxTokens || APP_CONFIG.DEFAULT_MAX_TOKENS,
        contextWindow: data?.contextWindow || APP_CONFIG.DEFAULT_CONTEXT_WINDOW,
        ...data,
      };
      const response = await apiClient.post<ApiResponse<Conversation>>(
        CHAT_ROUTES.CONVERSATIONS,
        payload,
      );
      return unwrapResponse(response);
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setSelectedConversationId(conversation.id);
      showSuccessToast('New conversation created');
    },
  });
}
