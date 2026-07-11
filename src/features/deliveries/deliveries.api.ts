import { request } from '@/lib/api/api-client';
import { routes } from '@/lib/routes/routes';
import type { DeliveryRecord, ListDeliveriesParams } from './deliveries.types';

const buildParams = (params?: ListDeliveriesParams) => {
  if (!params) {
    return undefined;
  }

  return {
    ...(params.status ? { status: params.status } : {}),
    ...(params.method ? { method: params.method } : {}),
    ...(params.companyId ? { companyId: params.companyId } : {}),
    ...(params.orderId ? { orderId: params.orderId } : {}),
    ...(params.trackingReference
      ? { trackingReference: params.trackingReference }
      : {}),
  };
};

export const listDeliveries = async (
  params?: ListDeliveriesParams,
): Promise<DeliveryRecord[]> =>
  request<DeliveryRecord[]>({
    method: 'GET',
    url: routes.api.adminDeliveries,
    params: buildParams(params),
  });

export const getDeliveryById = async (id: string): Promise<DeliveryRecord> =>
  request<DeliveryRecord>({
    method: 'GET',
    url: `${routes.api.adminDeliveries}/${id}`,
  });
