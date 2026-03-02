import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DOCUMENTS_ROUTES } from '../constants/api-routes';
import type { ApiResponse } from '../types/api-types';
import type { Document } from '../types/document-types';
import apiClient, { unwrapResponse } from '../utils/api-client';
import { showSuccessToast } from '../utils/error-handler';

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiClient.post<ApiResponse<Document>>(
        DOCUMENTS_ROUTES.UPLOAD,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      return unwrapResponse(response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      showSuccessToast('Document uploaded successfully');
    },
  });
}
