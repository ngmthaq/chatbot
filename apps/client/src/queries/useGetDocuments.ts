import { useQuery } from '@tanstack/react-query';

import { DOCUMENTS_ROUTES } from '../constants/api-routes';
import type { PaginationQuery } from '../types/api-types';
import type { Document } from '../types/document-types';
import apiClient, { unwrapPaginatedResponse } from '../utils/api-client';

export function useGetDocuments(params?: PaginationQuery) {
  return useQuery({
    queryKey: ['documents', params],
    queryFn: async () => {
      const response = await apiClient.get(DOCUMENTS_ROUTES.BASE, { params });
      return unwrapPaginatedResponse<Document>(response);
    },
  });
}
