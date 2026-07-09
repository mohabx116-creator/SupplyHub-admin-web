import { request } from '@/lib/api/api-client';
import { routes } from '@/lib/routes/routes';
import type { LoginRequest, LoginResponse } from './auth.types';

export const login = async (payload: LoginRequest): Promise<LoginResponse> =>
  request<LoginResponse>({
    method: 'POST',
    url: routes.auth.login,
    data: payload,
  });
