import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosRequestConfig,
} from 'axios';
import { env } from '@/lib/config/env';
import { ApiError } from './api-error';
import { readStoredAccessToken } from '@/features/auth/auth.storage';

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const accessToken = readStoredAccessToken();

  if (accessToken) {
    const headers = AxiosHeaders.from(config.headers);
    headers.set('Authorization', `Bearer ${accessToken}`);
    config.headers = headers;
  }

  return config;
});

const getMessage = (error: unknown): string => {
  if (typeof error === 'string') {
    return error;
  }

  if (error && typeof error === 'object' && 'message' in error) {
    const maybeMessage = (error as { message?: unknown }).message;
    if (typeof maybeMessage === 'string') {
      return maybeMessage;
    }
  }

  return 'Unexpected API error';
};

export const toApiError = (error: unknown): ApiError => {
  const axiosError = error as AxiosError<{
    message?: string;
    code?: string;
    error?: string;
    details?: Record<string, unknown> | string;
  }>;

  if (axiosError?.isAxiosError && axiosError.response) {
    const payload = axiosError.response.data;
    return new ApiError(payload?.message ?? 'Request failed', {
      status: axiosError.response.status,
      code: payload?.code ?? payload?.error ?? 'HTTP_ERROR',
      details: payload?.details ?? payload ?? null,
    });
  }

  return new ApiError(getMessage(error));
};

export async function request<TResponse>(
  config: AxiosRequestConfig,
): Promise<TResponse> {
  try {
    const response = await apiClient.request<TResponse>(config);
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}
