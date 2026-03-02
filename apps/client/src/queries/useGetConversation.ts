import { useQuery } from '@tanstack/react-query';

import { CHAT_ROUTES } from '../constants/api-routes';
import type { ApiResponse } from '../types/api-types';
import type { Conversation } from '../types/chat-types';
import apiClient, { unwrapResponse } from '../utils/api-client';

export function useGetConversation(id: number | null) {
  return useQuery({
    queryKey: ['conversation', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await apiClient.get<ApiResponse<Conversation>>(
        CHAT_ROUTES.CONVERSATION(id),
      );
      return unwrapResponse(response);
    },
    enabled: !!id,
  });
}
