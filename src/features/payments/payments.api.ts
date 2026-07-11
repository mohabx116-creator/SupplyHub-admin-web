import { request } from '@/lib/api/api-client';
import { routes } from '@/lib/routes/routes';
import type { ListPaymentsParams, PaymentRecord } from './payments.types';

const buildParams = (params?: ListPaymentsParams) => {
  if (!params) {
    return undefined;
  }

  return {
    ...(params.status ? { status: params.status } : {}),
    ...(params.method ? { method: params.method } : {}),
    ...(params.companyId ? { companyId: params.companyId } : {}),
    ...(params.orderId ? { orderId: params.orderId } : {}),
    ...(params.reference ? { reference: params.reference } : {}),
  };
};

export const listPayments = async (
  params?: ListPaymentsParams,
): Promise<PaymentRecord[]> =>
  request<PaymentRecord[]>({
    method: 'GET',
    url: routes.api.adminPayments,
    params: buildParams(params),
  });

export const getPaymentById = async (id: string): Promise<PaymentRecord> =>
  request<PaymentRecord>({
    method: 'GET',
    url: `${routes.api.adminPayments}/${id}`,
  });
