import { request } from '@/lib/api/api-client';
import { routes } from '@/lib/routes/routes';
import type {
  ListRequestsParams,
  RequestRecord,
  UpdateRequestStatusPayload,
} from './requests.types';

const buildParams = (params?: ListRequestsParams) => {
  if (!params) {
    return undefined;
  }

  return {
    ...(params.status ? { status: params.status } : {}),
    ...(params.companyId ? { companyId: params.companyId } : {}),
  };
};

export const listRequests = async (
  params?: ListRequestsParams,
): Promise<RequestRecord[]> =>
  request<RequestRecord[]>({
    method: 'GET',
    url: routes.api.adminRequests,
    params: buildParams(params),
  });

export const getRequestById = async (id: string): Promise<RequestRecord> =>
  request<RequestRecord>({
    method: 'GET',
    url: `${routes.api.adminRequests}/${id}`,
  });

export const updateRequestStatus = async (
  id: string,
  payload: UpdateRequestStatusPayload,
): Promise<RequestRecord> =>
  request<RequestRecord>({
    method: 'PATCH',
    url: `${routes.api.adminRequests}/${id}/status`,
    data: payload,
  });
