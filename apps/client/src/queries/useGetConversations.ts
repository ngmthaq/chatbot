import { useQuery } from '@tanstack/react-query';

import { CHAT_ROUTES } from '../constants/api-routes';
import type { PaginationQuery } from '../types/api-types';
import type { Conversation } from '../types/chat-types';
import apiClient, { unwrapPaginatedResponse } from '../utils/api-client';

export function useGetConversations(params?: PaginationQuery) {
  return useQuery({
    queryKey: ['conversations', params],
    queryFn: async () => {
      const response = await apiClient.get(CHAT_ROUTES.CONVERSATIONS, {
        params,
      });
      return unwrapPaginatedResponse<Conversation>(response);
    },
  });
}
