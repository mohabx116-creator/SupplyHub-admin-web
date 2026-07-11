import { request } from '@/lib/api/api-client';
import { routes } from '@/lib/routes/routes';
import type { ListOrdersParams, OrderRecord } from './orders.types';

const buildParams = (params?: ListOrdersParams) => {
  if (!params) {
    return undefined;
  }

  return {
    ...(params.status ? { status: params.status } : {}),
    ...(params.companyId ? { companyId: params.companyId } : {}),
    ...(params.requestId ? { requestId: params.requestId } : {}),
    ...(params.search ? { search: params.search } : {}),
  };
};

export const listOrders = async (
  params?: ListOrdersParams,
): Promise<OrderRecord[]> =>
  request<OrderRecord[]>({
    method: 'GET',
    url: routes.api.adminOrders,
    params: buildParams(params),
  });

export const getOrderById = async (id: string): Promise<OrderRecord> =>
  request<OrderRecord>({
    method: 'GET',
    url: `${routes.api.adminOrders}/${id}`,
  });
