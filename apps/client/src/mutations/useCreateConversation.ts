import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { useTranslation } from 'react-i18next';

import { CHAT_ROUTES } from '../constants/api-routes';
import { selectedConversationIdAtom } from '../stores/conversation-store';
import type { ApiResponse } from '../types/api-types';
import type { CreateConversationDto, Conversation } from '../types/chat-types';
import apiClient, { unwrapResponse } from '../utils/api-client';
import { showSuccessToast } from '../utils/error-handler';

export function useCreateConversation() {
  const queryClient = useQueryClient();
  const setSelectedConversationId = useSetAtom(selectedConversationIdAtom);
  const { t } = useTranslation();

  return useMutation({
    mutationFn: async (data?: CreateConversationDto) => {
      const response = await apiClient.post<ApiResponse<Conversation>>(
        CHAT_ROUTES.CONVERSATIONS,
        data,
      );
      return unwrapResponse(response);
    },
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setSelectedConversationId(conversation.id);
      showSuccessToast(t('chat:actions.created'));
    },
  });
}
