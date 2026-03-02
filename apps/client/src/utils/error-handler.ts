import type { AxiosError } from 'axios';
import { toast } from 'sonner';

import type { ErrorResponse } from '../types/api-types';

export const handleApiError = (
  error: unknown,
  customMessage?: string,
): string => {
  const axiosError = error as AxiosError<ErrorResponse>;

  let errorMessage = customMessage || 'An unexpected error occurred';

  if (axiosError.response?.data) {
    const { message } = axiosError.response.data;

    if (Array.isArray(message)) {
      errorMessage = message.join(', ');
    } else if (typeof message === 'string') {
      errorMessage = message;
    }
  } else if (axiosError.message) {
    errorMessage = axiosError.message;
  }

  return errorMessage;
};

export const showErrorToast = (
  error: unknown,
  customMessage?: string,
): void => {
  const errorMessage = handleApiError(error, customMessage);
  toast.error(errorMessage);
};

export const showSuccessToast = (message: string): void => {
  toast.success(message);
};

export const showInfoToast = (message: string): void => {
  toast.info(message);
};

export const showWarningToast = (message: string): void => {
  toast.warning(message);
};

export const getErrorMessage = (error: unknown): string => {
  return handleApiError(error);
};

export const isNetworkError = (error: unknown): boolean => {
  const axiosError = error as AxiosError;
  return axiosError.message === 'Network Error' || !axiosError.response;
};

export const isAuthError = (error: unknown): boolean => {
  const axiosError = error as AxiosError;
  return axiosError.response?.status === 401;
};

export const isForbiddenError = (error: unknown): boolean => {
  const axiosError = error as AxiosError;
  return axiosError.response?.status === 403;
};

export const isNotFoundError = (error: unknown): boolean => {
  const axiosError = error as AxiosError;
  return axiosError.response?.status === 404;
};

export const isValidationError = (error: unknown): boolean => {
  const axiosError = error as AxiosError<ErrorResponse>;
  return (
    axiosError.response?.status === 400 &&
    Array.isArray(axiosError.response?.data?.message)
  );
};
